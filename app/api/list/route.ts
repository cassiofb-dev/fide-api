import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeTopList } from '@/lib/scraper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const listType = searchParams.get('list') || 'open'
  const forceUpdate = searchParams.get('forceUpdate') === 'true'

  try {
    // 1. Check cache if not forcing update
    if (!forceUpdate) {
      const cached = await prisma.topList.findMany({
        where: { listType },
        orderBy: { rank: 'asc' },
      })

      if (cached.length > 0) {
        return NextResponse.json({ source: 'cache', data: cached })
      }
    }

    // 2. Scrape from FIDE
    const players = await scrapeTopList(listType)

    // 3. Save to database
    // Clear old list items for this listType first
    await prisma.topList.deleteMany({ where: { listType } })
    await prisma.topList.createMany({
      data: players.map(p => ({
        listType,
        rank: p.rank,
        fideId: p.fideId,
        name: p.name,
        fed: p.fed,
        rating: p.rating,
        bYear: p.bYear,
      })),
    })

    // Get the newly saved records
    const saved = await prisma.topList.findMany({
      where: { listType },
      orderBy: { rank: 'asc' },
    })

    return NextResponse.json({ source: 'scrape', data: saved })
  } catch (error: any) {
    console.error(`Error in /api/list:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top list' },
      { status: 500 }
    )
  }
}
