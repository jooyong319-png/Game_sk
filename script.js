// 게임 출시 캘린더 - 프론트엔드 로직
// 데이터 소스: /data/games.json (리서처 Claude가 매일 9시에 갱신)

const categoryFilter = document.getElementById('category-filter');
const platformFilter = document.getElementById('platform-filter');
const periodFilter = document.getElementById('period-filter');
const searchInput = document.getElementById('search-input');
const gamesList = document.getElementById('games-list');
const lastUpdatedEl = document.getElementById('last-updated');
const footerUpdatedEl = document.getElementById('footer-updated-date');
const footerUpdatedWrap = footerUpdatedEl ? footerUpdatedEl.closest('.footer-updated') : null;

let allGames = [];
let categories = {};
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
    categories = data.categories || {};

    if (lastUpdatedEl && data.last_updated) {
      const d = new Date(data.last_updated);
      lastUpdatedEl.textContent = `마지막 업데이트: ${formatDate(d)}`;
    }

    if (footerUpdatedWrap && footerUpdatedEl) {
      const d = data.last_updated ? new Date(data.last_updated) : null;
      if (d && !isNaN(d.getTime())) {
        const pad = n => String(n).padStart(2, '0');
        footerUpdatedEl.textContent = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        footerUpdatedWrap.hidden = false;
      } else {
        footerUpdatedWrap.hidden = true;
      }
    }

    renderGames();
    if (typeof renderCalendar === 'function') renderCalendar();
  } catch (err) {
    console.error(err);
    gamesList.innerHTML = `<p class="error">데이터를 불러오지 못했어요: ${err.message}</p>`;
  }
}

function renderGames() {
  updateCategoryCounts();
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
      const release = new Date(g.release_date);
      const future = new Date(today);
      future.setDate(today.getDate() + days);
      if (release < today || release > future) return false;
    }

    if (weekFilter) {
      const r = getWeekRange(weekFilter === 'next' ? 1 : 0);
      const rel = new Date(g.release_date);
      if (rel < r.start || rel >= r.end) return false;
    }

    if (wishlistOnly && !wishlist.has(g.id)) return false;

    return true;
  });

  filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  if (!filtered.length) {
    gamesList.innerHTML = '<p class="empty-state">조건에 맞는 게임이 없어요. 필터를 조정해 보세요.</p>';
    return;
  }

  gamesList.innerHTML = filtered.map(renderCard).join('');
}

