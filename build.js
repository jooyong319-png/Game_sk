// build.js - games.json을 읽어서 게임별 정적 SEO 페이지 + sitemap 생성
// Vercel 빌드 시 자동 실행됨. 데이터(games.json)가 단일 진실 공급원.
// 주의: 이 스크립트는 /game/ 폴더와 sitemap.xml만 생성한다. 다른 파일은 안 건드림.

const fs = require('fs');
const path = require('path');

const SITE = 'https://gcalen.com';

const data = JSON.parse(fs.readFileSync('data/games.json', 'utf8'));
const games = data.games || [];
const categories = data.categories || {};

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtDate(iso) {
  if (!iso) return '미정';
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function gamePage(g) {
  const catLabel = categories[g.category] || g.category;
  const dateStr = fmtDate(g.release_date);
  const title = `${g.name_ko} 출시일 ${dateStr} | 게임 출시 캘린더`;
  const desc = `${g.name_ko}${g.name_en ? ` (${g.name_en})` : ''} 출시일은 ${dateStr}입니다. ${g.developer ? `개발 ${g.developer}, ` : ''}${g.publisher ? `배급 ${g.publisher}. ` : ''}${g.description || ''}`.slice(0, 158);
  const platforms = (g.platforms || []).join(', ');
  const genres = (g.genres || []).join(', ');
  const url = `${SITE}/game/${g.id}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: g.name_ko,
    ...(g.name_en ? { alternateName: g.name_en } : {}),
    ...(g.platforms ? { gamePlatform: g.platforms } : {}),
    ...(g.publisher ? { publisher: { '@type': 'Organization', name: g.publisher } } : {}),
    ...(g.developer ? { author: { '@type': 'Organization', name: g.developer } } : {}),
    datePublished: g.release_date,
    description: g.description || '',
    url
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="게임 출시 캘린더" />
<meta property="og:title" content="${esc(g.name_ko)} 출시일 ${esc(dateStr)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
<header>
  <h1><a href="/" style="color:inherit;text-decoration:none;">🎮 게임 출시 캘린더</a></h1>
</header>
<main>
  <article class="game-detail">
    <p><a href="/">← 전체 목록으로</a></p>
    <span class="category-tag category-${esc(g.category)}">${esc(catLabel)}</span>
    <h2>${esc(g.name_ko)}</h2>
    ${g.name_en ? `<p class="name-en">${esc(g.name_en)}</p>` : ''}
    <p class="release-date">📅 출시일: ${esc(dateStr)}${g.release_date_approx ? ' (예정)' : ''}</p>
    ${g.description ? `<p class="desc">${esc(g.description)}</p>` : ''}
    <ul class="detail-meta">
      ${g.developer ? `<li><strong>개발사</strong>: ${esc(g.developer)}</li>` : ''}
      ${g.publisher ? `<li><strong>배급사</strong>: ${esc(g.publisher)}</li>` : ''}
      ${platforms ? `<li><strong>플랫폼</strong>: ${esc(platforms)}</li>` : ''}
      ${genres ? `<li><strong>장르</strong>: ${esc(genres)}</li>` : ''}
    </ul>
    ${g.source_url ? `<p><a href="${esc(g.source_url)}" target="_blank" rel="noopener">공식 출처 →</a></p>` : ''}
  </article>
</main>
<footer><p>© 2026 게임 출시 캘린더 (gcalen.com)</p></footer>
</body>
</html>`;
}

// /game 폴더 초기화 (삭제된 게임의 stale 페이지 제거)
fs.rmSync('game', { recursive: true, force: true });
fs.mkdirSync('game', { recursive: true });

const urls = [`${SITE}/`];
for (const g of games) {
  fs.writeFileSync(path.join('game', `${g.id}.html`), gamePage(g));
  urls.push(`${SITE}/game/${g.id}`);
}

// sitemap.xml 생성
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemap);

console.log(`✅ 게임 페이지 ${games.length}개 + sitemap (${urls.length} URLs) 생성 완료`);
