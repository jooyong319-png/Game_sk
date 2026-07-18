import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUpcomingGames } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Upcoming Game Releases 2026',
    description: 'A roundup of upcoming game releases in Korea and worldwide — mobile, PC/console, and global AAA titles, all in one place.',
    alternates: { canonical: 'https://gcalen.com/en/upcoming-games' },
  },
  ja: {
    title: '発売予定ゲーム一覧 2026',
    description: '国内外の発売予定ゲームをまとめてチェック。モバイル・PC/コンソール・グローバルAAAタイトルを一箇所に。',
    alternates: { canonical: 'https://gcalen.com/ja/upcoming-games' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>A curated, daily-updated list of upcoming game releases across Korea and worldwide — mobile, PC/console, global AAA, and new MMO servers, sorted by release date.</p>
      <p>Click any title for developer, platform, and countdown details. The list below shows each game&rsquo;s Korean name and data (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>国内外の発売予定ゲームを発売日順にまとめました。モバイル・PC/コンソール・グローバルAAA・韓国MMO新規サーバーまで、毎日更新しています。</p>
      <p>各タイトルをクリックすると、開発元・対応機種・カウントダウンを確認できます。下記の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'Upcoming Game Releases', ja: '発売予定ゲーム一覧' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getUpcomingGames();
  return <SeoLanding slug={`${lang}/upcoming-games`} h1={H1[lang]} intro={INTRO[lang]} games={games} lang={lang} />;
}
