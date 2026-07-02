import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getUpcomingGamesByCategory, getLastUpdated, formatKoreanDate, formatShortDate, getKoreanWeekday } from '@/lib/games';
import { CATEGORY_META, type Category, type Game } from '@/lib/types';
import { WishlistButton } from '@/components/WishlistButton';
import { GameReactions } from '@/components/GameReactions';
import { DdayBadge } from '@/components/DdayBadge';
import { ShareButton } from '@/components/ShareButton';
import { ViewCounter } from '@/components/ViewCounter';
import { PreRegCountdown } from '@/components/PreRegCountdown';
import { Comments } from '@/components/Comments';
import { PageShell } from '@/components/PageShell';

interface Props {
  params: { id: string };
}

// 카테고리 → 랜딩 페이지(breadcrumb·내부링크용)
const CATEGORY_LANDING: Record<Category, { url: string; label: string; releaseNoun: string }> = {
  mobile_kr:     { url: '/mobile-games',      label: '모바일 게임',   releaseNoun: '출시일' },
  pc_console_kr: { url: '/pc-console-games',  label: 'PC·콘솔 게임',  releaseNoun: '출시일' },
  global_aaa:    { url: '/global-games',      label: '글로벌 게임',   releaseNoun: '출시일' },
  new_server:    { url: '/new-servers',       label: '신규 서버 · 이벤트', releaseNoun: '일정' },
};

// SSG: 모든 게임 ID로 정적 페이지 생성
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map(g => ({ id: g.id }));
}

