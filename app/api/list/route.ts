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
      const cached = await prisma.topList.findUnique({
        where: { listType },
      })

      if (cached) {
        return NextResponse.json({
          source: 'cache',
          data: JSON.parse(cached.data),
          updatedAt: cached.updatedAt,
        })
      }
    }

    // 2. Scrape from FIDE
    const players = await scrapeTopList(listType)

    // 3. Save to database
    const saved = await prisma.topList.upsert({
      where: { listType },
      update: {
        data: JSON.stringify(players),
      },
      create: {
        listType,
        data: JSON.stringify(players),
      },
    })

    return NextResponse.json({
      source: 'scrape',
      data: JSON.parse(saved.data),
      updatedAt: saved.updatedAt,
    })
  } catch (error: any) {
    console.error(`Error in /api/list:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top list' },
      { status: 500 }
    )
  }
}
