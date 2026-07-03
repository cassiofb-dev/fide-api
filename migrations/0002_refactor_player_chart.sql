-- Migration number: 0002 	 2026-07-03T01:43:27.620Z

-- DropIndex
DROP INDEX IF EXISTS "PlayerChart_playerId_period_key";

-- DropTable
DROP TABLE IF EXISTS "PlayerChart";

-- CreateTable
CREATE TABLE "PlayerChart" (
    "playerId" INTEGER NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    CONSTRAINT "PlayerChart_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
