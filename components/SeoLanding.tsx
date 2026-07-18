import type { CSSProperties } from 'react';
import { CATEGORY_META, type Game } from '@/lib/types';
import { formatKoreanDate } from '@/lib/utils';
import { UI, CAL, CATEGORY_LABELS, type Locale } from '@/lib/i18nLabels';
import { PageShell } from './PageShell';
import { GameThumb } from './GameThumb';

interface SeoLandingProps {
  h1: string;
  intro: React.ReactNode;
  games: Game[];
  slug: string;
  lang?: Locale;
}

export function SeoLanding({ h1, intro, games, slug, lang }: SeoLandingProps) {
  const ui = lang ? UI[lang] : null;
  const t = lang ? CAL[lang] : null;
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
        <p className="seo-count">{t ? t.totalItems(games.length) : `총 ${games.length}개`}</p>
        <ul className="seo-list">
          {games.length === 0 ? (
            <li className="seo-empty">
              <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
              <span>{t ? t.noScheduleRegistered : '아직 등록된 일정이 없어요.'}</span>
            </li>
          ) : games.map(g => {
            const catLabel = lang ? CATEGORY_LABELS[lang][g.category] : (CATEGORY_META[g.category]?.label ?? g.category);
            const dateStr = g.release_date_approx
              ? (ui ? ui.tba : '미정')
              : (lang
                  ? new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(g.release_date))
                  : formatKoreanDate(g.release_date));
            return (
              <li
                key={g.id}
                className="seo-list-item"
                style={{ '--cat': CATEGORY_META[g.category]?.color } as CSSProperties}
              >
                <GameThumb src={g.image_url} alt={g.name_ko} />
                <div className="seo-li-body">
                  <div className="seo-li-main">
                    <span className={`category-tag cat-bg-${g.category}`}>{catLabel}</span>
                    <a href={`/game/${g.id}`} className="seo-name">{g.name_ko}</a>
                  </div>
                  <div className="seo-li-meta">
                    <span className="seo-date">{dateStr}</span>
                    {g.developer && <span className="seo-dev">· {g.developer}</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      </PageShell>
  );
}
