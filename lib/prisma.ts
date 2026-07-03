import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

let prismaInstance: PrismaClient | null = null

function getPrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  let db: any = null

  // 1. Try to get D1 database from OpenNext Cloudflare Context
  try {
    const context = getCloudflareContext()
    if (context && context.env) {
      db = context.env["fide-db"] || (context.env as any).DB
    }
  } catch (error) {
    console.warn("[Prisma] getCloudflareContext not available or failed:", error)
  }

  // 2. Fall back to process.env if needed (e.g., some scripts/local tools)
  if (!db) {
    db = (process.env as any)["fide-db"] || (process.env as any).DB
  }

  if (!db) {
    throw new Error(
      "D1 Database binding ('fide-db') is not available in the Cloudflare context or process.env. " +
      "Make sure you have configured the D1 binding correctly in wrangler.jsonc."
    )
  }

  const adapter = new PrismaD1(db)
  prismaInstance = new PrismaClient({ adapter })
  return prismaInstance
}

// Export a Proxy that behaves exactly like PrismaClient but lazily resolves the instance
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma()
    const value = Reflect.get(client, prop, receiver)
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})
