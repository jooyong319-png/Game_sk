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
    title: 'Upcoming Mobile Game Releases (Korea)',
    description: 'Upcoming mobile game releases in Korea from major publishers like Nexon, Netmarble, and Kakao Games — updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/mobile-games' },
  },
  ja: {
    title: '新規モバイルゲーム発売予定(韓国)',
    description: 'ネクソン、ネットマーブル、カカオゲームズなど韓国の主要パブリッシャーによる新作モバイルゲームの発売予定情報。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/mobile-games' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>Upcoming mobile game releases in Korea, sorted by launch date — new titles from Nexon, Netmarble, Kakao Games, NCSoft, Gravity, and more.</p>
      <p>Many mobile titles offer better day-one rewards through pre-registration. Names and details below are shown in Korean (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>韓国国内で発売予定の新作モバイルゲームを発売日順にまとめました。ネクソン、ネットマーブル、カカオゲームズ、エヌシーソフト、グラビティなど主要パブリッシャーの新作が対象です。</p>
      <p>モバイル新作の多くは事前予約で発売初日の特典が変わります。以下の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'Upcoming Mobile Game Releases (Korea)', ja: '新規モバイルゲーム発売予定(韓国)' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getUpcomingGamesByCategory('mobile_kr');
  return <SeoLanding slug={`${lang}/mobile-games`} h1={H1[lang]} intro={INTRO[lang]} games={games} lang={lang} />;
}
