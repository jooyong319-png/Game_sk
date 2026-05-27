// 게임 출시 캘린더 - 프론트엔드 로직
// 데이터 소스: /data/games.json (리서처 Claude가 매일 9시에 갱신)

const categoryFilter = document.getElementById('category-filter');
const platformFilter = document.getElementById('platform-filter');
const periodFilter = document.getElementById('period-filter');
const gamesList = document.getElementById('games-list');
const lastUpdatedEl = document.getElementById('last-updated');

let allGames = [];
let categories = {};

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
