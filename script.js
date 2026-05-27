// 게임 출시 캘린더 - 프론트엔드 로직
// 데이터 소스: /data/games.json (리서처 Claude가 매일 9시에 갱신)

const categoryFilter = document.getElementById('category-filter');
const platformFilter = document.getElementById('platform-filter');
const periodFilter = document.getElementById('period-filter');
const gamesList = document.getElementById('games-list');
const lastUpdatedEl = document.getElementById('last-updated');

let allGames = [];
let categories = {};
let selectedDay = null;

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

    renderGames();
    if (typeof renderCalendar === 'function') renderCalendar();
  } catch (err) {
    console.error(err);
    gamesList.innerHTML = `<p class="error">데이터를 불러오지 못했어요: ${err.message}</p>`;
  }
}

function renderGames() {
  const selectedCategory = categoryFilter.value;
  const selectedPlatform = platformFilter.value.toLowerCase();
  const days = parseInt(periodFilter.value, 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filtered = allGames.filter(g => {
    if (selectedCategory && g.category !== selectedCategory) return false;

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

    return true;
  });

  filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  if (!filtered.length) {
    gamesList.innerHTML = '<p class="loading">조건에 맞는 게임이 없어요. 필터를 바꿔보세요.</p>';
    return;
  }

  gamesList.innerHTML = filtered.map(renderCard).join('');
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

  return `
    <article class="game-card${imminent}" data-id="${escapeHtml(game.id)}">
      <div class="card-header">
        <span class="category-tag category-${game.category}">${escapeHtml(categoryLabel)}</span>
        ${dDayLabel}
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
  modalBody.innerHTML = `
    <span class="category-tag category-${game.category}">${escapeHtml(categoryLabel)}</span>
    <h2 id="modal-title">${escapeHtml(game.name_ko || game.name_en)}</h2>
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
  const card = e.target.closest('.game-card');
  if (card && card.dataset.id) openModal(card.dataset.id);
});
modal.addEventListener('click', e => {
  if (e.target === modal || e.target.classList.contains('modal-close')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

categoryFilter.addEventListener('change', renderGames);
platformFilter.addEventListener('change', renderGames);
periodFilter.addEventListener('change', renderGames);

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
