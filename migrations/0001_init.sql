-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "federation" TEXT,
    "birthYear" INTEGER,
    "gender" TEXT,
    "title" TEXT,
    "stdRating" INTEGER,
    "rapidRating" INTEGER,
    "blitzRating" INTEGER,
    "worldRankActive" INTEGER,
    "worldRankAll" INTEGER,
    "nationalRankActive" INTEGER,
    "nationalRankAll" INTEGER,
    "continentRankActive" INTEGER,
    "continentRankAll" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerChart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "rating" INTEGER,
    "games" INTEGER,
    "rapidRating" INTEGER,
    "rapidGames" INTEGER,
    "blitzRating" INTEGER,
    "blitzGames" INTEGER,
    CONSTRAINT "PlayerChart_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "playerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "whiteTotal" INTEGER NOT NULL,
    "whiteWinNum" INTEGER NOT NULL,
    "whiteDrawNum" INTEGER NOT NULL,
    "blackTotal" INTEGER NOT NULL,
    "blackWinNum" INTEGER NOT NULL,
    "blackDrawNum" INTEGER NOT NULL,
    "whiteTotalStd" INTEGER NOT NULL,
    "whiteWinNumStd" INTEGER NOT NULL,
    "whiteDrawNumStd" INTEGER NOT NULL,
    "blackTotalStd" INTEGER NOT NULL,
    "blackWinNumStd" INTEGER NOT NULL,
    "blackDrawNumStd" INTEGER NOT NULL,
    "whiteTotalRpd" INTEGER NOT NULL,
    "whiteWinNumRpd" INTEGER NOT NULL,
    "whiteDrawNumRpd" INTEGER NOT NULL,
    "blackTotalRpd" INTEGER NOT NULL,
    "blackWinNumRpd" INTEGER NOT NULL,
    "blackDrawNumRpd" INTEGER NOT NULL,
    "whiteTotalBlz" INTEGER NOT NULL,
    "whiteWinNumBlz" INTEGER NOT NULL,
    "whiteDrawNumBlz" INTEGER NOT NULL,
    "blackTotalBlz" INTEGER NOT NULL,
    "blackWinNumBlz" INTEGER NOT NULL,
    "blackDrawNumBlz" INTEGER NOT NULL,
    CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TopList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listType" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "fideId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fed" TEXT,
    "rating" INTEGER NOT NULL,
    "bYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerChart_playerId_period_key" ON "PlayerChart"("playerId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "TopList_listType_rank_key" ON "TopList"("listType", "rank");
