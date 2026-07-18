import type { MetadataRoute } from 'next';
import { getAllGames, getLastUpdated, getTranslatedGameIds } from '@/lib/games';
import { getAllPosts, getTranslatedSlugs } from '@/lib/blog';
import { getAllNews, getTranslatedNewsSlugs } from '@/lib/news';
import { getCouponPageKeys, getAllCouponKeys } from '@/lib/coupons';
import { LOCALES } from '@/lib/i18nLabels';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getAllGames();
  const now = new Date();
  const dataUpdated = new Date(await getLastUpdated());
  const todayStr = now.toISOString().slice(0, 10);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://gcalen.com/', lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: 'https://gcalen.com/upcoming-games', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://gcalen.com/pre-registration', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://gcalen.com/new-servers', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://gcalen.com/events', lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: 'https://gcalen.com/mobile-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/pc-console-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/global-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/news', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/coupons', lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: 'https://gcalen.com/games', lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: 'https://gcalen.com/guide', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://gcalen.com/about', lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://gcalen.com/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://gcalen.com/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://gcalen.com/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const gameUrls: MetadataRoute.Sitemap = games.map(g => {
    const upcoming = g.release_date_approx || g.release_date >= todayStr;
    // 사전예약/임박(출시예정) 게임을 상위 우선순위·잦은 갱신으로 신호
    const priority = g.pre_registration ? 0.85 : upcoming ? 0.75 : 0.6;
    return {
      url: `https://gcalen.com/game/${g.id}`,
      lastModified: dataUpdated,
      changeFrequency: (g.pre_registration || upcoming ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority,
    };
  });

  const posts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = posts.map(p => ({
    url: `https://gcalen.com/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const news = await getAllNews();
  const newsUrls: MetadataRoute.Sitemap = news.map(it => ({
    url: `https://gcalen.com/news/${it.slug}`,
    lastModified: new Date(it.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const couponKeys = await getCouponPageKeys();
  const couponUrls: MetadataRoute.Sitemap = couponKeys.map(key => ({
    url: `https://gcalen.com/coupons/${key}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const hubKeys = await getAllCouponKeys();
  const hubUrls: MetadataRoute.Sitemap = hubKeys.map(key => ({
    url: `https://gcalen.com/games/${key}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 다국어(/en, /ja) — 콘텐츠(게임/블로그/뉴스)는 번역이 실제로 존재하는 항목만(빈 페이지 방지)
  const localeUrls: MetadataRoute.Sitemap = [];
  for (const lang of LOCALES) {
    const [gameIds, blogSlugs, newsSlugs] = await Promise.all([
      getTranslatedGameIds(lang),
      getTranslatedSlugs(lang),
      getTranslatedNewsSlugs(lang),
    ]);
    for (const id of gameIds) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/game/${id}`, lastModified: dataUpdated, changeFrequency: 'weekly', priority: 0.6 });
    }
    for (const slug of blogSlugs) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/blog/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 });
    }
    for (const slug of newsSlugs) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/news/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 });
    }
    // 사이트 전체 UI 번역이 있는 고정 페이지 — 항상 존재
    const p = `https://gcalen.com/${lang}`;
    localeUrls.push(
      { url: p, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${p}/upcoming-games`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
      { url: `${p}/pre-registration`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
      { url: `${p}/new-servers`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
      { url: `${p}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
      { url: `${p}/mobile-games`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
      { url: `${p}/pc-console-games`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
      { url: `${p}/global-games`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
      { url: `${p}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
      { url: `${p}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
      { url: `${p}/coupons`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
      { url: `${p}/games`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
      { url: `${p}/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${p}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
      { url: `${p}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.35 },
      { url: `${p}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.25 },
      { url: `${p}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.25 }
    );
  }

  return [...staticUrls, ...blogUrls, ...newsUrls, ...couponUrls, ...hubUrls, ...gameUrls, ...localeUrls];
}
