import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapePlayerStats, scrapePlayerProfile } from '@/lib/scraper'

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
      const stats = await prisma.playerStats.findUnique({
        where: { playerId: fideId }
      })

      if (stats) {
        return NextResponse.json({ source: 'cache', data: stats })
      }
    }

    // 2. Ensure player exists in DB before upserting stats
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

    // 3. Scrape player stats
    const stats = await scrapePlayerStats(fideId)

    // 4. Save to database
    if (stats) {
      const savedStats = await prisma.playerStats.upsert({
        where: { playerId: fideId },
        update: {
          ...stats
        },
        create: {
          playerId: fideId,
          ...stats
        }
      })
      return NextResponse.json({ source: 'scrape', data: savedStats })
    } else {
      await prisma.playerStats.deleteMany({ where: { playerId: fideId } })
      return NextResponse.json({ source: 'scrape', data: null })
    }
  } catch (error: any) {
    console.error(`Error in /api/profile/stats for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player stats' },
      { status: 500 }
    )
  }
}
