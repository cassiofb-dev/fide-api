import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { topLists } from '@/lib/schema'
import { scrapeTopList } from '@/lib/scraper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const listType = searchParams.get('list') || 'open'
  const forceUpdate = searchParams.get('forceUpdate') === 'true'

  try {
    // 1. Check cache if not forcing update
    if (!forceUpdate) {
      const cached = await db.query.topLists.findFirst({
        where: (topLists, { eq }) => eq(topLists.listType, listType),
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
    const now = new Date().toISOString()
    const [saved] = await db.insert(topLists)
      .values({
        listType,
        data: JSON.stringify(players),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: topLists.listType,
        set: {
          data: JSON.stringify(players),
          updatedAt: now,
        },
      })
      .returning()

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