function updateCategoryCounts() {
  if (!categoryFilter) return;
  const selectedPlatform = platformFilter.value.toLowerCase();
  const days = parseInt(periodFilter.value, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const base = allGames.filter(g => {
    if (searchQuery) {
      const hay = ((g.name_ko || '') + ' ' + (g.name_en || '')).toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    if (selectedPlatform) {
      const platforms = (g.platforms || []).map(p => p.toLowerCase());
      if (!platforms.some(p => p.includes(selectedPlatform))) return false;
    }
    if (days > 0) {
      const release = new Date(g.release_date);
      const future = new Date(today); future.setDate(today.getDate() + days);
      if (release < today || release > future) return false;
    }
    if (weekFilter) {
      const r = getWeekRange(weekFilter === 'next' ? 1 : 0);
      const rel = new Date(g.release_date);
      if (rel < r.start || rel >= r.end) return false;
    }
    if (wishlistOnly && !wishlist.has(g.id)) return false;
    return true;
  });
  const countByCat = {};
  for (const g of base) countByCat[g.category] = (countByCat[g.category] || 0) + 1;
  for (const opt of categoryFilter.options) {
    if (!opt.dataset.baseLabel) opt.dataset.baseLabel = opt.textContent;
    const c = opt.value === '' ? base.length : (countByCat[opt.value] || 0);
    opt.textContent = opt.dataset.baseLabel + ' (' + c + ')';
    opt.style.color = c === 0 ? '#666' : '';
  }
}

function renderCard(game) {
  const releaseDate = new Date(game.release_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDiff = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

  let dDayLabel = '';
  let imminent = '';
  if (dayDiff < 0) {
    dDayLabel = `<span class="dday past">출시됨</span>`;
  } else if (dayDiff === 0) {
    dDayLabel = `<span class="dday today">D-DAY</span>`;
    imminent = ' imminent';
  } else if (dayDiff <= 7) {
    dDayLabel = `<span class="dday soon">D-${dayDiff}</span>`;
    imminent = ' imminent';
  } else {
    dDayLabel = `<span class="dday">D-${dayDiff}</span>`;
  }

  const categoryLabel = categories[game.category] || game.category;
  const approxMark = game.release_date_approx ? ' (예정)' : '';
  const cardImage = game.image_url
    ? `<div class="card-image"><img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.name_ko || game.name_en)}" loading="lazy"></div>`
    : `<div class="card-image card-image-placeholder category-${game.category}"><span>${escapeHtml(categoryLabel)}</span></div>`;

  return `
    <article class="game-card${imminent}" data-id="${escapeHtml(game.id)}">
      ${cardImage}
      <div class="card-header">
        <span class="category-tag category-${game.category}">${escapeHtml(categoryLabel)}</span>
        <div class="card-header-right">
          ${dDayLabel}
          <button type="button" class="wishlist-btn${wishlist.has(game.id) ? ' active' : ''}" data-id="${escapeHtml(game.id)}" aria-label="위시리스트 토글" aria-pressed="${wishlist.has(game.id) ? 'true' : 'false'}">${wishlist.has(game.id) ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="info">
        <h3>${escapeHtml(game.name_ko || game.name_en)}</h3>
        ${game.name_en && game.name_ko && game.name_en !== game.name_ko
          ? `<div class="name-en">${escapeHtml(game.name_en)}</div>` : ''}
        <div class="release-date">📅 ${formatDate(releaseDate)}${approxMark}</div>
        ${game.description ? `<p class="desc">${escapeHtml(game.description)}</p>` : ''}
        <div class="meta">
          ${game.developer ? `<div class="meta-row">🛠️ ${escapeHtml(game.developer)}</div>` : ''}
          ${game.publisher ? `<div class="meta-row">🏢 ${escapeHtml(game.publisher)}</div>` : ''}
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

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}


// --- Detail modal ---
const modal = document.getElementById('game-modal');
const modalBody = document.getElementById('modal-body');

function openModal(gameId) {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return;
  const releaseDate = new Date(game.release_date);
  const today = new Date(); today.setHours(0,0,0,0);
  const dayDiff = Math.ceil((releaseDate - today) / 86400000);
  const dDay = dayDiff < 0 ? '출시됨' : (dayDiff === 0 ? 'D-DAY' : 'D-' + dayDiff);
  const categoryLabel = categories[game.category] || game.category;
  const approx = game.release_date_approx ? ' (예정)' : '';
  const modalImage = game.image_url
    ? `<div class="modal-image"><img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.name_ko || game.name_en)}"></div>`
    : `<div class="modal-image card-image-placeholder category-${game.category}"><span>${escapeHtml(categoryLabel)}</span></div>`;
  modalBody.innerHTML = `
    ${modalImage}
    <span class="category-tag category-${game.category}">${escapeHtml(categoryLabel)}</span>
    <div class="modal-title-row"><h2 id="modal-title">${escapeHtml(game.name_ko || game.name_en)}</h2><button type="button" class="modal-wishlist-btn${wishlist.has(game.id) ? ' active' : ''}" data-id="${escapeHtml(game.id)}" aria-label="위시리스트 토글" aria-pressed="${wishlist.has(game.id) ? 'true' : 'false'}">${wishlist.has(game.id) ? '★' : '☆'}</button></div>
    ${game.name_en && game.name_ko && game.name_en !== game.name_ko ? `<div class="name-en">${escapeHtml(game.name_en)}</div>` : ''}
    <div class="modal-row"><strong>출시일</strong>${formatDate(releaseDate)}${approx} · ${dDay}</div>
    ${game.platforms?.length ? `<div class="modal-row"><strong>플랫폼</strong>${game.platforms.map(escapeHtml).join(', ')}</div>` : ''}
    ${game.genres?.length ? `<div class="modal-row"><strong>장르</strong>${game.genres.map(escapeHtml).join(', ')}</div>` : ''}
    ${game.developer ? `<div class="modal-row"><strong>개발</strong>${escapeHtml(game.developer)}</div>` : ''}
    ${game.publisher ? `<div class="modal-row"><strong>퍼블리셔</strong>${escapeHtml(game.publisher)}</div>` : ''}
    ${game.description ? `<p class="desc" style="margin-top:0.6rem">${escapeHtml(game.description)}</p>` : ''}
    ${game.source_url ? `<a class="source-link" href="${escapeHtml(game.source_url)}" target="_blank" rel="noopener noreferrer">출처 보기 →</a>` : ''}
  `;
  modal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

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
  const card = e.target.closest('.game-card');
  if (card && card.dataset.id) openModal(card.dataset.id);
});
modal.addEventListener('click', e => {
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
  if (e.key !== 'Escape') return;
  // Modal has priority; if open, close it and bail.
  if (!modal.hidden) { closeModal(); return; }
  // Otherwise, close the day-detail-panel if open.
  if (dayPanel && !dayPanel.hidden) {
    dayPanel.hidden = true;
    selectedDay = null;
    renderCalendar();
  }
});

