import type { CSSProperties } from 'react';
import { CATEGORY_META, type Game } from '@/lib/types';
import { formatKoreanDate } from '@/lib/utils';
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
        <div className="seo-intro">{intro}</div>
        <p className="seo-count">총 {games.length}개</p>
        <ul className="seo-list">
          {games.length === 0 ? (
            <li className="seo-empty">
              <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
              <span>아직 등록된 일정이 없어요.</span>
            </li>
          ) : games.map(g => {
            const catLabel = CATEGORY_META[g.category]?.label ?? g.category;
            return (
              <li
                key={g.id}
                className="seo-list-item"
                style={{ '--cat': CATEGORY_META[g.category]?.color } as CSSProperties}
              >
                <div className="seo-li-main">
                  <span className={`category-tag cat-bg-${g.category}`}>{catLabel}</span>
                  <a href={`/game/${g.id}`} className="seo-name">{g.name_ko}</a>
                </div>
                <div className="seo-li-meta">
                  <span className="seo-date">
                    {formatKoreanDate(g.release_date)}{g.release_date_approx ? ' (예정)' : ''}
                  </span>
                  {g.developer && <span className="seo-dev">· {g.developer}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      </PageShell>
  );
}
