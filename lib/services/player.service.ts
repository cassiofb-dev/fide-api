import { playerRepository } from '../repositories/player.repository';
import { scrapePlayerProfile, scrapePlayerHistory, scrapePlayerStats } from '../scraper';
import { parseAndValidateFideId, verifySyncThrottle } from '../auth';
import { DataSource, ResourceType } from '../enums';
import { ERROR_MESSAGES } from '../errors';
import { isEmpty } from '../utils';

export class PlayerService {
  async getPlayerProfile(idStr: string | null, forceUpdate: boolean, full: boolean, request: Request, retries?: number) {
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
      const [profileResult, historyResult, statsResult] = await Promise.allSettled([
        scrapePlayerProfile(fideId, retries),
        scrapePlayerHistory(fideId, retries),
        scrapePlayerStats(fideId, retries),
      ]);

      if (profileResult.status === 'rejected') {
        if (player) {
          return {
            source: DataSource.CACHE,
            data: {
              ...player,
              charts: (player as any).chart ? JSON.parse((player as any).chart.data) : [],
              stats: (player as any).stats || null,
            },
          };
        }
        throw profileResult.reason;
      }

      const profile = profileResult.value;

      if (isEmpty(profile) && player) {
        return {
          source: DataSource.CACHE,
          data: {
            ...player,
            charts: (player as any).chart ? JSON.parse((player as any).chart.data) : [],
            stats: (player as any).stats || null,
          },
        };
      }

      let history = historyResult.status === 'fulfilled' ? historyResult.value : [];
      let stats = statsResult.status === 'fulfilled' ? statsResult.value : null;

      // Check registered chart data to prevent deleting registered history
      const existingChartData = player && (player as any).chart ? JSON.parse((player as any).chart.data) : null;
      if (isEmpty(history) && !isEmpty(existingChartData)) {
        history = existingChartData;
      }

      // Check registered stats data to prevent deleting registered stats
      const existingStatsData = player && (player as any).stats ? (player as any).stats : null;
      if (isEmpty(stats) && !isEmpty(existingStatsData)) {
        const { playerId, updatedAt, ...cleanStats } = existingStatsData;
        stats = cleanStats;
      }

      const now = new Date().toISOString();
      const { charts: _, stats: __, ...profileData } = profile;

      // 3. Save to database using batch API
      await playerRepository.saveFullPlayerBatch(profileData, history, stats, now);

      // Retrieve complete relational record
      const savedPlayer = await playerRepository.findByIdWithRelations(fideId);

      if (!savedPlayer) {
        throw new Error(ERROR_MESSAGES.SAVE_PLAYER_FAILED);
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
      let profile: any = null;
      try {
        profile = await scrapePlayerProfile(fideId, retries);
      } catch (error) {
        if (player) {
          return {
            source: DataSource.CACHE,
            data: player,
          };
        }
        throw error;
      }

      if (isEmpty(profile) && player) {
        return {
          source: DataSource.CACHE,
          data: player,
        };
      }

      const now = new Date().toISOString();
      const { charts: _, stats: __, ...profileData } = profile;

      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: now,
      });

      const savedPlayer = await playerRepository.findById(fideId);

      if (!savedPlayer) {
        throw new Error(ERROR_MESSAGES.SAVE_PLAYER_FAILED);
      }

      return {
        source: DataSource.SCRAPE,
        data: savedPlayer,
      };
    }
  }

  async getPlayerHistory(idStr: string | null, forceUpdate: boolean, request: Request, retries?: number) {
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
      const basicProfile = await scrapePlayerProfile(fideId, retries);
      const { charts, stats, ...profileData } = basicProfile;
      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Scrape player history
    let history: any = [];
    try {
      history = await scrapePlayerHistory(fideId, retries);
    } catch (error) {
      if (chart) {
        return {
          source: DataSource.CACHE,
          data: JSON.parse(chart.data),
          updatedAt: chart.updatedAt,
        };
      }
      throw error;
    }

    if (isEmpty(history) && chart) {
      return {
        source: DataSource.CACHE,
        data: JSON.parse(chart.data),
        updatedAt: chart.updatedAt,
      };
    }

    // 4. Save to database
    const now = new Date().toISOString();
    const savedChart = await playerRepository.upsertChart(fideId, JSON.stringify(history), now);

    return {
      source: DataSource.SCRAPE,
      data: JSON.parse(savedChart.data),
      updatedAt: savedChart.updatedAt,
    };
  }

  async getPlayerStats(idStr: string | null, forceUpdate: boolean, request: Request, retries?: number) {
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
      const basicProfile = await scrapePlayerProfile(fideId, retries);
      const { charts, stats, ...profileData } = basicProfile;
      await playerRepository.insertPlayerOnly({
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Scrape player stats
    let stats: any = null;
    try {
      stats = await scrapePlayerStats(fideId, retries);
    } catch (error) {
      if (cachedStats) {
        return {
          source: DataSource.CACHE,
          data: cachedStats,
          updatedAt: cachedStats.updatedAt,
        };
      }
    }

    // 4. Save to database
    if (!isEmpty(stats)) {
      const now = new Date().toISOString();
      const savedStats = await playerRepository.upsertStats(fideId, stats, now);

      return {
        source: DataSource.SCRAPE,
        data: savedStats,
        updatedAt: savedStats.updatedAt,
      };
    } else {
      if (cachedStats) {
        return {
          source: DataSource.CACHE,
          data: cachedStats,
          updatedAt: cachedStats.updatedAt,
        };
      }
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
