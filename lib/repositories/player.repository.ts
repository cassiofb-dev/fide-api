import { db } from '../db';
import { players, playerCharts, playerStats } from '../schema';
import { eq } from 'drizzle-orm';

export class PlayerRepository {
  async findById(fideId: number) {
    return db.query.players.findFirst({
      where: (players, { eq }) => eq(players.id, fideId),
    });
  }

  async findByIdWithRelations(fideId: number) {
    return db.query.players.findFirst({
      where: (players, { eq }) => eq(players.id, fideId),
      with: {
        chart: true,
        stats: true,
      },
    });
  }

  async exists(fideId: number): Promise<boolean> {
    const player = await db.query.players.findFirst({
      columns: { id: true },
      where: (players, { eq }) => eq(players.id, fideId),
    });
    return !!player;
  }

  async insertPlayerOnly(playerData: any) {
    return db.insert(players)
      .values(playerData)
      .onConflictDoUpdate({
        target: players.id,
        set: playerData,
      });
  }

  async findChartByPlayerId(playerId: number) {
    return db.query.playerCharts.findFirst({
      where: (charts, { eq }) => eq(charts.playerId, playerId),
    });
  }

  async findStatsByPlayerId(playerId: number) {
    return db.query.playerStats.findFirst({
      where: (playerStats, { eq }) => eq(playerStats.playerId, playerId),
    });
  }

  async upsertChart(playerId: number, data: string, updatedAt: string) {
    const [saved] = await db.insert(playerCharts)
      .values({
        playerId,
        data,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: playerCharts.playerId,
        set: {
          data,
          updatedAt,
        },
      })
      .returning();
    return saved;
  }

  async upsertStats(playerId: number, statsData: any, updatedAt: string) {
    const [saved] = await db.insert(playerStats)
      .values({
        playerId,
        ...statsData,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: playerStats.playerId,
        set: {
          ...statsData,
          updatedAt,
        },
      })
      .returning();
    return saved;
  }

  async deleteStats(playerId: number) {
    return db.delete(playerStats).where(eq(playerStats.playerId, playerId));
  }

  async saveFullPlayerBatch(playerData: any, historyData: any, statsData: any | null, now: string) {
    await db.batch([
      db.insert(players)
        .values({
          ...playerData,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: players.id,
          set: {
            ...playerData,
            updatedAt: now,
          },
        }),
      db.insert(playerCharts)
        .values({
          playerId: playerData.id,
          data: JSON.stringify(historyData),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: playerCharts.playerId,
          set: {
            data: JSON.stringify(historyData),
            updatedAt: now,
          },
        }),
      ...(statsData
        ? [
            db.insert(playerStats)
              .values({
                playerId: playerData.id,
                ...statsData,
                updatedAt: now,
              })
              .onConflictDoUpdate({
                target: playerStats.playerId,
                set: {
                  ...statsData,
                  updatedAt: now,
                },
              }),
          ]
        : [
            db.delete(playerStats).where(eq(playerStats.playerId, playerData.id)),
          ]),
    ]);
  }
}

export const playerRepository = new PlayerRepository();
