import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/games';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getAllGames();
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://gcalen.com/', lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: 'https://gcalen.com/upcoming-games', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://gcalen.com/new-servers', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://gcalen.com/mobile-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/pc-console-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/global-games', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];

  const gameUrls: MetadataRoute.Sitemap = games.map(g => ({
    url: `https://gcalen.com/game/${g.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticUrls, ...gameUrls];
}
