// 게임 출시 캘린더 - 프론트엔드 로직
// 데이터 소스: /data/games.json (리서처 Claude가 매일 9시에 갱신)

const categoryFilter = document.getElementById('category-filter');
const platformFilter = document.getElementById('platform-filter');
const periodFilter = document.getElementById('period-filter');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchCount = document.getElementById('search-count');
const filterReset = document.getElementById('filter-reset');
const gamesList = document.getElementById('games-list');
const lastUpdatedEl = document.getElementById('last-updated');
const footerUpdatedEl = document.getElementById('footer-updated-date');
const footerUpdatedWrap = footerUpdatedEl ? footerUpdatedEl.closest('.footer-updated') : null;

let allGames = [];
let categories = {};

// 카테고리 표시명 단일 출처(Single Source of Truth).
// 드롭다운 필터 / 통계줄 / 캘린더 범례 / 카드·모달 태그 4개 표면이 모두 이 맵을 참조한다.
// 문구는 메인 앱 기준으로 확정(글로벌 대작·신규 서버 등 표면별 표기 분기 제거).
const CATEGORY_LABELS = {
  mobile_kr: '국내 모바일',
  pc_console_kr: '국내 PC·콘솔',
  global_aaa: '글로벌 대작',
  new_server: '신규 서버',
};
let selectedDay = null;
let searchQuery = '';
let weekFilter = null; // null | 'this' | 'next'
let wishlistOnly = false; // wishlist-only filter chip

function getWeekRange(offset) {
  const t = new Date(); t.setHours(0,0,0,0);
  const dow = t.getDay();
  const toMon = dow === 0 ? -6 : -(dow - 1);
  const start = new Date(t); start.setDate(t.getDate() + toMon + offset * 7);
  const end = new Date(start); end.setDate(start.getDate() + 7);
  return { start, end };
}

const WISHLIST_KEY = 'gcalen.wishlist';
let wishlist = new Set();
try { wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')); } catch (_) {}
function saveWishlist() {
  try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist])); } catch (_) {}
}

async function loadData() {
  gamesList.innerHTML = '<p class="loading">불러오는 중...</p>';

  try {
    const res = await fetch('/data/games.json?t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    allGames = data.games || [];
    categories = Object.assign({}, data.categories || {}, CATEGORY_LABELS);

    if (lastUpdatedEl && data.last_updated) {
      const d = new Date(data.last_updated);
      lastUpdatedEl.textContent = `마지막 업데이트: ${formatDate(d)}`;
    }

    if (footerUpdatedWrap && footerUpdatedEl) {
      const d = data.last_updated ? new Date(data.last_updated) : null;
      if (d && !isNaN(d.getTime())) {
        const pad = n => String(n).padStart(2, '0');
        const absStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        const rel = formatRelativeTime(d);
        footerUpdatedEl.textContent = rel ? `${absStr} (${rel})` : absStr;
        footerUpdatedWrap.hidden = false;
      } else {
        footerUpdatedWrap.hidden = true;
      }
    }

    renderStatsSummary();
    renderHeroStrip();
    renderLegend();
    renderGames();
    // 최초 1회: 캘린더를 '오늘 이후 가장 가까운 출시 달'로 초기화 (사용자 네비 후엔 건드리지 않음)
    if (!calendarMonthInitialized) {
      const t0 = new Date(); t0.setHours(0, 0, 0, 0);
      const upcoming = allGames
        .map(g => parseReleaseDate(g.release_date))
        .filter(d => !isNaN(d.getTime()) && d >= t0)
        .sort((a, b) => a - b);
      if (upcoming.length) {
        calendarYear = upcoming[0].getFullYear();
        calendarMonth = upcoming[0].getMonth();
      }
      calendarMonthInitialized = true;
    }
    if (typeof renderCalendar === 'function') renderCalendar();
    openGameFromUrl();
  } catch (err) {
    console.error(err);
    gamesList.innerHTML = `<p class="error">데이터를 불러오지 못했어요: ${err.message}</p>`;
  }
}

// 카테고리별 건수 요약 한 줄 (현재 데이터 기준, 필터 무관)
function renderStatsSummary() {
  const el = document.getElementById('stats-summary');
  if (!el) return;
  const order = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];
  const counts = {};
  for (const g of allGames) counts[g.category] = (counts[g.category] || 0) + 1;
  const parts = order.map(k => `${CATEGORY_LABELS[k] || k} ${counts[k] || 0}`);
  parts.push(`총 ${allGames.length}`);
  el.textContent = parts.join(' · ');
  el.hidden = allGames.length === 0;
}

// 캘린더 범례 라벨도 단일 출처(CATEGORY_LABELS)를 참조하도록 채운다(점 모양 span은 보존).
function renderLegend() {
  const legend = document.getElementById('calendar-legend');
  if (!legend) return;
  for (const item of legend.querySelectorAll('.legend-item')) {
    const dot = item.querySelector('.legend-dot');
    if (!dot) continue;
    const key = (Array.from(dot.classList).find(c => c.startsWith('category-')) || '').slice(9);
    if (CATEGORY_LABELS[key]) item.lastChild.textContent = CATEGORY_LABELS[key];
  }
}

