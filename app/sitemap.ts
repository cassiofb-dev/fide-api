import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { players } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const topPlayers = await db
      .select({
        id: players.id,
        updatedAt: players.updatedAt,
      })
      .from(players)
      .orderBy(desc(players.stdRating))
      .limit(10);

    const playerRoutes: MetadataRoute.Sitemap = topPlayers.map((player) => ({
      url: `${baseUrl}/player/${player.id}`,
      lastModified: player.updatedAt ? new Date(player.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...routes, ...playerRoutes];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
    return routes;
  }
}
