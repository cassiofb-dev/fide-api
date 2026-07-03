-- Migration number: 0004 	 2026-07-03T00:11:00.000Z

-- DropIndex
DROP INDEX IF EXISTS "TopList_listType_rank_key";

-- DropTable
DROP TABLE IF EXISTS "TopList";

-- CreateTable
CREATE TABLE "TopList" (
    "listType" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