// 🔥 출시 임박 가로 하이라이트 스트립: D-7 이내(D-DAY~D-7) 게임을 최대 5개, 가까운 순으로.
// 임박 게임이 0건이면 섹션 전체를 숨긴다. 카드 클릭 → 기존 openModal 재사용.
function renderHeroStrip() {
  const section = document.getElementById('hero-section');
  const strip = document.getElementById('hero-strip');
  if (!section || !strip) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const imminent = allGames
    .map(g => ({ g, diff: Math.ceil((parseReleaseDate(g.release_date) - today) / 86400000) }))
    .filter(x => x.diff >= 0 && x.diff <= 7)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);
  if (!imminent.length) { strip.innerHTML = ''; section.hidden = true; return; }
  strip.innerHTML = imminent.map(({ g, diff }) => {
    const ddCls = ddayStageClass(diff).trim();
    const dd = diff === 0 ? 'D-DAY' : 'D-' + diff;
    const label = escapeHtml(categories[g.category] || g.category);
    const name = escapeHtml(g.name_ko || g.name_en || '');
    return `<button type="button" class="hero-card" data-id="${escapeHtml(g.id)}" data-cat="${escapeHtml(g.category)}" aria-label="${name} 상세 보기">`
      + `<span class="hero-card-cat">${label}</span>`
      + `<span class="hero-card-name">${name}</span>`
      + `<span class="hero-card-dday ${ddCls}">${dd}</span>`
      + `</button>`;
  }).join('');
  section.hidden = false;
}

function renderGames() {
  updateCategoryCounts();
  updateFilterReset();
  const selectedCategory = categoryFilter.value;
  const selectedPlatform = platformFilter.value.toLowerCase();
  const days = parseInt(periodFilter.value, 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filtered = allGames.filter(g => {
    if (selectedCategory && g.category !== selectedCategory) return false;

    if (searchQuery) {
      const hay = ((g.name_ko || '') + ' ' + (g.name_en || '')).toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }

    if (selectedPlatform) {
      const platforms = (g.platforms || []).map(p => p.toLowerCase());
      const hasMatch = platforms.some(p => p.includes(selectedPlatform));
      if (!hasMatch) return false;
    }

    if (days > 0) {
      const release = parseReleaseDate(g.release_date);
      const future = new Date(today);
      future.setDate(today.getDate() + days);
      if (release < today || release > future) return false;
    }

    if (weekFilter) {
      const r = getWeekRange(weekFilter === 'next' ? 1 : 0);
      const rel = parseReleaseDate(g.release_date);
      if (rel < r.start || rel >= r.end) return false;
    }

    if (wishlistOnly && !wishlist.has(g.id)) return false;

    return true;
  });

  filtered.sort((a, b) => parseReleaseDate(a.release_date) - parseReleaseDate(b.release_date));

  if (searchCount) {
    if (searchQuery && searchQuery.trim()) {
      searchCount.textContent = filtered.length + '건 일치';
      searchCount.hidden = false;
    } else {
      searchCount.hidden = true;
    }
  }

  if (!filtered.length) {
    let emptyMsg;
    if (wishlistOnly && wishlist.size === 0) {
      emptyMsg = '아직 위시리스트가 비어있어요. 카드 우상단의 ☆를 눌러 추가해 보세요.';
    } else if (searchQuery && searchQuery.trim()) {
      emptyMsg = '\'' + escapeHtml(searchQuery) + '\'에 일치하는 게임이 없어요.';
    } else {
      emptyMsg = '조건에 맞는 게임이 없어요. 필터를 바꿔보세요.';
    }
    gamesList.innerHTML = '<p class="empty-state">' + emptyMsg + '</p>';
    return;
  }

  gamesList.innerHTML = renderGroupedList(filtered);
}

// 그룹헤더/흡수행 날짜 요일 접미사: 확정이면 '(요일)', approx(추정)면 요일 생략 후 '(예정)' — 모달·카드 규칙과 통일.
function weekdaySuffix(g) {
  if (g.release_date_approx) return ' (예정)';
  const wd = getKoreanWeekday(g.release_date);
  return wd ? ' (' + wd + ')' : '';
}

// 리스트 뷰: 같은 출시일 게임을 날짜 헤더 아래로 그룹핑 (filtered는 날짜순 정렬됨)
function renderGroupedList(games) {
  let html = '';
  let lastDate = null;
  const dateCounts = {};
  for (const g of games) dateCounts[g.release_date] = (dateCounts[g.release_date] || 0) + 1;
  for (const g of games) {
    if (g.release_date !== lastDate) {
      lastDate = g.release_date;
      html += `<h3 class="date-group-header">${formatDate(g.release_date)}${weekdaySuffix(g)}</h3>`;
    }
    html += renderCard(g, dateCounts[g.release_date] === 1, true);
  }
  return html;
}

// D-day 근접도 단계 클래스(표면 공통): past/today/soon(≤7 임박)/mid(8~30)/far(>30). 선행 공백 포함.
function ddayStageClass(diff) {
  if (diff < 0) return ' past';
  if (diff === 0) return ' today';
  if (diff <= 7) return ' soon';
  if (diff <= 30) return ' mid';
  return ' far';
}
// 날짜 패널 전용: 같은 출시일 게임을 날짜 헤더 아래로 묶되, 카드 대신 한 줄 컴팩트 행으로 렌더.
// 행: [카테고리 색점] 게임명 · 대표 플랫폼 · D-day · ☆(위시). 클릭=openModal, ☆=위시 토글(기존 핸들러 재사용).
function renderDayRows(games) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // 같은 날짜 출시 건수 집계: 1건 날짜는 날짜를 행 안으로 흡수(헤더 생략), 2건↑만 날짜 그룹 헤더 유지.
  const dateCounts = {};
  for (const g of games) dateCounts[g.release_date] = (dateCounts[g.release_date] || 0) + 1;
  let html = '';
  let lastDate = null;
  for (const g of games) {
    const single = dateCounts[g.release_date] === 1;
    if (!single && g.release_date !== lastDate) {
      lastDate = g.release_date;
      html += `<h3 class="date-group-header">${formatDate(g.release_date)}${weekdaySuffix(g)}</h3>`;
    }
    const diff = Math.ceil((parseReleaseDate(g.release_date) - today) / 86400000);
    const ddCls = ddayStageClass(diff);
    const dd = diff < 0 ? '출시됨' : (diff === 0 ? 'D-DAY' : 'D-' + diff);
    const plat = ((g.platforms||[]).length>1?((g.platforms||[])[0]+' 외 '+((g.platforms||[]).length-1)):((g.platforms||[])[0]||'')) || '';
    const wished = wishlist.has(g.id);
    const name = escapeHtml(g.name_ko || g.name_en || '');
    // 흡수행: 패널 헤더가 연도를 명시하므로 'MM.DD (요일/예정)'로 단축(풀year 프리픽스 잉여 제거, 게임명 좌측 시작점 정렬).
    const mmdd = formatDate(g.release_date).slice(5);
    const dateInline = single
      ? `<span class="day-row-date">${mmdd}${weekdaySuffix(g)}</span>`
      : '';
    html += `<div class="day-row${single ? ' single-date' : ''}" data-id="${escapeHtml(g.id)}" role="button" tabindex="0" title="${name}">`
      + dateInline
      + `<span class="day-row-dot category-${g.category}" title="${escapeHtml(categories[g.category] || g.category)}" aria-label="${escapeHtml(categories[g.category] || g.category)}"></span>`
      + `<span class="day-row-name">${name}</span>`
      + (plat ? `<span class="day-row-plat">${escapeHtml(plat)}</span>` : '')
      + `<span class="day-row-dday${ddCls}">${dd}</span>`
      + `<button type="button" class="wishlist-btn${wished ? ' active' : ''}" data-id="${escapeHtml(g.id)}" aria-label="위시리스트 토글" aria-pressed="${wished ? 'true' : 'false'}">${wished ? '★' : '☆'}</button>`
      + `</div>`;
  }
  return html;
}

