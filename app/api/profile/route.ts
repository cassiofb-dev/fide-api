import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { players, playerCharts, playerStats } from '@/lib/schema'
import { scrapePlayerProfile, scrapePlayerHistory, scrapePlayerStats } from '@/lib/scraper'
import { eq } from 'drizzle-orm'
import { verifySyncPassword } from '@/lib/auth'

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
    // 1. Fetch cached player
    const player = await db.query.players.findFirst({
      where: (players, { eq }) => eq(players.id, fideId),
      with: {
        chart: true,
        stats: true,
      }
    })

    if (player) {
      if (forceUpdate) {
        const lastUpdated = new Date(player.updatedAt).getTime()
        const isRecent = Date.now() - lastUpdated < 10 * 60 * 1000
        if (isRecent && !verifySyncPassword(request)) {
          return NextResponse.json(
            { error: 'Syncing this profile again within 10 minutes requires a valid sync password.' },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json({
          source: 'cache',
          data: {
            ...player,
            charts: player.chart ? JSON.parse(player.chart.data) : [],
            stats: player.stats || null,
          }
        })
      }
    }

    // 2. Scrape player details, history, and stats in parallel
    const [profile, history, stats] = await Promise.all([
      scrapePlayerProfile(fideId),
      scrapePlayerHistory(fideId),
      scrapePlayerStats(fideId)
    ])

    // 3. Save to database using D1 Batch API
    const now = new Date().toISOString()
    const { charts, stats: _, ...profileData } = profile

    await db.batch([
      db.insert(players)
        .values({
          ...profileData,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: players.id,
          set: {
            ...profileData,
            updatedAt: now,
          }
        }),
      db.insert(playerCharts)
        .values({
          playerId: fideId,
          data: JSON.stringify(history),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: playerCharts.playerId,
          set: {
            data: JSON.stringify(history),
            updatedAt: now,
          }
        }),
      ...(stats
        ? [
            db.insert(playerStats)
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
          ]
        : [
            db.delete(playerStats).where(eq(playerStats.playerId, fideId))
          ])
    ])

    // 4. Retrieve complete relational record
    const savedPlayer = await db.query.players.findFirst({
      where: (players, { eq }) => eq(players.id, fideId),
      with: {
        chart: true,
        stats: true,
      }
    })

    if (!savedPlayer) {
      throw new Error('Failed to retrieve player after saving')
    }

    return NextResponse.json({
      source: 'scrape',
      data: {
        ...savedPlayer,
        charts: savedPlayer.chart ? JSON.parse(savedPlayer.chart.data) : [],
        stats: savedPlayer.stats || null,
      }
    })
  } catch (error: any) {
    console.error(`Error in /api/profile for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player profile' },
      { status: 500 }
    )
  }
}
