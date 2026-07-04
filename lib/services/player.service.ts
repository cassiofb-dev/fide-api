import { playerRepository } from '../repositories/player.repository';
import { scrapePlayerProfile, scrapePlayerHistory, scrapePlayerStats } from '../scraper';
import { parseAndValidateFideId, verifySyncThrottle } from '../auth';
import { DataSource, ResourceType } from '../enums';

export class PlayerService {
  async getPlayerProfile(idStr: string | null, forceUpdate: boolean, full: boolean, request: Request) {
    const fideId = parseAndValidateFideId(idStr);

    // 1. Fetch cached player
    const player = full
      ? await playerRepository.findByIdWithRelations(fideId)
      : await playerRepository.findById(fideId);

    if (player) {
      if (forceUpdate) {
        verifySyncThrottle(player.updatedAt, request, ResourceType.PROFILE);
      } else {
        return {
          source: DataSource.CACHE,
          data: full
            ? {
                ...player,
                charts: (player as any).chart ? JSON.parse((player as any).chart.data) : [],
                stats: (player as any).stats || null,
              }
            : player,
        };
      }
    }

    if (full) {
      // 2. Scrape details in parallel
      const [profile, history, stats] = await Promise.all([
        scrapePlayerProfile(fideId),
        scrapePlayerHistory(fideId),
        scrapePlayerStats(fideId),
      ]);

      const now = new Date().toISOString();
      const { charts: _, stats: __, ...profileData } = profile;

      // 3. Save to database using batch API
      await playerRepository.saveFullPlayerBatch(profileData, history, stats, now);

      // Retrieve complete relational record
      const savedPlayer = await playerRepository.findByIdWithRelations(fideId);

      if (!savedPlayer) {
        throw new Error('Failed to retrieve player after saving');
      }

      return {
        source: DataSource.SCRAPE,
        data: {
          ...savedPlayer,
          charts: savedPlayer.chart ? JSON.parse(savedPlayer.chart.data) : [],
          stats: savedPlayer.stats || null,
        },
      };
    } else {
      // Scrape ONLY profile
      const profile = await scrapePlayerProfile(fideId);
      const now = new Date().toISOString();
      const { charts: _, stats: __, ...profileData } = profile;

      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: now,
      });

      const savedPlayer = await playerRepository.findById(fideId);

      if (!savedPlayer) {
        throw new Error('Failed to retrieve player after saving');
      }

      return {
        source: DataSource.SCRAPE,
        data: savedPlayer,
      };
    }
  }

  async getPlayerHistory(idStr: string | null, forceUpdate: boolean, request: Request) {
    const fideId = parseAndValidateFideId(idStr);

    // 1. Fetch cached chart
    const chart = await playerRepository.findChartByPlayerId(fideId);

    if (chart) {
      if (forceUpdate) {
        verifySyncThrottle(chart.updatedAt, request, ResourceType.HISTORY);
      } else {
        return {
          source: DataSource.CACHE,
          data: JSON.parse(chart.data),
          updatedAt: chart.updatedAt,
        };
      }
    }

    // 2. Ensure player exists in DB before upserting chart (due to foreign key constraint)
    const playerExists = await playerRepository.exists(fideId);

    if (!playerExists) {
      const basicProfile = await scrapePlayerProfile(fideId);
      const { charts, stats, ...profileData } = basicProfile;
      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Scrape player history
    const history = await scrapePlayerHistory(fideId);

    // 4. Save to database
    const now = new Date().toISOString();
    const savedChart = await playerRepository.upsertChart(fideId, JSON.stringify(history), now);

    return {
      source: DataSource.SCRAPE,
      data: JSON.parse(savedChart.data),
      updatedAt: savedChart.updatedAt,
    };
  }

  async getPlayerStats(idStr: string | null, forceUpdate: boolean, request: Request) {
    const fideId = parseAndValidateFideId(idStr);

    // 1. Fetch cached stats
    const cachedStats = await playerRepository.findStatsByPlayerId(fideId);

    if (cachedStats) {
      if (forceUpdate) {
        verifySyncThrottle(cachedStats.updatedAt, request, ResourceType.STATS);
      } else {
        return {
          source: DataSource.CACHE,
          data: cachedStats,
          updatedAt: cachedStats.updatedAt,
        };
      }
    }

    // 2. Ensure player exists in DB before upserting stats
    const playerExists = await playerRepository.exists(fideId);

    if (!playerExists) {
      const basicProfile = await scrapePlayerProfile(fideId);
      const { charts, stats, ...profileData } = basicProfile;
      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Scrape player stats
    const stats = await scrapePlayerStats(fideId);

    // 4. Save to database
    if (stats) {
      const now = new Date().toISOString();
      const savedStats = await playerRepository.upsertStats(fideId, stats, now);

      return {
        source: DataSource.SCRAPE,
        data: savedStats,
        updatedAt: savedStats.updatedAt,
      };
    } else {
      await playerRepository.deleteStats(fideId);
      return {
        source: DataSource.SCRAPE,
        data: null,
        updatedAt: null,
      };
    }
  }
}

export const playerService = new PlayerService();
