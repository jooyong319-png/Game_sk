import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPreRegistrationGames } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game Pre-Registration Schedule',
    description: 'Games currently open for pre-registration or launching soon, across mobile, PC, and console — updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/pre-registration' },
  },
  ja: {
    title: 'ゲーム事前予約スケジュール',
    description: '現在事前予約受付中、またはまもなく開始予定のゲームをモバイル・PC・コンソール問わずまとめました。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/pre-registration' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>Games currently accepting pre-registration, or about to open it soon, across mobile, PC, and console — sorted by how soon they launch.</p>
      <p>Pre-registration often unlocks better day-one rewards the more people sign up, so it&rsquo;s worth tracking. Names and details below are shown in Korean (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>現在事前予約受付中、またはまもなく開始予定のゲームを、発売が近い順にまとめました。モバイル・PC・コンソール問わず対象です。</p>
      <p>事前予約は参加人数によって発売初日の特典が変わることが多く、要チェックです。以下の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'Game Pre-Registration Schedule', ja: 'ゲーム事前予約スケジュール' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getPreRegistrationGames();
  return <SeoLanding slug={`${lang}/pre-registration`} h1={H1[lang]} intro={INTRO[lang]} games={games} lang={lang} />;
}
