import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { topLists } from '@/lib/schema'
import { scrapeTopList } from '@/lib/scraper'
import { verifySyncPassword } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const listType = searchParams.get('list') || 'open'
  const forceUpdate = searchParams.get('forceUpdate') === 'true'

  try {
    // 1. Fetch cached list
    const cached = await db.query.topLists.findFirst({
      where: (topLists, { eq }) => eq(topLists.listType, listType),
    })

    if (cached) {
      if (forceUpdate) {
        const lastUpdated = new Date(cached.updatedAt).getTime()
        const isRecent = Date.now() - lastUpdated < 10 * 60 * 1000
        if (isRecent && !verifySyncPassword(request)) {
          return NextResponse.json(
            { error: 'Syncing this list again within 10 minutes requires a valid sync password.' },
            { status: 401 }
          )
        }
      } else {
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
