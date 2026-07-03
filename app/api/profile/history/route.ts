import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapePlayerHistory, scrapePlayerProfile } from '@/lib/scraper'

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
      const chart = await prisma.playerChart.findUnique({
        where: { playerId: fideId }
      })

      if (chart) {
        return NextResponse.json({ source: 'cache', data: JSON.parse(chart.data) })
      }
    }

    // 2. Ensure player exists in DB before upserting chart (due to foreign key constraint)
    const playerExists = await prisma.player.findUnique({ where: { id: fideId } })
    if (!playerExists) {
      const basicProfile = await scrapePlayerProfile(fideId)
      await prisma.player.create({
        data: {
          id: fideId,
          name: basicProfile.name,
          federation: basicProfile.federation,
          birthYear: basicProfile.birthYear,
          gender: basicProfile.gender,
          title: basicProfile.title,
          stdRating: basicProfile.stdRating,
          rapidRating: basicProfile.rapidRating,
          blitzRating: basicProfile.blitzRating,
          worldRankActive: basicProfile.worldRankActive,
          worldRankAll: basicProfile.worldRankAll,
          nationalRankActive: basicProfile.nationalRankActive,
          nationalRankAll: basicProfile.nationalRankAll,
          continentRankActive: basicProfile.continentRankActive,
          continentRankAll: basicProfile.continentRankAll,
        }
      })
    }

    // 3. Scrape player history
    const history = await scrapePlayerHistory(fideId)

    // 4. Save to database
    const savedChart = await prisma.playerChart.upsert({
      where: { playerId: fideId },
      update: {
        data: JSON.stringify(history)
      },
      create: {
        playerId: fideId,
        data: JSON.stringify(history)
      }
    })

    return NextResponse.json({ source: 'scrape', data: JSON.parse(savedChart.data) })
  } catch (error: any) {
    console.error(`Error in /api/profile/history for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player history' },
      { status: 500 }
    )
  }
}