function updateCategoryCounts() {
  if (!categoryFilter) return;
  const selectedPlatform = platformFilter.value.toLowerCase();
  // 통계 요약(#stats-summary)과 동일 모집단(allGames)을 쓰도록 기간(period) 날짜창은 카운트에서 제외.
  // 기간 필터는 실제 표시 목록(renderGames)에만 적용. 플랫폼/검색/주/위시 필터는 카운트에 계속 반영.
  const base = allGames.filter(g => {
    if (searchQuery) {
      const hay = ((g.name_ko || '') + ' ' + (g.name_en || '')).toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    if (selectedPlatform) {
      const platforms = (g.platforms || []).map(p => p.toLowerCase());
      if (!platforms.some(p => p.includes(selectedPlatform))) return false;
    }
    if (weekFilter) {
      const r = getWeekRange(weekFilter === 'next' ? 1 : 0);
      const rel = parseReleaseDate(g.release_date);
      if (rel < r.start || rel >= r.end) return false;
    }
    if (wishlistOnly && !wishlist.has(g.id)) return false;
    return true;
  });
  const countByCat = {};
  for (const g of base) countByCat[g.category] = (countByCat[g.category] || 0) + 1;
  for (const opt of categoryFilter.options) {
    if (!opt.dataset.baseLabel) opt.dataset.baseLabel = CATEGORY_LABELS[opt.value] || opt.textContent;
    const c = opt.value === '' ? base.length : (countByCat[opt.value] || 0);
    opt.textContent = opt.dataset.baseLabel + ' (' + c + ')';
    opt.style.color = c === 0 ? '#666' : '';
  }
}

function renderCard(game, single, grouped) {
  const releaseDate = parseReleaseDate(game.release_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDiff = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

  const ddStage = ddayStageClass(dayDiff).trim();
  const ddText = dayDiff < 0 ? '출시됨' : (dayDiff === 0 ? 'D-DAY' : 'D-' + dayDiff);
  const dDayLabel = `<span class="dday ${ddStage}">${ddText}</span>`;
  const imminent = (dayDiff >= 0 && dayDiff <= 7) ? ' imminent' : '';

  const categoryLabel = categories[game.category] || game.category;
  const approxMark = game.release_date_approx ? ' (예정)' : '';
  const cardImage = game.image_url
    ? `<div class="card-image"><img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.name_ko || game.name_en)}" loading="lazy"></div>`
    : `<div class="card-banner category-${game.category}"></div>`;

  return `
    <article class="game-card${imminent}${single ? ' single-game' : ''}" data-id="${escapeHtml(game.id)}" tabindex="0" role="button" aria-label="${escapeHtml(game.name_ko || game.name_en)} 상세 보기">
      ${cardImage}
      <div class="card-header">
        <span class="category-tag category-${game.category}" data-category="${escapeHtml(game.category)}">${escapeHtml(categoryLabel)}</span>
        <div class="card-header-right">
          ${dDayLabel}
          <button type="button" class="wishlist-btn${wishlist.has(game.id) ? ' active' : ''}" data-id="${escapeHtml(game.id)}" aria-label="위시리스트 토글" aria-pressed="${wishlist.has(game.id) ? 'true' : 'false'}">${wishlist.has(game.id) ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="info">
        <h4>${escapeHtml(game.name_ko || game.name_en)}</h4>
        ${game.name_en && game.name_ko && game.name_en !== game.name_ko
          ? `<div class="name-en">${escapeHtml(game.name_en)}</div>` : ''}
        ${grouped ? '' : `<div class="release-date">📅 ${formatDate(releaseDate)}${game.release_date_approx ? '' : (getKoreanWeekday(game.release_date) ? ' (' + getKoreanWeekday(game.release_date) + ')' : '')}${approxMark}</div>`}
        ${game.description ? `<p class="desc">${escapeHtml(game.description)}</p>` : ''}
        <div class="meta">
          ${(() => { const d = (game.developer || '').trim(), p = (game.publisher || '').trim(); return (d && p && d === p) ? `<div class="meta-row">🏢 ${escapeHtml(game.developer)}</div>` : `${d ? `<div class="meta-row">🛠️ ${escapeHtml(game.developer)}</div>` : ''}${p ? `<div class="meta-row">🏢 ${escapeHtml(game.publisher)}</div>` : ''}`; })()}
        </div>
        <div class="platforms">
          ${(game.platforms || []).map(p =>
            `<span class="platform-tag">${escapeHtml(p)}</span>`
          ).join('')}
        </div>
        ${(game.genres || []).length ? `
          <div class="genres">
            ${game.genres.map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join('')}
          </div>` : ''}
      </div>
    </article>
  `;
}

function formatDate(d) {
  if (!d) return '';
  if (typeof d === 'string') d = new Date(d);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function parseReleaseDate(str) {
  // Parse 'YYYY-MM-DD' as LOCAL midnight (matches `today`), avoiding UTC off-by-one in KST.
  if (!str) return new Date(NaN);
  return new Date(str + 'T00:00:00');
}

function getKoreanWeekday(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
}

function formatRelativeTime(date) {
  if (!date || isNaN(date.getTime())) return '';
  const diffMin = (Date.now() - date.getTime()) / 60000;
  if (diffMin < 0) return ''; // 미래(음수 diff) 타임스탬프: 상대 라벨 생략 → 푸터는 절대 시각만 노출
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${Math.floor(diffMin)}분 전`;
  const diffH = diffMin / 60;
  if (diffH < 24) return `${Math.floor(diffH)}시간 전`;
  const diffD = diffH / 24;
  if (diffD < 30) return `${Math.floor(diffD)}일 전`;
  return '';
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}


// --- Toast + copy helpers ---
let toastTimer = null;
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}
function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); if (cb) cb(); } catch (_) {}
  document.body.removeChild(ta);
}

// --- Detail modal ---
const modal = document.getElementById('game-modal');
const modalBody = document.getElementById('modal-body');
const dayPanel = document.getElementById('day-detail-panel'); // hoisted: referenced by keydown/ESC handlers above Stage 4 (TDZ fix)

let lastFocusedTrigger = null;
function openModal(gameId) {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;
  const releaseDate = parseReleaseDate(game.release_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const dayDiff = Math.ceil((releaseDate - today) / 86400000);
  const dDay = dayDiff < 0 ? '출시됨' : (dayDiff === 0 ? 'D-DAY' : 'D-' + dayDiff);
  const ddStage = ddayStageClass(dayDiff).trim();
  const categoryLabel = categories[game.category] || game.category;
  const approx = game.release_date_approx ? ' (예정)' : '';
  const modalImage = game.image_url
    ? `<div class="modal-image"><img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.name_ko || game.name_en)}"></div>`
    : `<div class="modal-image no-image card-image-placeholder category-${game.category}" role="presentation"></div>`;
  modalBody.innerHTML = `
    ${modalImage}
    <span class="category-tag category-${game.category}">${escapeHtml(categoryLabel)}</span>
    <div class="modal-title-row"><h2 id="modal-title">${escapeHtml(game.name_ko || game.name_en)}</h2><button type="button" class="modal-wishlist-btn${wishlist.has(game.id) ? ' active' : ''}" data-id="${escapeHtml(game.id)}" aria-label="위시리스트 토글" aria-pressed="${wishlist.has(game.id) ? 'true' : 'false'}">${wishlist.has(game.id) ? '★' : '☆'}</button></div>
    ${game.name_en && game.name_ko && game.name_en !== game.name_ko ? `<div class="name-en">${escapeHtml(game.name_en)}</div>` : ''}
    <div class="modal-row"><strong>출시일</strong>${formatDate(releaseDate)}${game.release_date_approx ? '' : (getKoreanWeekday(game.release_date) ? ' (' + getKoreanWeekday(game.release_date) + ')' : '')}${approx} · <span class="dday ${ddStage}">${dDay}</span></div>
    ${game.platforms?.length ? `<div class="modal-row"><strong>플랫폼</strong>${game.platforms.map(escapeHtml).join(', ')}</div>` : ''}
    ${game.genres?.length ? `<div class="modal-row"><strong>장르</strong>${game.genres.map(escapeHtml).join(', ')}</div>` : ''}
    ${(() => { const d = (game.developer || '').trim(), p = (game.publisher || '').trim(); return (d && p && d === p) ? `<div class="modal-row"><strong>개발·퍼블리셔</strong>${escapeHtml(game.developer)}</div>` : `${d ? `<div class="modal-row"><strong>개발</strong>${escapeHtml(game.developer)}</div>` : ''}${p ? `<div class="modal-row"><strong>퍼블리셔</strong>${escapeHtml(game.publisher)}</div>` : ''}`; })()}
    ${game.description ? `<p class="desc" style="margin-top:0.6rem">${escapeHtml(game.description)}</p>` : ''}
    ${game.source_url ? `<a class="source-link" href="${escapeHtml(game.source_url)}" target="_blank" rel="noopener noreferrer">출처 보기 <span class="external-icon">↗</span></a>` : ''}
    <div class="modal-actions"><a class="detail-page-link" href="/game/${escapeHtml(game.id)}">📄 전체 페이지</a><a class="trailer-search-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent((game.name_ko || game.name_en || '') + ' 트레일러')}" target="_blank" rel="noopener noreferrer">▶ 트레일러 검색</a><button type="button" class="copy-link-btn" data-id="${escapeHtml(game.id)}">🔗 링크 복사</button></div>
  `;
  lastFocusedTrigger = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  // Shallow routing: URL을 /game/[id]로 변경 (인스타 스타일)
  // 직접 진입(popstate)으로 열린 경우엔 history를 또 쌓지 않음
  try {
    const desiredPath = '/game/' + gameId;
    if (location.pathname !== desiredPath) {
      history.pushState({ modal: gameId }, '', desiredPath);
    }
  } catch (_) {}
  const _ft = modal.querySelector('.modal-close');
  if (_ft) { _ft.focus(); }
  else { const _mt = document.getElementById('modal-title'); if (_mt) { _mt.setAttribute('tabindex', '-1'); _mt.focus(); } }
}

function closeModal({ skipHistory = false } = {}) {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocusedTrigger && document.contains(lastFocusedTrigger)) lastFocusedTrigger.focus();
  lastFocusedTrigger = null;
  // Shallow routing 복귀: 모달이 history에 쌓아둔 entry를 pop
  // popstate가 트리거한 closeModal에서는 다시 back 호출 안 함 (무한 루프 방지)
  if (!skipHistory) {
    try {
      if (history.state && history.state.modal) {
        history.back();
      }
    } catch (_) {}
  }
}


