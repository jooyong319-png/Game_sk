import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Upcoming PC & Console Game Releases (Korea)',
    description: 'Upcoming PC and console game releases in Korea — Steam, PS5, Xbox, and Nintendo Switch titles, updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/pc-console-games' },
  },
  ja: {
    title: '新規PC・コンソールゲーム発売予定(韓国)',
    description: 'Steam、PS5、Xbox、Nintendo Switch向けの韓国国内発売予定PC・コンソールゲーム情報。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/pc-console-games' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>Upcoming PC and console releases in Korea across Steam, PS5, Xbox Series, and Nintendo Switch/Switch 2 — from Korean-developed MMORPGs to console packaged titles.</p>
      <p>Release timing and supported platforms can differ between PC and console versions of the same game. Names and details below are shown in Korean (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>Steam、PS5、Xbox Series、Nintendo Switch/Switch 2向けの韓国国内発売予定PC・コンソールゲームをまとめました。韓国産PC MMORPGからコンソールパッケージ新作まで対象です。</p>
      <p>同じタイトルでもPC版とコンソール版で発売時期や対応機種が異なる場合があります。以下の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'Upcoming PC & Console Game Releases (Korea)', ja: '新規PC・コンソールゲーム発売予定(韓国)' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getUpcomingGamesByCategory('pc_console_kr');
  return <SeoLanding slug={`${lang}/pc-console-games`} h1={H1[lang]} intro={INTRO[lang]} games={games} lang={lang} />;
}
