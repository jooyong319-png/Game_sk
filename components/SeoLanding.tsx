import { CATEGORY_META, type Game, type Category } from '@/lib/types';
import { formatKoreanDate } from '@/lib/utils';
import { AdSlot } from './AdSlot';

interface SeoLandingProps {
  h1: string;
  intro: React.ReactNode;
  games: Game[];
  slug: string;
}

export function SeoLanding({ h1, intro, games, slug }: SeoLandingProps) {
  const url = `https://gcalen.com/${slug}`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: h1,
    url,
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.name_ko,
      url: `https://gcalen.com/game/${g.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <section className="seo-landing">
        <h2>{h1}</h2>
        <p className="seo-intro">{intro}</p>
        <p className="seo-count">총 {games.length}개</p>
        <ul className="seo-list">
          {games.length === 0 ? (
            <li>현재 등록된 항목이 없습니다.</li>
          ) : games.map(g => {
            const catLabel = CATEGORY_META[g.category]?.label ?? g.category;
            return (
              <li key={g.id} className="seo-list-item">
                <a href={`/game/${g.id}`}><strong>{g.name_ko}</strong></a>
                <span className="seo-date">
                  {formatKoreanDate(g.release_date)}{g.release_date_approx ? ' (예정)' : ''}
                </span>
                <span className={`category-tag cat-bg-${g.category}`}>{catLabel}</span>
                {g.developer && <span className="seo-dev">{g.developer}</span>}
              </li>
            );
          })}
        </ul>
      </section>
      <AdSlot slot="landing-bottom" size="mid" />
      <nav className="seo-nav" aria-label="카테고리 바로가기">
        <a href="/upcoming-games">신규 게임 출시 예정 일정</a>
        <a href="/new-servers">신규 서버 오픈 일정</a>
        <a href="/mobile-games">국내 신규 모바일 게임 출시 일정</a>
        <a href="/pc-console-games">신규 PC·콘솔 게임 출시 일정</a>
        <a href="/global-games">글로벌 대작 게임 출시 일정</a>
        <a href="/">전체 캘린더</a>
      </nav>
    </>
  );
}