// 진입 시 URL에 따라 모달 자동 오픈
// - 쿼리 ?game=id (이전 공유 링크 호환)
// - /game/[id] 경로 (shallow routing 호환)
// 단, /game/[id]는 build.js가 만든 정적 페이지가 따로 있으므로
// 메인 페이지가 / 이외의 경로로 로드된 경우엔 모달을 열지 않는다 (정적 페이지가 응답)
function openGameFromUrl() {
  try {
    const id = new URLSearchParams(location.search).get('game');
    if (id && allGames.some(g => g.id === id)) {
      openModal(id);
      return;
    }
    // /game/[id]로 SPA 라우팅 진입한 경우 (history.pushState로 도착) - 이 케이스는 popstate에서 처리
  } catch (_) {}
}

// popstate: 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', (e) => {
  const path = location.pathname;
  const m = path.match(/^\/game\/([^\/]+)$/);
  if (m && allGames.some(g => g.id === m[1])) {
    // /game/[id]로 이동 - 모달 열기 (이미 열려있으면 갱신)
    if (modal.hidden) {
      openModal(m[1]);
    } else {
      // 다른 게임으로 갱신은 일단 단순 close+open 대신 그냥 갱신만
      openModal(m[1]);
    }
  } else {
    // / 또는 다른 경로 - 모달 닫기 (history 추가 조작 없이)
    if (!modal.hidden) {
      closeModal({ skipHistory: true });
    }
  }
});

