import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getGameById, formatKoreanDate, getKoreanWeekday } from '@/lib/games';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff } from '@/lib/utils';
import { AdSlot } from '@/components/AdSlot';
import { GoogleCalendarButton } from '@/components/GoogleCalendarButton';

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
      <AdSlot slot="detail-top" size="top" />
      <article
        className="game-detail"
        style={{ borderTop: `4px solid ${CATEGORY_META[game.category].color}` }}
      >
        <a href="/" className="back-link">← 전체 목록으로</a>
        <span className={`category-tag cat-bg-${game.category}`}>{catLabel}</span>
        <h2>{game.name_ko}</h2>
        {game.name_en && game.name_en !== game.name_ko && (
          <p className="name-en">{game.name_en}</p>
        )}
        <p className="release-date">
          <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> 출시일: {dateStr}{weekday}
          <span className={`dday-badge dday-${ddStage}`}>{ddText}</span>
        </p>
        {game.description && <p className="desc">{game.description}</p>}
        <ul className="detail-meta">
          {game.developer && <li><strong>개발사</strong>: {game.developer}</li>}
          {game.publisher && <li><strong>배급사</strong>: {game.publisher}</li>}
          {game.platforms.length > 0 && <li><strong>플랫폼</strong>: {game.platforms.join(', ')}</li>}
          {game.genres.length > 0 && <li><strong>장르</strong>: {game.genres.join(', ')}</li>}
        </ul>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <GoogleCalendarButton game={game} />
          {game.source_url && (
            <a href={game.source_url} target="_blank" rel="noopener">공식 출처 →</a>
          )}
        </div>
      </article>
      <AdSlot slot="detail-bottom" size="mid" />
    </>
  );
}
