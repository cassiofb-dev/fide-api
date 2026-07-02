import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapePlayerProfile } from '@/lib/scraper'

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
      const player = await prisma.player.findUnique({
        where: { id: fideId },
        include: {
          charts: true,
          stats: true,
        }
      })

      if (player) {
        return NextResponse.json({ source: 'cache', data: player })
      }
    }

    // 2. Scrape player profile from FIDE
    const profile = await scrapePlayerProfile(fideId)

    // 3. Save to database in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Upsert Player
      await tx.player.upsert({
        where: { id: fideId },
        update: {
          name: profile.name,
          federation: profile.federation,
          birthYear: profile.birthYear,
          gender: profile.gender,
          title: profile.title,
          stdRating: profile.stdRating,
          rapidRating: profile.rapidRating,
          blitzRating: profile.blitzRating,
          worldRankActive: profile.worldRankActive,
          worldRankAll: profile.worldRankAll,
          nationalRankActive: profile.nationalRankActive,
          nationalRankAll: profile.nationalRankAll,
          continentRankActive: profile.continentRankActive,
          continentRankAll: profile.continentRankAll,
        },
        create: {
          id: fideId,
          name: profile.name,
          federation: profile.federation,
          birthYear: profile.birthYear,
          gender: profile.gender,
          title: profile.title,
          stdRating: profile.stdRating,
          rapidRating: profile.rapidRating,
          blitzRating: profile.blitzRating,
          worldRankActive: profile.worldRankActive,
          worldRankAll: profile.worldRankAll,
          nationalRankActive: profile.nationalRankActive,
          nationalRankAll: profile.nationalRankAll,
          continentRankActive: profile.continentRankActive,
          continentRankAll: profile.continentRankAll,
        }
      })

      // Delete old charts and insert new ones
      await tx.playerChart.deleteMany({ where: { playerId: fideId } })
      if (profile.charts.length > 0) {
        await tx.playerChart.createMany({
          data: profile.charts.map(c => ({
            playerId: fideId,
            period: c.period,
            rating: c.rating,
            games: c.games,
            rapidRating: c.rapidRating,
            rapidGames: c.rapidGames,
            blitzRating: c.blitzRating,
            blitzGames: c.blitzGames,
          }))
        })
      }

      // Upsert stats
      if (profile.stats) {
        await tx.playerStats.upsert({
          where: { playerId: fideId },
          update: {
            ...profile.stats
          },
          create: {
            playerId: fideId,
            ...profile.stats
          }
        })
      } else {
        await tx.playerStats.deleteMany({ where: { playerId: fideId } })
      }
    })

    // 4. Retrieve complete saved profile
    const savedPlayer = await prisma.player.findUnique({
      where: { id: fideId },
      include: {
        charts: true,
        stats: true,
      }
    })

    return NextResponse.json({ source: 'scrape', data: savedPlayer })
  } catch (error: any) {
    console.error(`Error in /api/profile for ID ${fideId}:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player profile' },
      { status: 500 }
    )
  }
}