gamesList.addEventListener('click', e => {
  const wishBtn = e.target.closest('.wishlist-btn');
  if (wishBtn && wishBtn.dataset.id) {
    e.stopPropagation();
    const id = wishBtn.dataset.id;
    if (wishlist.has(id)) { wishlist.delete(id); wishBtn.classList.remove('active'); wishBtn.textContent = '☆'; wishBtn.setAttribute('aria-pressed', 'false'); }
    else { wishlist.add(id); wishBtn.classList.add('active'); wishBtn.textContent = '★'; wishBtn.setAttribute('aria-pressed', 'true'); }
    saveWishlist();
    updateWishlistChipLabel();
    return;
  }
  const platTag = e.target.closest('.platform-tag');
  if (platTag) {
    e.stopPropagation();
    const label = (platTag.textContent || '').trim().toLowerCase();
    let matchValue = '';
    for (const opt of platformFilter.options) {
      if (opt.value && label.includes(opt.value)) { matchValue = opt.value; break; }
    }
    if (matchValue) { platformFilter.value = matchValue; platformFilter.dispatchEvent(new Event('change')); }
    return;
  }
  const catTag = e.target.closest('.category-tag');
  if (catTag && catTag.dataset.category) {
    e.stopPropagation();
    const cat = catTag.dataset.category;
    if (categoryFilter && Array.from(categoryFilter.options).some(o => o.value === cat)) {
      categoryFilter.value = cat;
      categoryFilter.dispatchEvent(new Event('change'));
    }
    return;
  }
  // D-Day label click -> jump to calendar view for that game's release month
  const ddayTag = e.target.closest('.dday');
  if (ddayTag) {
    e.stopPropagation();
    const cardEl = ddayTag.closest('.game-card');
    const game = cardEl && cardEl.dataset.id ? allGames.find(g => g.id === cardEl.dataset.id) : null;
    if (game && game.release_date) {
      const rd = parseReleaseDate(game.release_date);
      if (!isNaN(rd.getTime())) {
        calendarYear = rd.getFullYear();
        calendarMonth = rd.getMonth();
        applyView('calendar');
        renderCalendar();
      }
    }
    return;
  }
  const row = e.target.closest('.day-row, .game-card');
  if (row && row.dataset.id) openModal(row.dataset.id);
});
// 리스트 카드 키보드 접근 (Enter/Space로 상세 모달, .day-row keydown 패턴 복제)
gamesList.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.game-card');
  // 카드 article(role=button) 자체에 포커스 있을 때만; 내부 위시 버튼 등은 각자 처리
  if (card && card === e.target && card.dataset.id) { e.preventDefault(); openModal(card.dataset.id); }
});
// 컴팩트 행 키보드 접근 (Enter/Space로 상세 모달)
if (dayPanel) dayPanel.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const row = e.target.closest('.day-row');
  if (row && row.dataset.id) { e.preventDefault(); openModal(row.dataset.id); }
});
modal.addEventListener('click', e => {
  const copyBtn = e.target.closest('.copy-link-btn');
  if (copyBtn && copyBtn.dataset.id) {
    e.stopPropagation();
    const url = location.origin + location.pathname + '?game=' + encodeURIComponent(copyBtn.dataset.id);
    const done = () => showToast('링크 복사됨');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
    } else { fallbackCopy(url, done); }
    return;
  }
  const wishBtn = e.target.closest('.modal-wishlist-btn');
  if (wishBtn && wishBtn.dataset.id) {
    e.stopPropagation();
    const id = wishBtn.dataset.id;
    const wasIn = wishlist.has(id);
    if (wasIn) { wishlist.delete(id); wishBtn.classList.remove('active'); wishBtn.textContent = '☆'; wishBtn.setAttribute('aria-pressed', 'false'); }
    else { wishlist.add(id); wishBtn.classList.add('active'); wishBtn.textContent = '★'; wishBtn.setAttribute('aria-pressed', 'true'); }
    saveWishlist();
    const cardBtn = document.querySelector('.wishlist-btn[data-id="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
    if (cardBtn) { cardBtn.classList.toggle('active', !wasIn); cardBtn.textContent = !wasIn ? '★' : '☆'; cardBtn.setAttribute('aria-pressed', !wasIn ? 'true' : 'false'); }
    updateWishlistChipLabel();
    return;
  }
  if (e.target === modal || e.target.classList.contains('modal-close')) closeModal();
});
document.addEventListener('keydown', e => {
  // '/' shortcut: focus + select the search input from anywhere outside text fields.
  if (e.key === '/') {
    const active = document.activeElement;
    const tag = active && active.tagName;
    const inText = tag === 'INPUT' || tag === 'TEXTAREA' || (active && active.isContentEditable);
    if (!inText && searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    return;
  }
  if (e.key !== 'Escape') return;
  // Modal has priority; if open, close it and bail.
  if (!modal.hidden) { closeModal(); return; }
  // Day-detail-panel takes next priority.
  if (dayPanel && !dayPanel.hidden) {
    dayPanel.hidden = true;
    selectedDay = null;
    renderCalendar();
    return;
  }
  // Finally, clear search input if it's focused and has content.
  if (searchInput && document.activeElement === searchInput && searchInput.value) {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  }
});

categoryFilter.addEventListener('change', renderGames);
const heroStrip = document.getElementById('hero-strip');
if (heroStrip) heroStrip.addEventListener('click', e => {
  const card = e.target.closest('.hero-card');
  if (card && card.dataset.id) openModal(card.dataset.id);
});
platformFilter.addEventListener('change', renderGames);
periodFilter.addEventListener('change', renderGames);
if (searchInput) {
  let searchTimer = null;
  searchInput.addEventListener('input', () => {
    if (searchClear) searchClear.hidden = !searchInput.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderGames();
    }, 200);
  });
}
if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });
}

