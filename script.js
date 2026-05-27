// 게임 출시 캘린더 - 프론트엔드 로직
// 3명 협업: 기획자/개발자/QA Claude

const platformFilter = document.getElementById('platform-filter');
const periodFilter = document.getElementById('period-filter');
const gamesList = document.getElementById('games-list');

async function loadGames() {
  gamesList.innerHTML = '<p class="loading">불러오는 중...</p>';

  const platform = platformFilter.value;
  const days = parseInt(periodFilter.value, 10);

  try {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    params.set('days', String(days));

    const res = await fetch(`/api/games?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderGames(data.results || []);
  } catch (err) {
    console.error(err);
    gamesList.innerHTML = `<p class="error">데이터를 불러오지 못했어요: ${err.message}</p>`;
  }
}

function renderGames(games) {
  if (!games.length) {
    gamesList.innerHTML = '<p class="loading">조건에 맞는 게임이 없어요.</p>';
    return;
  }

  gamesList.innerHTML = games.map(game => `
    <article class="game-card">
      ${game.background_image
        ? `<img src="${escapeHtml(game.background_image)}" alt="${escapeHtml(game.name)}" loading="lazy" />`
        : '<div style="aspect-ratio:16/9;background:#0f1115;"></div>'}
      <div class="info">
        <h3>${escapeHtml(game.name)}</h3>
        <div class="release-date">📅 ${formatDate(game.released)}</div>
        <div class="platforms">
          ${(game.platforms || []).slice(0, 5).map(p =>
            `<span class="platform-tag">${escapeHtml(p.platform.name)}</span>`
          ).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

function formatDate(isoDate) {
  if (!isoDate) return '미정';
  const d = new Date(isoDate);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

platformFilter.addEventListener('change', loadGames);
periodFilter.addEventListener('change', loadGames);

loadGames();
