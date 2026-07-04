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
  const full = searchParams.get('full') === 'true'

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
      with: full ? {
        chart: true,
        stats: true,
      } : undefined
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
        // Return cached player. Format charts and stats if full is requested.
        return NextResponse.json({
          source: 'cache',
          data: full ? {
            ...player,
            charts: (player as any).chart ? JSON.parse((player as any).chart.data) : [],
            stats: (player as any).stats || null,
          } : player
        })
      }
    }

    if (full) {
      // 2. Scrape player details, history, and stats in parallel
      const [profile, history, stats] = await Promise.all([
        scrapePlayerProfile(fideId),
        scrapePlayerHistory(fideId),
        scrapePlayerStats(fideId)
      ])

      const now = new Date().toISOString()
      const { charts: _, stats: __, ...profileData } = profile

      // 3. Save to database using D1 Batch API
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

      // Retrieve complete relational record
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
    } else {
      // Scrape ONLY player profile
      const profile = await scrapePlayerProfile(fideId)
      const now = new Date().toISOString()
      const { charts: _, stats: __, ...profileData } = profile

      await db.insert(players)
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
        })

      const savedPlayer = await db.query.players.findFirst({
        where: (players, { eq }) => eq(players.id, fideId),
      })

      if (!savedPlayer) {
        throw new Error('Failed to retrieve player after saving')
      }

      return NextResponse.json({
        source: 'scrape',
        data: savedPlayer
      })
    }
  } catch (error: any) {
    console.error(`Error in /api/profile for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player profile' },
      { status: 500 }
    )
  }
}