loadData();


// --- Monthly calendar (Stage 3: prev/next/today nav) ---
let calendarYear, calendarMonth;
let calendarMonthInitialized = false;
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const label = document.getElementById('calendar-month-label');
  if (!grid || !label) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (calendarYear === undefined) {
    calendarYear = today.getFullYear();
    calendarMonth = today.getMonth();
  }
  const y = calendarYear, m = calendarMonth;
  label.textContent = `${y}년 ${m + 1}월`;
  const start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
  const dayMap = {};
  for (const g of allGames) {
    if (!g.release_date) continue;
    const rd = parseReleaseDate(g.release_date);
    if (rd.getFullYear() === y && rd.getMonth() === m) {
      (dayMap[rd.getDate()] = dayMap[rd.getDate()] || []).push(g);
    }
  }
  const wdNames = ['일','월','화','수','목','금','토'];
  const weekdays = wdNames.map(d => `<div class="weekday">${d}</div>`).join('');
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const cls = ['day'];
    const isOther = d.getMonth() !== m;
    if (isOther) cls.push('other-month');
    if (d.getTime() === today.getTime()) cls.push('today');
    let dots = '';
    let gameLabel = '';
    let a11y = '';
    let relCount = 0;
    if (!isOther) {
      const list = dayMap[d.getDate()] || [];
      relCount = list.length;
      const soonDiff = (d.getTime() - today.getTime()) / 86400000;
      if (list.length && soonDiff >= 0 && soonDiff <= 7) cls.push('day-soon');
      if (list.length) cls.push('day-has'); // [스캔성] 출시 있는 셀 면 강조
      if (list.length) {
        const shown = list.slice(0, 3);
        const overflow = list.length - 3;
        const tip = list.map(x => x.name_ko || x.name_en).join(', ');
        const dotEls = shown.map(g => {
          const catLabel = escapeHtml(categories[g.category] || g.category);
          return `<span class="day-dot category-${g.category}" title="${catLabel}" aria-label="${catLabel}"></span>`;
        }).join('');
        const more = overflow > 0 ? `<span class="day-dot-more">+${overflow}</span>` : '';
        const extra = list.length - 1; // [정보손실] 대표 1건 외 나머지 건수
        const moreCount = extra > 0 ? `<span class="day-more" title="이 날 출시 ${list.length}건">+${extra}</span>` : '';
        dots = `<div class="day-dots" title="${escapeHtml(tip)}">${dotEls}${more}${moreCount}</div>`;
        const firstName = list[0].name_ko || list[0].name_en || '';
        gameLabel = `<div class="day-game-label" title="${escapeHtml(tip)}">${escapeHtml(firstName)}</div>`;
        a11y = ` role="button" tabindex="0"`;
      }
    }
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (selectedDay === iso && !isOther) cls.push('selected');
    const isToday = d.getTime() === today.getTime();
    const todayLabel = isToday ? '<span class="today-label">오늘</span>' : ''; // other-month today도 시각 라벨 노출(자동 점프 시 today가 인접월 셀로 렌더됨)
    const ariaLabel = `${isToday ? '오늘, ' : ''}${d.getMonth()+1}월 ${d.getDate()}일(${wdNames[d.getDay()]})${relCount ? `, 출시 ${relCount}건` : ''}`;
    const ariaCurrent = isToday ? ' aria-current="date"' : '';
    cells += `<div class="${cls.join(' ')}" data-date="${iso}" data-other="${isOther?'1':'0'}"${a11y} aria-label="${ariaLabel}"${ariaCurrent}>${d.getDate()}${todayLabel}${gameLabel}${dots}</div>`;
  }
  grid.innerHTML = weekdays + cells;
  const emptyEl = document.getElementById('calendar-empty');
  if (emptyEl) {
    emptyEl.hidden = Object.keys(dayMap).length > 0;
    emptyEl.textContent = (wishlistOnly && wishlist.size === 0)
      ? '아직 위시리스트가 비어있어요. 카드 우상단의 ☆를 눌러 추가해 보세요.'
      : '이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.';
  }
}
renderCalendar();

