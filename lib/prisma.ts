import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

let prisma: PrismaClient

const globalRef = globalThis as any

if (typeof process !== 'undefined' && process.env.DB) {
  // Cloudflare D1 environment
  const adapter = new PrismaD1(process.env.DB as any)
  prisma = new PrismaClient({ adapter })
} else {
  // Local development SQLite fallback using better-sqlite3 adapter for Prisma 7
  if (!globalRef.prisma) {
    const dbPath = 'file:' + path.join(process.cwd(), 'dev.db')
    const adapter = new PrismaBetterSqlite3({ url: dbPath })
    globalRef.prisma = new PrismaClient({ adapter })
  }
  prisma = globalRef.prisma
}

export { prisma }
