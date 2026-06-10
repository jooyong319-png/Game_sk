import { CATEGORY_META, type Game, type Category } from '@/lib/types';
import { formatKoreanDate } from '@/lib/utils';
import { AdSlot } from './AdSlot';
import { PageShell } from './PageShell';

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
    <PageShell>
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
      </PageShell>
  );
}
