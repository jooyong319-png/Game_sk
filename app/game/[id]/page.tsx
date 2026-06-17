import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getUpcomingGamesByCategory, formatKoreanDate, formatShortDate, getKoreanWeekday } from '@/lib/games';
import { CATEGORY_META, type Category, type Game } from '@/lib/types';
import { WishlistButton } from '@/components/WishlistButton';
import { DdayBadge } from '@/components/DdayBadge';
import { ShareButton } from '@/components/ShareButton';
import { ViewCounter } from '@/components/ViewCounter';
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
  const title = `${game.name_ko} ${landing.releaseNoun} ${dateStr}`;
  const desc = `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} ${landing.releaseNoun}은 ${dateStr}입니다. ${game.developer ? `개발 ${game.developer}, ` : ''}${game.publisher ? `배급 ${game.publisher}. ` : ''}${game.description ?? ''}`.slice(0, 158);
  const url = `https://gcalen.com/game/${game.id}`;

  const keywords = [
    game.name_ko,
    ...(game.name_en ? [game.name_en] : []),
    `${game.name_ko} ${landing.releaseNoun}`,
    landing.label,
    ...game.platforms,
    ...game.genres,
    '게임 출시일', '신작 게임',
  ];

  const ogImage = game.image_url || '/og-image.png';
  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article', images: [ogImage] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
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

  // 같은 카테고리 '출시 예정'(지난 게임 제외) 게임 — 출시일 가까운 순 6개
  const related: Game[] = (await getUpcomingGamesByCategory(game.category))
    .filter(g => g.id !== game.id)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))
    .slice(0, 6);

  const videoGameLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name_ko,
    ...(game.name_en ? { alternateName: game.name_en } : {}),
    ...(game.platforms.length ? { gamePlatform: game.platforms } : {}),
    ...(game.genres.length ? { genre: game.genres } : {}),
    ...(game.publisher ? { publisher: { '@type': 'Organization', name: game.publisher } } : {}),
    ...(game.developer ? { author: { '@type': 'Organization', name: game.developer } } : {}),
    datePublished: game.release_date,
    description: game.description ?? '',
    inLanguage: 'ko',
    url,
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
      <div className="detail-backdrop">
        <nav className="breadcrumb" aria-label="위치">
          <a href="/">홈</a>
          <span aria-hidden="true">›</span>
          <a href={landing.url}>{landing.label}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{game.name_ko}</span>
        </nav>

        <article className="game-detail">
          {game.image_url && (
            <div className="detail-cover">
              <img src={game.image_url} alt="" aria-hidden="true" className="cover-bg" loading="lazy" />
              <img src={game.image_url} alt={`${game.name_ko} 대표 이미지`} className="cover-fg" loading="lazy" />
            </div>
          )}
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
          {game.description && <p className="desc">{game.description}</p>}
          <ul className="detail-meta">
            {game.developer && <li><strong>개발사</strong>{game.developer}</li>}
            {game.publisher && <li><strong>배급사</strong>{game.publisher}</li>}
            {game.platforms.length > 0 && <li><strong>플랫폼</strong>{game.platforms.join(', ')}</li>}
            {game.genres.length > 0 && <li><strong>장르</strong>{game.genres.join(', ')}</li>}
          </ul>
          <div className="detail-actions">
            <WishlistButton id={game.id} className="detail-link" />
            <ShareButton url={url} title={game.name_ko} className="detail-link" />
            {game.source_url && (
              <a className="detail-link" href={game.source_url} target="_blank" rel="noopener">공식 출처 →</a>
            )}
          </div>
        </article>

        <Comments gameId={game.id} />

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
