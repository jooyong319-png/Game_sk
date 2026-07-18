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
    title: 'Upcoming Global AAA Game Releases 2026',
    description: 'A roundup of the biggest global AAA game releases — updated daily.',
    alternates: { canonical: 'https://gcalen.com/en/global-games' },
  },
  ja: {
    title: 'グローバルAAA新作ゲーム発売予定 2026',
    description: '世界が注目するグローバルAAA新作ゲームの発売予定情報。毎日更新。',
    alternates: { canonical: 'https://gcalen.com/ja/global-games' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <p>The biggest global AAA releases coming to PS5, Xbox Series, Nintendo Switch 2, and Steam — sorted by release date and updated daily.</p>
      <p>Release dates and Korean-language support can vary by region, so check each title for platform and date details. Names and details below are shown in Korean (this site&rsquo;s primary data language).</p>
    </>
  ),
  ja: (
    <>
      <p>PS5、Xbox Series、Nintendo Switch 2、Steam向けに発売予定のグローバルAAA新作を発売日順にまとめ、毎日更新しています。</p>
      <p>海外大作は国・地域によって発売日や言語対応が異なる場合があるため、各タイトルで対応機種と正確な日程を確認してください。以下の一覧は韓国語(本サイトの基本データ言語)で表示されます。</p>
    </>
  ),
};

const H1: Record<Locale, string> = { en: 'Global AAA Game Release Schedule', ja: 'グローバルAAA新作ゲーム発売予定' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getUpcomingGamesByCategory('global_aaa');
  return <SeoLanding slug={`${lang}/global-games`} h1={H1[lang]} intro={INTRO[lang]} games={games} />;
}