categoryFilter.addEventListener('change', renderGames);
platformFilter.addEventListener('change', renderGames);
periodFilter.addEventListener('change', renderGames);
if (searchInput) {
  let searchTimer = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderGames();
    }, 200);
  });
}

loadData();


// --- Monthly calendar (Stage 3: prev/next/today nav) ---
let calendarYear, calendarMonth;
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
    const rd = new Date(g.release_date);
    if (rd.getFullYear() === y && rd.getMonth() === m) {
      (dayMap[rd.getDate()] = dayMap[rd.getDate()] || []).push(g);
    }
  }
  const weekdays = ['일','월','화','수','목','금','토']
    .map(d => `<div class="weekday">${d}</div>`).join('');
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const cls = ['day'];
    const isOther = d.getMonth() !== m;
    if (isOther) cls.push('other-month');
    if (d.getTime() === today.getTime()) cls.push('today');
    let dots = '';
    if (!isOther) {
      const list = dayMap[d.getDate()] || [];
      if (list.length) {
        const shown = list.slice(0, 3);
        const overflow = list.length - 3;
        const tip = list.map(x => x.name_ko || x.name_en).join(', ');
        const dotEls = shown.map(g =>
          `<span class="day-dot category-${g.category}"></span>`).join('');
        const more = overflow > 0 ? `<span class="day-dot-more">+${overflow}</span>` : '';
        dots = `<div class="day-dots" title="${escapeHtml(tip)}">${dotEls}${more}</div>`;
      }
    }
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (selectedDay === iso && !isOther) cls.push('selected');
    cells += `<div class="${cls.join(' ')}" data-date="${iso}" data-other="${isOther?'1':'0'}">${d.getDate()}${dots}</div>`;
  }
  grid.innerHTML = weekdays + cells;
  const emptyEl = document.getElementById('calendar-empty');
  if (emptyEl) emptyEl.hidden = Object.keys(dayMap).length > 0;
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
const dayPanel = document.getElementById('day-detail-panel');
function renderDayPanel(iso) {
  if (!dayPanel) return;
  const [y, m, d] = iso.split('-').map(Number);
  const list = allGames.filter(g => g.release_date === iso);
  const head = `<h3 class="day-panel-title">${y}년 ${m}월 ${d}일</h3>`;
  if (!list.length) { dayPanel.innerHTML = head + '<p class="day-empty">이 날짜에 출시 예정 게임 없음</p>'; }
  else {
    dayPanel.innerHTML = head + list.map(g => {
      const label = categories[g.category] || g.category;
      return `<div class="day-game-card" data-id="${escapeHtml(g.id)}"><span class="day-game-color category-${g.category}"></span><span class="day-game-name">${escapeHtml(g.name_ko || g.name_en)}</span><span class="category-tag category-${g.category}">${escapeHtml(label)}</span></div>`;
    }).join('');
  }
  dayPanel.hidden = false;
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
if (dayPanel) dayPanel.addEventListener('click', e => {
  const card = e.target.closest('.day-game-card');
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
// Wishlist chip count badge: label becomes `위시리스트만 보기 (N)`; refresh on load + on every star toggle.
function updateWishlistChipLabel() {
  if (!chipWish) return;
  if (!chipWish.dataset.baseLabel) chipWish.dataset.baseLabel = chipWish.textContent.trim();
  chipWish.textContent = chipWish.dataset.baseLabel + ' (' + wishlist.size + ')';
}
updateWishlistChipLabel();
