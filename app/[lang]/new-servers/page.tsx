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
    title: 'New Server & Major Update Schedule',
    description: 'New server openings and major updates for Korean MMORPGs (Lineage, MapleStory, Odin, and more) — updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/new-servers' },
  },
  ja: {
    title: '新規サーバー・大型アップデート情報',
    description: 'リネージュ、メイプルストーリー、オーディンなど韓国MMORPGの新規サーバーオープンと大型アップデート情報。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/new-servers' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>New server launches and major updates for Korean MMORPGs — Lineage, MapleStory, Odin, and more — plus live-service updates like Genshin Impact and Honkai: Star Rail.</p>
      <p>A fresh server is usually the best time for new or returning players to start, since everyone begins at the same point. Names and details below are shown in Korean (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>リネージュ、メイプルストーリー、オーディンなど韓国MMORPGの新規サーバーオープンと大型アップデート、原神・崩壊：スターレイルなどのライブサービス更新情報をまとめました。</p>
      <p>新規サーバーは全員が同じスタートラインに立てるため、新規・復帰プレイヤーに最も有利なタイミングです。以下の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'New Server & Major Update Schedule', ja: '新規サーバー・大型アップデート情報' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getUpcomingGamesByCategory('new_server');
  return <SeoLanding slug={`${lang}/new-servers`} h1={H1[lang]} intro={INTRO[lang]} games={games} />;
}