const calPrevBtn = document.getElementById('calendar-prev');
const calNextBtn = document.getElementById('calendar-next');
const calTodayBtn = document.getElementById('calendar-today');
if (calPrevBtn) calPrevBtn.addEventListener('click', () => {
  if (calendarYear === undefined) { const t = new Date(); calendarYear = t.getFullYear(); calendarMonth = t.getMonth(); }
  calendarMonth--;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  renderCalendar();
});
if (calNextBtn) calNextBtn.addEventListener('click', () => {
  if (calendarYear === undefined) { const t = new Date(); calendarYear = t.getFullYear(); calendarMonth = t.getMonth(); }
  calendarMonth++;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  renderCalendar();
});
if (calTodayBtn) calTodayBtn.addEventListener('click', () => {
  const t = new Date();
  calendarYear = t.getFullYear();
  calendarMonth = t.getMonth();
  renderCalendar();
});

// --- Calendar Stage 4: day cell click -> panel -> reuse openModal ---
// Active filters (category/platform/period/week/wishlist/search) — shared by the day panel.
function getActiveFilteredGames(floorIso) {
  const selectedCategory = categoryFilter.value;
  const selectedPlatform = platformFilter.value.toLowerCase();
  const days = parseInt(periodFilter.value, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // 기간필터 하한: 보통은 오늘이지만, 날짜패널이 지난 날짜를 클릭하면 그 날짜를 바닥으로 삼아 그날 게임이 누락되지 않게 함
  const floor = floorIso ? new Date(floorIso) : today; floor.setHours(0, 0, 0, 0);
  return allGames.filter(g => {
    if (selectedCategory && g.category !== selectedCategory) return false;
    if (searchQuery) { const hay = ((g.name_ko || '') + ' ' + (g.name_en || '')).toLowerCase(); if (!hay.includes(searchQuery)) return false; }
    if (selectedPlatform) { const ps = (g.platforms || []).map(x => x.toLowerCase()); if (!ps.some(x => x.includes(selectedPlatform))) return false; }
    if (days > 0) { const rel = parseReleaseDate(g.release_date); const fut = new Date(today); fut.setDate(today.getDate() + days); if (rel < floor || rel > fut) return false; }
    if (weekFilter) { const r = getWeekRange(weekFilter === 'next' ? 1 : 0); const rel = parseReleaseDate(g.release_date); if (rel < r.start || rel >= r.end) return false; }
    if (wishlistOnly && !wishlist.has(g.id)) return false;
    return true;
  });
}

// Day cell click -> games released on/after that date, grouped by date (reuses list grouping). openModal reused on click.
function renderDayPanel(iso) {
  if (!dayPanel) return;
  const wd = getKoreanWeekday(iso);
  const list = getActiveFilteredGames(iso)
    .filter(g => g.release_date && g.release_date >= iso)
    .sort((a, b) => parseReleaseDate(a.release_date) - parseReleaseDate(b.release_date));
  const title = `${formatDate(iso)}${wd ? ' (' + wd + ')' : ''} 이후 출시 ${list.length}건`;
  const head = `<div class="day-panel-header"><h3 class="day-panel-title">${title}</h3><button class="day-panel-close" aria-label="패널 닫기">×</button></div>`;
  if (!list.length) {
    dayPanel.innerHTML = head + '<p class="day-empty">이 날짜 이후 출시 예정 게임이 없어요.</p>';
  } else {
    dayPanel.innerHTML = head + '<div class="day-panel-list">' + renderDayRows(list) + '</div>';
  }
  dayPanel.hidden = false;
  // 발견성: 패널 렌더 직후 화면으로 스크롤 + 헤더 1회 강조 플래시 (reduced-motion 시 즉시 이동/플래시 생략)
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  dayPanel.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
  const _h = dayPanel.querySelector('.day-panel-header');
  if (_h && !rm) { _h.classList.remove('flash'); void _h.offsetWidth; _h.classList.add('flash'); }
}

const calGrid = document.getElementById('calendar-grid');
if (calGrid) calGrid.addEventListener('click', e => {
  const cell = e.target.closest('.day');
  if (!cell || !cell.dataset.date) return;
  const iso = cell.dataset.date;
  if (cell.dataset.other === '1') {
    const [yy, mm] = iso.split('-').map(Number);
    calendarYear = yy; calendarMonth = mm - 1;
    selectedDay = null; if (dayPanel) dayPanel.hidden = true;
    renderCalendar(); return;
  }
  if (selectedDay === iso) { selectedDay = null; if (dayPanel) dayPanel.hidden = true; }
  else { selectedDay = iso; renderDayPanel(iso); }
  renderCalendar();
});
if (calGrid) calGrid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
  const cell = e.target.closest('.day');
  if (!cell || !cell.dataset.date || cell.getAttribute('role') !== 'button') return;
  e.preventDefault();
  cell.click();
});
if (dayPanel) dayPanel.addEventListener('click', e => {
  if (e.target.closest('.day-panel-close')) {
    e.stopPropagation();
    dayPanel.hidden = true;
    selectedDay = null;
    renderCalendar();
    return;
  }
  const wishBtn = e.target.closest('.wishlist-btn');
  if (wishBtn && wishBtn.dataset.id) {
    e.stopPropagation();
    const id = wishBtn.dataset.id;
    if (wishlist.has(id)) { wishlist.delete(id); wishBtn.classList.remove('active'); wishBtn.textContent = '☆'; wishBtn.setAttribute('aria-pressed', 'false'); }
    else { wishlist.add(id); wishBtn.classList.add('active'); wishBtn.textContent = '★'; wishBtn.setAttribute('aria-pressed', 'true'); }
    saveWishlist();
    updateWishlistChipLabel();
    return;
  }
  const card = e.target.closest('.day-row, .game-card');
  if (card && card.dataset.id) openModal(card.dataset.id);
});

