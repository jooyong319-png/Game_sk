import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGameHubs } from '@/lib/game-hub';
import { PageShell } from '@/components/PageShell';
import { LOCALES, termLabel, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/games/list.module.css';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export const dynamic = 'force-dynamic';

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game List | Coupons, Redeem Codes & Update Schedules',
    description: 'All games tracked by Gcalen — check each game’s latest coupon/redeem codes plus release, update, and event schedules in one place.',
    alternates: { canonical: 'https://gcalen.com/en/games' },
  },
  ja: {
    title: 'ゲーム一覧 | クーポン・リディームコード・更新情報',
    description: 'Gcalenが追跡する全ゲーム一覧。各ゲームの最新クーポン・リディームコードと発売・アップデート・イベント情報を一箇所で確認できます。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/games' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const H1: Record<Locale, string> = { en: 'Game List', ja: 'ゲーム一覧' };
const SUBTITLE: Record<Locale, string> = {
  en: 'Coupons/redeem codes plus release, update, and event schedules — all per game. Tap one to see the full hub.',
  ja: 'ゲームごとのクーポン・リディームコードと発売・アップデート・イベント情報をまとめて。タップしてハブページで詳細を確認できます。',
};
const EMPTY: Record<Locale, string> = { en: 'No games registered yet — check back soon!', ja: 'まだ登録されたゲームがありません。近日公開予定です!' };
const COUPONS_LINK: Record<Locale, string> = { en: 'Game coupons →', ja: 'ゲームクーポン一覧 →' };
const CALENDAR_LINK: Record<Locale, string> = { en: 'Release calendar →', ja: 'ゲーム発売カレンダー →' };
const SCHED: Record<Locale, string> = { en: 'schedule', ja: '日程' };
const EXPIRED: Record<Locale, string> = { en: 'past codes', ja: '過去のコード' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getAllGameHubs();

  return (
    <PageShell lang={lang}>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-gamepad" /></svg> {H1[lang]}</h1>
          <p className={styles.subtitle}>{SUBTITLE[lang]}</p>
        </header>

        {games.length === 0 ? (
          <p className={styles.empty}>{EMPTY[lang]}</p>
        ) : (
          <ul className={styles.grid}>
            {games.map(g => (
              <li key={g.key} className={styles.card}>
                <a href={`/${lang}/games/${g.key}`} className={styles.cardLink}>
                  {g.image_url
                    ? <img className={styles.thumb} src={g.image_url} alt="" loading="lazy" />
                    : <span className={styles.thumbPlaceholder} aria-hidden="true">🎮</span>}
                  <span className={styles.body}>
                    <span className={styles.name}>{g.name}</span>
                    <span className={styles.meta}>
                      {g.activeCount > 0 && <span className={styles.tagCoupon}>{termLabel(g.term, lang)} {g.activeCount}</span>}
                      {g.relatedCount > 0 && <span className={styles.tagSched}>{SCHED[lang]} {g.relatedCount}</span>}
                      {g.activeCount === 0 && g.relatedCount === 0 && g.expiredCount > 0 && (
                        <span className={styles.tagMuted}>{EXPIRED[lang]} {g.expiredCount}</span>
                      )}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.links}>
          <a href={`/${lang}/coupons`} className={styles.link}>{COUPONS_LINK[lang]}</a>
          <a href={`/${lang}`} className={styles.link}>{CALENDAR_LINK[lang]}</a>
        </div>
      </section>
    </PageShell>
  );
}