// 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const games = await getAllGames();
  const game = games.find(g => g.id === params.id);
  if (!game) return { title: '게임을 찾을 수 없음' };

  const landing = CATEGORY_LANDING[game.category];
  const dateStr = formatKoreanDate(game.release_date);
  const url = `https://gcalen.com/game/${game.id}`;

  // 사전예약 게임이면 '사전예약'을 제목·설명 전면에 노출(검색 노출용)
  const isPreReg = !!game.pre_registration;
  const preRegStr = game.pre_registration_date ? formatKoreanDate(game.pre_registration_date) : '';

  // 제목: 템플릿(| 게임 출시 캘린더) 중복 방지 위해 absolute로 직접 제어 + 핵심 키워드 앞배치·짧게
  const titleText = isPreReg
    ? `${game.name_ko} 사전예약 일정`
    : `${game.name_ko} ${landing.releaseNoun} ${dateStr}`;
  const title = `${titleText} | 게임 출시 캘린더`;

  const desc = (isPreReg
    ? `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} 사전예약${preRegStr ? `이 ${preRegStr}에 시작` : ' 진행 중'}됩니다. ${game.publisher ? `배급 ${game.publisher}. ` : ''}${game.description ?? ''}`
    : `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} ${landing.releaseNoun}은 ${dateStr}입니다. ${game.developer ? `개발 ${game.developer}, ` : ''}${game.publisher ? `배급 ${game.publisher}. ` : ''}${game.description ?? ''}`
  ).slice(0, 158);

  // 사전예약 검색어 변형 — 제목의 콜론·띄어쓰기 변형까지 커버(예: 제우스: 오만의 신 → 제우스 사전예약)
  const preRegKeywords = isPreReg ? (() => {
    const base = game.name_ko;                                              // '제우스: 오만의 신'
    const noColon = base.replace(/[:：]/g, '').replace(/\s+/g, ' ').trim();  // '제우스 오만의 신'
    const first = base.split(/[:：\s]/).filter(Boolean)[0];                 // '제우스'
    return Array.from(new Set([
      `${base} 사전예약`,
      `${noColon} 사전예약`,
      `${first} 사전예약`,
      `${first} 사전예약 일정`,
    ]));
  })() : [];

  const keywords = [
    game.name_ko,
    ...(game.name_en ? [game.name_en] : []),
    `${game.name_ko} ${landing.releaseNoun}`,
    ...preRegKeywords,
    landing.label,
    ...game.platforms,
    ...game.genres,
    '게임 출시일', '신작 게임',
  ];

  const ogImage = game.image_url || '/og-image.png';
  const lastUpdated = await getLastUpdated();
  return {
    title: { absolute: title },
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
      siteName: '게임 출시 캘린더',
      locale: 'ko_KR',
      publishedTime: lastUpdated,
      modifiedTime: lastUpdated,
      authors: ['게임 출시 캘린더'],
      section: landing.label,
      images: [{ url: ogImage, alt: `${game.name_ko} 대표 이미지` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [ogImage] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

export default async function GamePage({ params }: Props) {
  const games = await getAllGames();
  const game = games.find(g => g.id === params.id);
  if (!game) notFound();

  const landing = CATEGORY_LANDING[game.category];
  const catLabel = CATEGORY_META[game.category]?.label ?? game.category;
  const dateStr = formatKoreanDate(game.release_date);
  const weekday = game.release_date_approx ? '' : ` (${getKoreanWeekday(game.release_date)})`;
  const url = `https://gcalen.com/game/${game.id}`;
  const preRegStr = game.pre_registration_date ? formatKoreanDate(game.pre_registration_date) : '';
  const preRegEndStr = game.pre_registration_end_date ? formatKoreanDate(game.pre_registration_end_date) : '';
  const isPreReg = !!game.pre_registration;
  const lastUpdatedIso = await getLastUpdated();
  const lastUpdatedStr = formatKoreanDate(lastUpdatedIso.slice(0, 10));

  // 콜론 없는 표기 변형(엔티티 인식/검색 매칭용): '제우스: 오만의 신' → '제우스 오만의 신'
  const noColonName = game.name_ko.replace(/[:：]/g, '').replace(/\s+/g, ' ').trim();
  const altNames = Array.from(new Set([
    ...(game.name_en ? [game.name_en] : []),
    ...(noColonName !== game.name_ko ? [noColonName] : []),
  ]));

  // 같은 카테고리 '출시 예정'(지난 게임 제외) 게임 — 출시일 가까운 순 6개
  const related: Game[] = (await getUpcomingGamesByCategory(game.category))
    .filter(g => g.id !== game.id)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))
    .slice(0, 6);

  const ogImageAbs = game.image_url || 'https://gcalen.com/og-image.png';
  const videoGameLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name_ko,
    ...(altNames.length ? { alternateName: altNames } : {}),
    image: ogImageAbs,
    applicationCategory: 'GameApplication',
    ...(game.platforms.length ? { gamePlatform: game.platforms, operatingSystem: game.platforms } : {}),
    ...(game.genres.length ? { genre: game.genres } : {}),
    ...(game.publisher ? { publisher: { '@type': 'Organization', name: game.publisher } } : {}),
    ...(game.developer ? { author: { '@type': 'Organization', name: game.developer } } : {}),
    datePublished: game.release_date,
    dateModified: lastUpdatedIso,
    description: game.description ?? '',
    inLanguage: 'ko',
    url,
    ...(isPreReg ? {
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'KRW',
        availability: 'https://schema.org/PreOrder',
        ...(game.pre_registration_url ? { url: game.pre_registration_url } : {}),
        ...(game.pre_registration_date ? { validFrom: game.pre_registration_date } : {}),
      },
    } : {}),
  };

  // 자주 묻는 질문 — 화면 노출 + FAQPage 구조화 데이터(둘이 일치해야 리치 결과 인정)
  const faqs: { q: string; a: string }[] = [];
  if (isPreReg) {
    faqs.push({
      q: `${game.name_ko} 사전예약은 언제 시작하나요?`,
      a: preRegStr
        ? `${game.name_ko} 사전예약은 ${preRegStr}에 시작됩니다${preRegEndStr ? ` (마감 ${preRegEndStr})` : game.pre_registration_date ? ' (마감일 미정)' : ''}.${game.pre_registration_url ? ' 공식 사전예약 페이지에서 신청할 수 있습니다.' : ''}`
        : `${game.name_ko} 사전예약이 진행 중입니다.`,
    });
  }
  faqs.push({
    q: `${game.name_ko} 출시일은 언제인가요?`,
    a: `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''}의 ${landing.releaseNoun}은 ${dateStr}${game.release_date_approx ? ' (예정, 정확한 날짜 미정)' : ''}입니다.`,
  });
  if (game.platforms.length) {
    faqs.push({ q: `${game.name_ko}는 어떤 플랫폼으로 출시되나요?`, a: `${game.platforms.join(', ')}(으)로 출시됩니다.` });
  }
  if (game.developer || game.publisher) {
    const parts: string[] = [];
    if (game.developer) parts.push(`개발 ${game.developer}`);
    if (game.publisher && game.publisher !== game.developer) parts.push(`배급 ${game.publisher}`);
    faqs.push({ q: `${game.name_ko} 개발사·배급사는 어디인가요?`, a: `${parts.join(', ')}입니다.` });
  }
  if (game.genres.length) {
    faqs.push({ q: `${game.name_ko}의 장르는 무엇인가요?`, a: `${game.genres.join(', ')} 장르입니다.` });
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
      { '@type': 'ListItem', position: 2, name: landing.label, item: `https://gcalen.com${landing.url}` },
      { '@type': 'ListItem', position: 3, name: game.name_ko, item: url },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <div className="detail-backdrop">
        <nav className="breadcrumb" aria-label="위치">
          <a href="/">홈</a>
          <span aria-hidden="true">›</span>
          <a href={landing.url}>{landing.label}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{game.name_ko}</span>
        </nav>

        <article className="game-detail">
          <div className="detail-header">
            <div className={`detail-thumb cat-bg-${game.category}`}>
              {game.image_url ? (
                <>
                  <img src={game.image_url} alt="" aria-hidden="true" className="cover-bg" loading="lazy" />
                  <img src={game.image_url} alt={`${game.name_ko} 대표 이미지`} className="cover-fg" loading="eager" fetchPriority="high" />
                </>
              ) : (
                <div className="thumb-ph">
                  <svg className="ph-icon" aria-hidden="true"><use href="#ic-image" /></svg>
                  <span className="ph-text">이미지 없음</span>
                </div>
              )}
            </div>
            <div className="detail-header-info">
              <div className="detail-head">
                <span className={`category-tag cat-bg-${game.category}`}>{catLabel}</span>
                <DdayBadge releaseDate={game.release_date} approx={game.release_date_approx} />
              </div>
              <h1>{game.name_ko}</h1>
              {game.name_en && game.name_en !== game.name_ko && (
                <p className="name-en">{game.name_en}</p>
              )}
              <div className="detail-release-row">
                <p className="release-date">
                  <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> {landing.releaseNoun}: {dateStr}{weekday}
                </p>
                <ViewCounter gameId={game.id} />
              </div>
            </div>
          </div>
          {game.pre_registration && (
            <PreRegCountdown startDate={game.pre_registration_date} endDate={game.pre_registration_end_date} />
          )}
          {game.description && <p className="desc">{game.description}</p>}
          <ul className="detail-meta">
            {game.developer && <li><strong>개발사</strong>{game.developer}</li>}
            {game.publisher && <li><strong>배급사</strong>{game.publisher}</li>}
            {game.platforms.length > 0 && <li><strong>플랫폼</strong>{game.platforms.join(', ')}</li>}
            {game.genres.length > 0 && <li><strong>장르</strong>{game.genres.join(', ')}</li>}
          </ul>
          <div className="detail-actions">
            {game.pre_registration_url && (
              <a className="detail-link prereg-cta" href={game.pre_registration_url} target="_blank" rel="noopener">
                사전예약 하러 가기 <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
              </a>
            )}
            <WishlistButton id={game.id} className="detail-link" />
            <ShareButton url={url} title={game.name_ko} className="detail-link" />
            {game.source_url && (
              <a className="detail-link" href={game.source_url} target="_blank" rel="noopener">공식 출처 →</a>
            )}
          </div>
          <GameReactions gameId={game.id} />
          <p className="detail-updated">
            <time dateTime={lastUpdatedIso}>마지막 업데이트: {lastUpdatedStr}</time>
          </p>
        </article>

        <Comments gameId={game.id} />

        {faqs.length > 0 && (
          <section className="detail-faq">
            <h2>{game.name_ko} 자주 묻는 질문</h2>
            <dl className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {related.length > 0 && (
          <section className="detail-related">
            <h2>{landing.label} 더보기</h2>
            <div className="related-grid">
              {related.map(r => (
                <a key={r.id} href={`/game/${r.id}`} className="related-card">
                  <span className="related-name">{r.name_ko}</span>
                  <span className="related-date">
                    {formatShortDate(r.release_date)}{r.release_date_approx ? ' (예정)' : ''}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
