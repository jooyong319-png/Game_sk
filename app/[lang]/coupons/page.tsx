import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveCouponGames } from '@/lib/coupons';
import { PageShell } from '@/components/PageShell';
import { LOCALES, termLabel, couponGameName, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/coupons/coupons.module.css';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export const dynamic = 'force-dynamic';

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game Coupons & Redeem Codes',
    description: 'Popular games with active coupon/redeem codes. Tap a game for the latest codes and how to use them — updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/coupons' },
  },
  ja: {
    title: 'ゲームクーポン・リディームコード一覧',
    description: '有効なクーポン・リディームコードがある人気ゲームの一覧。ゲームをタップして最新コードと使い方を確認できます。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/coupons' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const H1: Record<Locale, string> = { en: 'Game Coupons & Redeem Codes', ja: 'ゲームクーポン・リディームコード一覧' };
const SUBTITLE: Record<Locale, string> = {
  en: 'Games with active coupon/redeem codes right now. Tap a game to see all codes and how to use them.',
  ja: '現在有効なクーポン・リディームコードがあるゲームです。ゲームをタップしてコードと使い方を確認してください。',
};
const EMPTY: Record<Locale, string> = {
  en: 'No active coupons right now. New codes will appear here as publishers release them — check back soon!',
  ja: '現在有効なクーポンはありません。新しいコードが配布され次第ここに表示されます。近日更新予定です!',
};
const ALL_GAMES: Record<Locale, string> = { en: 'Full game list →', ja: 'ゲーム一覧を見る →' };
const NOTE: Record<Locale, string> = {
  en: 'Codes may expire or run out depending on the publisher.',
  ja: 'コードはゲームメーカーの都合により期限切れ・早期終了する場合があります。',
};

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getActiveCouponGames();

  return (
    <PageShell lang={lang}>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg> {H1[lang]}</h1>
          <p className={styles.subtitle}>{SUBTITLE[lang]}</p>
        </header>

        {games.length === 0 ? (
          <p className={styles.empty}>{EMPTY[lang]}</p>
        ) : (
          <ul className={styles.grid}>
            {games.map(g => (
              <li key={g.key} className={styles.card}>
                <a href={`/${lang}/coupons/${g.key}`} className={styles.cardLink}>
                  {g.image_url
                    ? <img className={styles.thumb} src={g.image_url} alt="" loading="lazy" />
                    : <span className={styles.thumbPlaceholder} aria-hidden="true">🎮</span>}
                  <span className={styles.body}>
                    <span className={styles.name}>{couponGameName(g, lang)}</span>
                    <span className={styles.meta}>
                      <span className={styles.tagCoupon}>{termLabel(g.term, lang)} {g.active.length}</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.links}>
          <a href={`/${lang}/games`} className={styles.link}>{ALL_GAMES[lang]}</a>
        </div>
        <p className={styles.note}>{NOTE[lang]}</p>
      </section>
    </PageShell>
  );
}
