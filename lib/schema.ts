import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const players = sqliteTable('Player', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  federation: text('federation'),
  birthYear: integer('birthYear'),
  gender: text('gender'),
  title: text('title'),
  stdRating: integer('stdRating'),
  rapidRating: integer('rapidRating'),
  blitzRating: integer('blitzRating'),
  worldRankActive: integer('worldRankActive'),
  worldRankAll: integer('worldRankAll'),
  nationalRankActive: integer('nationalRankActive'),
  nationalRankAll: integer('nationalRankAll'),
  continentRankActive: integer('continentRankActive'),
  continentRankAll: integer('continentRankAll'),
  createdAt: text('createdAt').$defaultFn(() => new Date().toISOString()).notNull(),
  updatedAt: text('updatedAt').$defaultFn(() => new Date().toISOString()).notNull(),
});

export const playersRelations = relations(players, ({ one }) => ({
  chart: one(playerCharts, {
    fields: [players.id],
    references: [playerCharts.playerId],
  }),
  stats: one(playerStats, {
    fields: [players.id],
    references: [playerStats.playerId],
  }),
}));

export const playerCharts = sqliteTable('PlayerChart', {
  playerId: integer('playerId').primaryKey().references(() => players.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  data: text('data').notNull(),
  updatedAt: text('updatedAt').$defaultFn(() => new Date().toISOString()).notNull(),
});

export const playerChartsRelations = relations(playerCharts, ({ one }) => ({
  player: one(players, {
    fields: [playerCharts.playerId],
    references: [players.id],
  }),
}));

export const playerStats = sqliteTable('PlayerStats', {
  playerId: integer('playerId').primaryKey().references(() => players.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  whiteTotal: integer('whiteTotal').notNull(),
  whiteWinNum: integer('whiteWinNum').notNull(),
  whiteDrawNum: integer('whiteDrawNum').notNull(),
  blackTotal: integer('blackTotal').notNull(),
  blackWinNum: integer('blackWinNum').notNull(),
  blackDrawNum: integer('blackDrawNum').notNull(),

  whiteTotalStd: integer('whiteTotalStd').notNull(),
  whiteWinNumStd: integer('whiteWinNumStd').notNull(),
  whiteDrawNumStd: integer('whiteDrawNumStd').notNull(),
  blackTotalStd: integer('blackTotalStd').notNull(),
  blackWinNumStd: integer('blackWinNumStd').notNull(),
  blackDrawNumStd: integer('blackDrawNumStd').notNull(),

  whiteTotalRpd: integer('whiteTotalRpd').notNull(),
  whiteWinNumRpd: integer('whiteWinNumRpd').notNull(),
  whiteDrawNumRpd: integer('whiteDrawNumRpd').notNull(),
  blackTotalRpd: integer('blackTotalRpd').notNull(),
  blackWinNumRpd: integer('blackWinNumRpd').notNull(),
  blackDrawNumRpd: integer('blackDrawNumRpd').notNull(),

  whiteTotalBlz: integer('whiteTotalBlz').notNull(),
  whiteWinNumBlz: integer('whiteWinNumBlz').notNull(),
  whiteDrawNumBlz: integer('whiteDrawNumBlz').notNull(),
  blackTotalBlz: integer('blackTotalBlz').notNull(),
  blackWinNumBlz: integer('blackWinNumBlz').notNull(),
  blackDrawNumBlz: integer('blackDrawNumBlz').notNull(),

  updatedAt: text('updatedAt').$defaultFn(() => new Date().toISOString()).notNull(),
});

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

export const topLists = sqliteTable('TopList', {
  listType: text('listType').primaryKey(),
  data: text('data').notNull(),
  createdAt: text('createdAt').$defaultFn(() => new Date().toISOString()).notNull(),
  updatedAt: text('updatedAt').$defaultFn(() => new Date().toISOString()).notNull(),
});
