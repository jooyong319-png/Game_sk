import type { MetadataRoute } from 'next';
import { getAllGames, getLastUpdated } from '@/lib/games';
import { getAllPosts } from '@/lib/blog';
import { getAllNews } from '@/lib/news';

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

  return [...staticUrls, ...blogUrls, ...newsUrls, ...gameUrls];
}