// --- Calendar Stage 5: view toggle (calendar/list) ---
const VIEW_KEY = 'gcalen.view';
const calendarViewEl = document.getElementById('calendar-view');
const listViewEl = document.getElementById('games-list');
const viewCalendarBtn = document.getElementById('view-calendar');
const viewListBtn = document.getElementById('view-list');
const calendarLegendEl = document.getElementById('calendar-legend');
function applyView(view) {
  const v = (view === 'list') ? 'list' : 'calendar';
  if (calendarViewEl) calendarViewEl.hidden = (v !== 'calendar');
  if (calendarLegendEl) calendarLegendEl.hidden = (v !== 'calendar');
  if (listViewEl) listViewEl.hidden = (v !== 'list');
  if (viewCalendarBtn) {
    viewCalendarBtn.setAttribute('aria-pressed', v === 'calendar' ? 'true' : 'false');
    viewCalendarBtn.classList.toggle('active', v === 'calendar');
  }
  if (viewListBtn) {
    viewListBtn.setAttribute('aria-pressed', v === 'list' ? 'true' : 'false');
    viewListBtn.classList.toggle('active', v === 'list');
  }
  try { localStorage.setItem(VIEW_KEY, v); } catch (_) {}
}
// 최초 방문(localStorage 'gcalen.view' 비어있음) 시 기본 뷰 = 캘린더 (운영자 요청).
// 사용자가 한 번이라도 토글하면 그 선택을 기억(applyView가 setItem). 기본값만 calendar로 고정.
let savedView = 'calendar';
try { savedView = localStorage.getItem(VIEW_KEY) || 'calendar'; } catch (_) {}
applyView(savedView);
if (viewCalendarBtn) viewCalendarBtn.addEventListener('click', () => applyView('calendar'));
if (viewListBtn) viewListBtn.addEventListener('click', () => applyView('list'));


// Quick week chips (this week / next week, Mon-Sun, toggle, AND with other filters)
const chipThis = document.getElementById('chip-this-week');
const chipNext = document.getElementById('chip-next-week');
function applyWeekChips() {
  if (chipThis) { chipThis.classList.toggle('active', weekFilter === 'this'); chipThis.setAttribute('aria-pressed', weekFilter === 'this' ? 'true' : 'false'); }
  if (chipNext) { chipNext.classList.toggle('active', weekFilter === 'next'); chipNext.setAttribute('aria-pressed', weekFilter === 'next' ? 'true' : 'false'); }
}
if (chipThis) chipThis.addEventListener('click', () => { weekFilter = (weekFilter === 'this') ? null : 'this'; applyWeekChips(); renderGames(); });
if (chipNext) chipNext.addEventListener('click', () => { weekFilter = (weekFilter === 'next') ? null : 'next'; applyWeekChips(); renderGames(); });

// Wishlist-only chip (independent toggle, AND with week chips and other filters)
const chipWish = document.getElementById('chip-wishlist');
function applyWishlistChip() {
  if (!chipWish) return;
  chipWish.classList.toggle('active', wishlistOnly);
  chipWish.setAttribute('aria-pressed', wishlistOnly ? 'true' : 'false');
}
if (chipWish) chipWish.addEventListener('click', () => { wishlistOnly = !wishlistOnly; applyWishlistChip(); renderGames(); });

// --- Filter reset control: show when any non-default filter is active, reset all 6 on click ---
function hasActiveFilters() {
  return !!(
    (categoryFilter && categoryFilter.value) ||
    (platformFilter && platformFilter.value) ||
    (periodFilter && periodFilter.value !== '365') ||
    searchQuery ||
    weekFilter ||
    wishlistOnly
  );
}
function updateFilterReset() {
  if (filterReset) filterReset.hidden = !hasActiveFilters();
}
function resetAllFilters() {
  if (categoryFilter) categoryFilter.value = '';
  if (platformFilter) platformFilter.value = '';
  if (periodFilter) periodFilter.value = '365';
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  if (searchClear) searchClear.hidden = true;
  weekFilter = null;
  wishlistOnly = false;
  applyWeekChips();
  applyWishlistChip();
  renderGames();
}
if (filterReset) filterReset.addEventListener('click', resetAllFilters);
// Wishlist chip count badge: label becomes `위시리스트만 보기 (N)`; refresh on load + on every star toggle.
function updateWishlistChipLabel() {
  if (!chipWish) return;
  if (!chipWish.dataset.baseLabel) chipWish.dataset.baseLabel = chipWish.textContent.trim();
  chipWish.textContent = chipWish.dataset.baseLabel + ' (' + wishlist.size + ')';
}
updateWishlistChipLabel();
