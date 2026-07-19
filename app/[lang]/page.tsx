import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getLastUpdated } from '@/lib/games';
import { getUpcomingEvents, EVENT_TYPE_META } from '@/lib/events';
import type { CalEvent } from '@/lib/types';
import { Home } from '@/components/Home';
import { UI, CAL, LOCALES, eventTitle, type Locale } from '@/lib/i18nLabels';

interface Props {
  params: { lang: string };
}

function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const ui = UI[params.lang];
  const url = `https://gcalen.com/${params.lang}`;
  return {
    title: ui.siteName,
    description: ui.siteDescription,
    alternates: {
      canonical: url,
      languages: { ko: 'https://gcalen.com/', en: 'https://gcalen.com/en', ja: 'https://gcalen.com/ja' },
    },
    openGraph: { title: ui.siteName, description: ui.siteDescription, url, type: 'website' },
  };
}

export default async function LocaleHomePage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const ui = UI[lang];

  const games = await getAllGames();
  const lastUpdated = await getLastUpdated();
  const serverNow = new Date().toISOString();

  const events = await getUpcomingEvents();
  const initialCalEvents: CalEvent[] = [];
  for (const e of events) {
    const color = EVENT_TYPE_META[e.type].color;
    const title = eventTitle(e, lang);
    initialCalEvents.push({ date: e.start_date, label: title, color, type: e.type, url: e.source_url, image: e.image_url ?? null });
    if (e.end_date !== e.start_date) {
      initialCalEvents.push({ date: e.end_date, label: CAL[lang].eventEnds(title), color, type: e.type, url: e.source_url, image: e.image_url ?? null });
    }
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ui.siteName,
    url: `https://gcalen.com/${lang}`,
    description: ui.siteDescription,
    inLanguage: lang,
  };

  const p = `/${lang}`;
  const seoLinks: { href: string; label: string }[] = [
    { href: `${p}/upcoming-games`, label: ui.upcoming },
    { href: `${p}/pre-registration`, label: ui.preReg },
    { href: `${p}/new-servers`, label: ui.newServers },
    { href: `${p}/mobile-games`, label: ui.mobile },
    { href: `${p}/pc-console-games`, label: ui.pcConsole },
    { href: `${p}/global-games`, label: ui.global },
    { href: `${p}/blog`, label: ui.blog },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Home initialGames={games} lastUpdated={lastUpdated} serverNow={serverNow} initialCalEvents={initialCalEvents} />
      <nav className="seo-nav" aria-label="Category shortcuts">
        {seoLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
    </>
  );
}
