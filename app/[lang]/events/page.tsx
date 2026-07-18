import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUpcomingEvents, EVENT_TYPE_META, type EventType, type GameEvent } from '@/lib/events';
import { PageShell } from '@/components/PageShell';
import { FreeGames } from '@/components/FreeGames';
import { LOCALES, EVENT_TYPE_LABELS, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game Event Calendar | Game Shows, Free Games, Sales, New Seasons',
    description: 'Epic Games free giveaways, Steam sales, game shows (Gamescom, Tokyo Game Show, The Game Awards), and new-season launches — all in one place.',
    alternates: { canonical: 'https://gcalen.com/en/events' },
  },
  ja: {
    title: 'ゲームイベントカレンダー | ゲームショー・無料配布・セール・新シーズン',
    description: 'Epic Games無料配布、Steamセール、ゲームズコム・東京ゲームショウ・The Game Awardsなどのゲームショー、シーズン制ゲームの新シーズン情報を一箇所に。',
    alternates: { canonical: 'https://gcalen.com/ja/events' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function fmtRange(e: GameEvent, approxLabel: string): string {
  if (e.start_date === e.end_date) return fmtDate(e.start_date) + (e.date_approx ? ` (${approxLabel})` : '');
  return `${fmtDate(e.start_date)} – ${fmtDate(e.end_date)}` + (e.date_approx ? ` (${approxLabel})` : '');
}

const ORDER: EventType[] = ['game_show', 'sale', 'season'];

const H1: Record<Locale, string> = { en: 'Game Event Calendar', ja: 'ゲームイベントカレンダー' };
const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      There&rsquo;s more to track than just releases — <strong>Epic Games free giveaways</strong>,{' '}
      <strong>Steam sales</strong>, <strong>game shows</strong> like Gamescom and G-Star, and{' '}
      <strong>new-season launches</strong> for live-service games. Event names and descriptions below are shown in Korean (this site&rsquo;s primary data language).
    </>
  ),
  ja: (
    <>
      発売情報以外にも押さえておきたい予定はたくさんあります。<strong>Epic Games無料配布</strong>、
      {' '}<strong>Steamセール</strong>、ゲームズコムやG-STARなどの<strong>ゲームショー</strong>、
      {' '}ライブサービスゲームの<strong>新シーズン開幕</strong>まで。以下のイベント名・説明は韓国語(本サイトの基本データ言語)で表示されます。
    </>
  ),
};
const APPROX: Record<Locale, string> = { en: 'TBA', ja: '予定' };
const FOOT: Record<Locale, React.ReactNode> = {
  en: <>Event schedules are updated daily.</>,
  ja: <>イベント情報は毎日更新されます。</>,
};
const OFFICIAL: Record<Locale, string> = { en: 'Official site →', ja: '公式サイト →' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const events = await getUpcomingEvents();
  const byType = (t: EventType) => events.filter(e => e.type === t);

  return (
    <PageShell lang={lang}>
      <section className="events-page">
        <h1>{H1[lang]}</h1>
        <p className="events-intro">{INTRO[lang]}</p>

        <FreeGames />

        {ORDER.map(type => {
          const list = byType(type);
          if (list.length === 0) return null;
          return (
            <section key={type} className="events-group">
              <h2>
                <span className="events-dot" style={{ background: EVENT_TYPE_META[type].color }} />
                {EVENT_TYPE_LABELS[lang][type as 'game_show' | 'sale' | 'season']}
              </h2>
              <ul className="events-list">
                {list.map(e => (
                  <li key={e.id} className="events-item">
                    <div className="events-item-head">
                      <span className="events-name">{e.title}</span>
                      {e.host && <span className="events-host">{e.host}</span>}
                    </div>
                    <div className="events-date">{fmtRange(e, APPROX[lang])}</div>
                    {e.description && <p className="events-desc">{e.description}</p>}
                    {e.source_url && (
                      <a className="events-src" href={e.source_url} target="_blank" rel="noopener">{OFFICIAL[lang]}</a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className="events-foot">{FOOT[lang]}</p>
      </section>
    </PageShell>
  );
}
