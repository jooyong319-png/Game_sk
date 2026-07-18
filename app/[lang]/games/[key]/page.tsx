import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGameHub, getGameHubKeys } from '@/lib/game-hub';
import { getCouponsLastUpdated, couponKeywords } from '@/lib/coupons';
import { CouponList } from '@/components/CouponList';
import { ViewCounter } from '@/components/ViewCounter';
import { PageShell } from '@/components/PageShell';
import { LOCALES, UI, CAL, termLabel, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/games/list.module.css';

interface Props {
  params: { lang: string; key: string };
}

function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export async function generateStaticParams() {
  const keys = await getGameHubKeys();
  const params: { lang: Locale; key: string }[] = [];
  for (const lang of LOCALES) {
    for (const key of keys) params.push({ lang, key });
  }
  return params;
}

function fullDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const t = CAL[lang];
  const hub = await getGameHub(params.key);
  if (!hub) return { title: UI[lang].notFound };
  const { view } = hub;
  const { name, term: rawTerm } = view;
  const term = termLabel(rawTerm, lang);
  const url = `https://gcalen.com/${lang}/games/${view.key}`;
  const title = `${name} — ${term}, events & updates`;
  const desc = `${name}'s latest ${term} plus upcoming updates, events, and release schedule, all in one place. Updated daily.`.slice(0, 158);

  return {
    title: { absolute: `${title} | Gcalen` },
    description: desc,
    keywords: [...couponKeywords(name), `${name} schedule`, `${name} events`, `${name} update`],
    alternates: {
      canonical: url,
      languages: {
        ko: `https://gcalen.com/games/${view.key}`,
        en: `https://gcalen.com/en/games/${view.key}`,
        ja: `https://gcalen.com/ja/games/${view.key}`,
      },
    },
    openGraph: { title, description: desc, url, type: 'article', images: [{ url: view.image_url || '/og-image.png', alt: name }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [view.image_url || '/og-image.png'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function LocaleGameHubPage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const ui = UI[lang];
  const t = CAL[lang];
  const hub = await getGameHub(params.key);
  if (!hub) notFound();
  const { view, related } = hub;
  const { key, name, term: rawTerm, active, expired, image_url } = view;
  const term = termLabel(rawTerm, lang);

  if (active.length === 0 && expired.length === 0 && related.length === 0) notFound();

  const lastUpdated = await getCouponsLastUpdated();
  const todayKst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoGame', name,
        ...(image_url ? { image: image_url } : {}),
        url: `https://gcalen.com/${lang}/games/${key}`,
        applicationCategory: 'Game',
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <header className={styles.hero}>
          {image_url && <img className={styles.heroImg} src={image_url} alt={name} loading="eager" />}
          <div className={styles.heroBody}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.badges}>
              {active.length > 0 && <span className={styles.badge}>{term} {active.length}</span>}
              {related.length > 0 && <span className={styles.badgeAlt}>{t.scheduleCount(related.length)}</span>}
            </div>
            <p className={styles.lead}>
              {name}'s latest {term} plus upcoming updates, events, and release schedule.
            </p>
            <ViewCounter gameId={`hub:${key}`} />
          </div>
        </header>

        {(active.length > 0 || expired.length > 0) && (
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{name} {term}</h2>
            {active.length > 0
              ? <CouponList coupons={active} />
              : <p className={styles.muted}>{t.noValidCodesShort}</p>}
            <a href={`/${lang}/coupons/${key}`} className={styles.moreLink}>
              {t.gameCoupons}: {name} {term} →
            </a>
          </div>
        )}

        {related.length > 0 && (
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{t.scheduleTitle(name)}</h2>
            <ul className={styles.schedule}>
              {related.map(g => {
                const upcoming = g.release_date_approx || g.release_date >= todayKst;
                const dateStr = g.release_date_approx ? ui.tba : fullDate(g.release_date, lang);
                return (
                  <li key={g.id} className={styles.schedItem}>
                    <a href={`/game/${g.id}`} className={styles.schedLink}>
                      {g.image_url && <img className={styles.schedThumb} src={g.image_url} alt="" loading="lazy" />}
                      <span className={styles.schedText}>
                        <span className={styles.schedName}>{g.name_ko}</span>
                        <span className={styles.schedMeta}>
                          <span className={upcoming ? styles.schedDateUp : styles.schedDate}>{dateStr}</span>
                          {upcoming && <span className={styles.schedTag}>{t.upcomingTag}</span>}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className={styles.related}>
          <a href={`/${lang}/games`} className={styles.relatedLink}>{t.fullGameList}</a>
          <a href={`/${lang}/coupons`} className={styles.relatedLink}>{t.otherGameCouponsShort}</a>
          <a href={`/${lang}`} className={styles.relatedLink}>{t.gcalenHome}</a>
        </div>

        {lastUpdated && (
          <p className={styles.note}>{t.hubLastUpdatedNote(fullDate(lastUpdated, lang))}</p>
        )}
      </section>
    </PageShell>
  );
}
