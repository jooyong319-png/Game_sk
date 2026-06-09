import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getGameById, formatKoreanDate, getKoreanWeekday } from '@/lib/games';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate } from '@/lib/utils';
import { AdSlot } from '@/components/AdSlot';
import { GoogleCalendarButton } from '@/components/GoogleCalendarButton';
import { ViewCounter } from '@/components/ViewCounter';

interface Props {
  params: { id: string };
}

// SSG: 모든 게임 ID로 정적 페이지 생성
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map(g => ({ id: g.id }));
}

// 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGameById(params.id);
  if (!game) return { title: '게임을 찾을 수 없음' };
  const dateStr = formatKoreanDate(game.release_date);
  const title = `${game.name_ko} 출시일 ${dateStr}`;
  const desc = `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} 출시일은 ${dateStr}입니다. ${game.developer ? `개발 ${game.developer}, ` : ''}${game.publisher ? `배급 ${game.publisher}. ` : ''}${game.description ?? ''}`.slice(0, 158);
  const url = `https://gcalen.com/game/${game.id}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
    },
  };
}

export default async function GamePage({ params }: Props) {
  const game = await getGameById(params.id);
  if (!game) notFound();

  const catLabel = CATEGORY_META[game.category]?.label ?? game.category;
  const dateStr = formatKoreanDate(game.release_date);
  const weekday = game.release_date_approx ? '' : ` (${getKoreanWeekday(game.release_date)})`;
  const url = `https://gcalen.com/game/${game.id}`;
  const diff = calcDayDiff(game.release_date);
  const ddText = game.release_date_approx
    ? '(예정)'
    : diff < 0 ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
  const ddStage = game.release_date_approx
    ? 'far'
    : diff === 0 ? 'today' : diff > 0 && diff <= 7 ? 'soon' : 'far';

  // 같은 시기(출시일 ±2주) 출시 게임 — 자기 제외, 가까운 순 최대 6개 (빌드타임)
  const allGames = await getAllGames();
  const targetTime = new Date(game.release_date).getTime();
  const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
  const related = allGames
    .filter(
      g =>
        g.id !== game.id &&
        Math.abs(new Date(g.release_date).getTime() - targetTime) <= WINDOW_MS
    )
    .sort(
      (a, b) =>
        Math.abs(new Date(a.release_date).getTime() - targetTime) -
        Math.abs(new Date(b.release_date).getTime() - targetTime)
    )
    .slice(0, 6);

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name_ko,
    ...(game.name_en ? { alternateName: game.name_en } : {}),
    ...(game.platforms.length ? { gamePlatform: game.platforms } : {}),
    ...(game.publisher ? { publisher: { '@type': 'Organization', name: game.publisher } } : {}),
    ...(game.developer ? { author: { '@type': 'Organization', name: game.developer } } : {}),
    datePublished: game.release_date,
    description: game.description ?? '',
    url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <div className="detail-backdrop">
      <AdSlot slot="detail-top" size="top" />
      <article className="game-detail">
        <a href="/" className="back-link">← 전체 목록으로</a>
        <span className={`category-tag cat-bg-${game.category}`}>{catLabel}</span>
        <h2>{game.name_ko}</h2>
        {game.name_en && game.name_en !== game.name_ko && (
          <p className="name-en">{game.name_en}</p>
        )}
        <ViewCounter gameId={game.id} />
        <p className="release-date">
          <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> 출시일: {dateStr}{weekday}
          <span className={`dday-badge dday-${ddStage}`}>{ddText}</span>
        </p>
        {game.description && <p className="desc">{game.description}</p>}
        <ul className="detail-meta">
          {game.developer && <li><strong>개발사</strong>{game.developer}</li>}
          {game.publisher && <li><strong>배급사</strong>{game.publisher}</li>}
          {game.platforms.length > 0 && <li><strong>플랫폼</strong>{game.platforms.join(', ')}</li>}
          {game.genres.length > 0 && <li><strong>장르</strong>{game.genres.join(', ')}</li>}
        </ul>
        <div className="detail-actions">
          <GoogleCalendarButton game={game} />
          {game.source_url && (
            <a className="detail-link" href={game.source_url} target="_blank" rel="noopener">공식 출처 →</a>
          )}
        </div>
      </article>
      {related.length > 0 && (
        <section className="detail-related">
          <h3>같은 시기 출시</h3>
          <div className="related-grid">
            {related.map(g => {
              const rDiff = calcDayDiff(g.release_date);
              const rdText = g.release_date_approx
                ? '(예정)'
                : rDiff < 0 ? '출시됨' : rDiff === 0 ? 'D-DAY' : `D-${rDiff}`;
              const rdStage = rDiff === 0 ? 'today' : rDiff > 0 && rDiff <= 7 ? 'soon' : 'far';
              return (
                <a
                  key={g.id}
                  href={`/game/${g.id}`}
                  className="related-card"
                  style={{ borderLeft: `4px solid ${CATEGORY_META[g.category].color}` }}
                >
                  <span className="related-name">{g.name_ko}</span>
                  <span className="related-date">{formatShortDate(g.release_date)}</span>
                  <span className={`related-dday dday-${rdStage}`}>{rdText}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}
      <AdSlot slot="detail-bottom" size="mid" />
      </div>
    </>
  );
}
