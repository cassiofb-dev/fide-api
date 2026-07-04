import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { players, playerCharts } from '@/lib/schema'
import { scrapePlayerHistory, scrapePlayerProfile } from '@/lib/scraper'
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
    // 1. Fetch cached chart
    const chart = await db.query.playerCharts.findFirst({
      where: (charts, { eq }) => eq(charts.playerId, fideId)
    })

    if (chart) {
      if (forceUpdate) {
        const lastUpdated = new Date(chart.updatedAt).getTime()
        const isRecent = Date.now() - lastUpdated < 10 * 60 * 1000
        if (isRecent && !verifySyncPassword(request)) {
          return NextResponse.json(
            { error: 'Syncing this history again within 10 minutes requires a valid sync password.' },
            { status: 401 }
          )
        }
      } else {
        return NextResponse.json({
          source: 'cache',
          data: JSON.parse(chart.data),
          updatedAt: chart.updatedAt
        })
      }
    }

    // 2. Ensure player exists in DB before upserting chart (due to foreign key constraint)
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

    // 3. Scrape player history
    const history = await scrapePlayerHistory(fideId)

    // 4. Save to database
    const now = new Date().toISOString()
    const [savedChart] = await db.insert(playerCharts)
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
      })
      .returning()

    return NextResponse.json({
      source: 'scrape',
      data: JSON.parse(savedChart.data),
      updatedAt: savedChart.updatedAt
    })
  } catch (error: any) {
    console.error(`Error in /api/profile/history for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player history' },
      { status: 500 }
    )
  }
}
