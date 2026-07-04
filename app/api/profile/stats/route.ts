import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { players, playerStats } from '@/lib/schema'
import { scrapePlayerStats, scrapePlayerProfile } from '@/lib/scraper'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idStr = searchParams.get('id')
  const forceUpdate = searchParams.get('forceUpdate') === 'true'

  if (!idStr) {
    return NextResponse.json({ error: 'Missing player FIDE ID' }, { status: 400 })
  }

  const fideId = parseInt(idStr, 10)
  if (isNaN(fideId)) {
    return NextResponse.json({ error: 'Invalid player FIDE ID' }, { status: 400 })
  }

  try {
    // 1. Check cache if not forcing update
    if (!forceUpdate) {
      const stats = await db.query.playerStats.findFirst({
        where: (playerStats, { eq }) => eq(playerStats.playerId, fideId)
      })

      if (stats) {
        return NextResponse.json({
          source: 'cache',
          data: stats,
          updatedAt: stats.updatedAt
        })
      }
    }

    // 2. Ensure player exists in DB before upserting stats
    const playerExists = await db.query.players.findFirst({
      columns: { id: true },
      where: (players, { eq }) => eq(players.id, fideId)
    })

    if (!playerExists) {
      const basicProfile = await scrapePlayerProfile(fideId)
      const { charts, stats, ...profileData } = basicProfile
      await db.insert(players).values({
        ...profileData,
        updatedAt: new Date().toISOString(),
      })
    }

    // 3. Scrape player stats
    const stats = await scrapePlayerStats(fideId)

    // 4. Save to database
    if (stats) {
      const now = new Date().toISOString()
      const [savedStats] = await db.insert(playerStats)
        .values({
          playerId: fideId,
          ...stats,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: playerStats.playerId,
          set: {
            ...stats,
            updatedAt: now,
          }
        })
        .returning()

      return NextResponse.json({
        source: 'scrape',
        data: savedStats,
        updatedAt: savedStats.updatedAt
      })
    } else {
      await db.delete(playerStats).where(eq(playerStats.playerId, fideId))
      return NextResponse.json({
        source: 'scrape',
        data: null,
        updatedAt: null
      })
    }
  } catch (error: any) {
    console.error(`Error in /api/profile/stats for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player stats' },
      { status: 500 }
    )
  }
}
