// build.js - games.json 기반 SEO 정적 페이지 생성
// 생성물: 게임별 페이지(/game/[id]) + 키워드 랜딩 페이지 + sitemap + index.html SEO 내비 주입
// Vercel 배포 때마다 자동 실행. games.json이 단일 진실 공급원.

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
function sortByDate(arr) {
  return arr.slice().sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
}

function pageShell({ title, desc, canonical, bodyHtml, jsonld }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="게임 출시 캘린더" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
<header>
  <h1><a href="/" style="color:inherit;text-decoration:none;">🎮 게임 출시 캘린더</a></h1>
</header>
<main>
${bodyHtml}
</main>
<footer><p>© 2026 게임 출시 캘린더 (gcalen.com) · <a href="/">홈</a></p></footer>
</body>
</html>`;
}

// ── 1. 게임별 상세 페이지 ──
function gamePage(g) {
  const catLabel = categories[g.category] || g.category;
  const dateStr = fmtDate(g.release_date);
  const title = `${g.name_ko} 출시일 ${dateStr} | 게임 출시 캘린더`;
  const desc = `${g.name_ko}${g.name_en ? ` (${g.name_en})` : ''} 출시일은 ${dateStr}입니다. ${g.developer ? `개발 ${g.developer}, ` : ''}${g.publisher ? `배급 ${g.publisher}. ` : ''}${g.description || ''}`.slice(0, 158);
  const platforms = (g.platforms || []).join(', ');
  const genres = (g.genres || []).join(', ');
  const url = `${SITE}/game/${g.id}`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'VideoGame', name: g.name_ko,
    ...(g.name_en ? { alternateName: g.name_en } : {}),
    ...(g.platforms ? { gamePlatform: g.platforms } : {}),
    ...(g.publisher ? { publisher: { '@type': 'Organization', name: g.publisher } } : {}),
    ...(g.developer ? { author: { '@type': 'Organization', name: g.developer } } : {}),
    datePublished: g.release_date, description: g.description || '', url
  };
  const body = `
  <article class="game-detail">
    <p><a href="/">← 전체 목록으로</a></p>
    <div class="ad-slot ad-slot-top" data-ad-slot-name="detail-top"><span class="ad-slot-label">광고 자리 (상단)</span></div>
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
  <div class="ad-slot ad-slot-mid" data-ad-slot-name="detail-bottom"><span class="ad-slot-label">광고 자리 (페이지 하단)</span></div>`;
  return pageShell({ title, desc, canonical: url, bodyHtml: body, jsonld });
}

// ── 2. 키워드 랜딩 페이지 ──
const landings = [
  { slug: 'upcoming-games', h1: '신규 게임 출시 예정 일정', title: '신규 게임 출시 예정 일정 2026 | 게임 출시 캘린더',
    desc: '국내외 신규 게임 출시 예정 일정 총정리. 모바일·PC·콘솔·글로벌 대작까지 다가오는 게임 출시일을 한눈에 확인하세요.',
    intro: '국내외 <strong>신규 게임 출시</strong> 예정 일정을 한곳에 모았습니다. 모바일 게임부터 PC·콘솔, 글로벌 대작까지 다가오는 <strong>게임 출시일</strong>을 날짜순으로 확인하세요.',
    filter: () => true },
  { slug: 'new-servers', h1: '신규 서버 오픈 일정', title: '신규 서버 오픈 일정 | 리니지·로스트아크·메이플 신서버 - 게임 출시 캘린더',
    desc: '리니지M, 리니지W, 로스트아크, 메이플스토리, 오딘 등 한국 MMORPG 신규 서버 오픈 일정 총정리. 신서버 오픈일을 한눈에.',
    intro: '리니지, 로스트아크, 메이플스토리, 오딘 등 한국 MMORPG <strong>신규 서버</strong> 오픈 일정을 정리했습니다. 새로 시작하기 좋은 <strong>신서버</strong> 오픈일을 확인하세요.',
    filter: g => g.category === 'new_server' },
  { slug: 'mobile-games', h1: '국내 신규 모바일 게임 출시 일정', title: '신규 모바일 게임 출시 일정 | 게임 출시 캘린더',
    desc: '국내 출시 예정 신규 모바일 게임 일정 총정리. 넷마블, 카카오게임즈, 넥슨 등 모바일 게임 출시일을 한눈에.',
    intro: '국내 출시 예정 <strong>신규 모바일 게임</strong> 일정입니다. 다가오는 <strong>모바일 게임 출시</strong>일을 확인하세요.',
    filter: g => g.category === 'mobile_kr' },
  { slug: 'pc-console-games', h1: '신규 PC·콘솔 게임 출시 일정', title: '신규 PC·콘솔 게임 출시 일정 | 게임 출시 캘린더',
    desc: '국내 출시 예정 PC·콘솔 신작 게임 일정 총정리. 스팀, PS5, Xbox, 닌텐도 스위치 게임 출시일을 한눈에.',
    intro: '국내 출시 예정 <strong>PC·콘솔 신작 게임</strong> 일정입니다. 스팀, PS5, Xbox, 스위치 등 <strong>게임 출시</strong>일을 확인하세요.',
    filter: g => g.category === 'pc_console_kr' },
  { slug: 'global-games', h1: '글로벌 대작 게임 출시 일정', title: '글로벌 대작 신작 게임 출시 일정 2026 | 게임 출시 캘린더',
    desc: '전 세계 주목 대작 신작 게임 출시 일정 총정리. GTA 6 등 글로벌 AAA 게임 출시일을 한눈에.',
    intro: '전 세계가 주목하는 <strong>대작 신작 게임</strong> 출시 일정입니다. 글로벌 AAA <strong>게임 출시</strong>일을 확인하세요.',
    filter: g => g.category === 'global_aaa' },
];

function landingPage(cfg) {
  const list = sortByDate(games.filter(cfg.filter));
  const url = `${SITE}/${cfg.slug}`;
  const rows = list.map(g => {
    const catLabel = categories[g.category] || g.category;
    return `      <li class="seo-list-item">
        <a href="/game/${esc(g.id)}"><strong>${esc(g.name_ko)}</strong></a>
        <span class="seo-date">${esc(fmtDate(g.release_date))}${g.release_date_approx ? ' (예정)' : ''}</span>
        <span class="category-tag category-${esc(g.category)}">${esc(catLabel)}</span>
        ${g.developer ? `<span class="seo-dev">${esc(g.developer)}</span>` : ''}
      </li>`;
  }).join('\n');

  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: cfg.h1, url,
    itemListElement: list.map((g, i) => ({
      '@type': 'ListItem', position: i + 1, name: g.name_ko, url: `${SITE}/game/${g.id}`
    }))
  };

  const body = `
  <section class="seo-landing">
    <h2>${esc(cfg.h1)}</h2>
    <p class="seo-intro">${cfg.intro}</p>
    <div class="ad-slot ad-slot-top" data-ad-slot-name="landing-top"><span class="ad-slot-label">광고 자리 (상단)</span></div>
    <p class="seo-count">총 ${list.length}개 · 최근 업데이트 ${fmtDate(data.last_updated)}</p>
    <ul class="seo-list">
${rows || '      <li>현재 등록된 항목이 없습니다.</li>'}
    </ul>
    <div class="ad-slot ad-slot-mid" data-ad-slot-name="landing-bottom"><span class="ad-slot-label">광고 자리 (페이지 하단)</span></div>
    <nav class="seo-nav">${landings.map(l => `<a href="/${l.slug}">${esc(l.h1)}</a>`).join(' · ')} · <a href="/">전체 캘린더</a></nav>
  </section>`;
  return pageShell({ title: cfg.title, desc: cfg.desc, canonical: url, bodyHtml: body, jsonld: itemList });
}

// ── 생성 실행 ──
fs.rmSync('game', { recursive: true, force: true });
fs.mkdirSync('game', { recursive: true });

const urls = [`${SITE}/`];
for (const g of games) {
  fs.writeFileSync(path.join('game', `${g.id}.html`), gamePage(g));
  urls.push(`${SITE}/game/${g.id}`);
}
for (const cfg of landings) {
  fs.writeFileSync(`${cfg.slug}.html`, landingPage(cfg));
  urls.push(`${SITE}/${cfg.slug}`);
}

// ── index.html에 SEO 내비 주입 ──
try {
  let idx = fs.readFileSync('index.html', 'utf8');
  const navHtml = `\n    <p class="seo-nav-title">바로가기:</p>\n    ${landings.map(l => `<a href="/${l.slug}">${l.h1}</a>`).join('\n    ')}\n  `;
  idx = idx.replace('<!--SEO_NAV-->', navHtml);
  fs.writeFileSync('index.html', idx);
  console.log('index.html SEO 내비 주입 완료');
} catch (e) {
  console.log('index.html 주입 스킵:', e.message);
}

// ── sitemap ──
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemap);

console.log(`✅ 게임 ${games.length}개 + 랜딩 ${landings.length}개 + sitemap(${urls.length} URLs) 생성 완료`);
