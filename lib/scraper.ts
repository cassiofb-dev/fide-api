import * as cheerio from 'cheerio'

export interface TopListPlayer {
  rank: number
  fideId: number
  name: string
  fed: string
  rating: number
  bYear: number | null
}

export interface PlayerProfile {
  id: number
  name: string
  federation: string | null
  birthYear: number | null
  gender: string | null
  title: string | null
  stdRating: number | null
  rapidRating: number | null
  blitzRating: number | null
  worldRankActive: number | null
  worldRankAll: number | null
  nationalRankActive: number | null
  nationalRankAll: number | null
  continentRankActive: number | null
  continentRankAll: number | null
  charts: {
    period: string
    rating: number | null
    games: number | null
    rapidRating: number | null
    rapidGames: number | null
    blitzRating: number | null
    blitzGames: number | null
  }[]
  stats: {
    whiteTotal: number
    whiteWinNum: number
    whiteDrawNum: number
    blackTotal: number
    blackWinNum: number
    blackDrawNum: number
    whiteTotalStd: number
    whiteWinNumStd: number
    whiteDrawNumStd: number
    blackTotalStd: number
    blackWinNumStd: number
    blackDrawNumStd: number
    whiteTotalRpd: number
    whiteWinNumRpd: number
    whiteDrawNumRpd: number
    blackTotalRpd: number
    blackWinNumRpd: number
    blackDrawNumRpd: number
    whiteTotalBlz: number
    whiteWinNumBlz: number
    whiteDrawNumBlz: number
    blackTotalBlz: number
    blackWinNumBlz: number
    blackDrawNumBlz: number
  } | null
}

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',
  'Accept': '*/*',
}

// Scrape Top 100 players list
export async function scrapeTopList(listType: string): Promise<TopListPlayer[]> {
  const url = `https://ratings.fide.com/a_top.php?list=${listType}`
  const response = await fetch(url, {
    headers: COMMON_HEADERS,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch top list from FIDE: ${response.statusText}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)
  const players: TopListPlayer[] = []

  $('table.top_recors_table tr').each((_, element) => {
    const rankSpan = $(element).find('.rank_span')
    if (rankSpan.length === 0) return

    const rank = parseInt(rankSpan.text().trim(), 10)
    const nameLink = $(element).find('a')
    const name = nameLink.text().trim()
    const href = nameLink.attr('href') || ''
    const fideIdMatch = href.match(/profile\/(\d+)/)
    const fideId = fideIdMatch ? parseInt(fideIdMatch[1], 10) : 0

    const fedTd = $(element).find('.flag-wrapper')
    const fed = fedTd.text().trim()

    const tds = $(element).find('td')
    const ratingText = $(tds[3]).text().trim()
    const rating = parseInt(ratingText, 10) || 0

    const bYearText = $(tds[4]).text().trim()
    const bYear = bYearText ? parseInt(bYearText, 10) : null

    if (fideId > 0 && name) {
      players.push({
        rank,
        fideId,
        name,
        fed,
        rating,
        bYear,
      })
    }
  })

  return players
}

// Scrape Player Profile
export async function scrapePlayerProfile(fideId: number): Promise<PlayerProfile> {
  const profileUrl = `https://ratings.fide.com/profile/${fideId}`
  const response = await fetch(profileUrl, {
    headers: COMMON_HEADERS,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch player profile from FIDE: ${response.statusText}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Parse Name
  const name = $('h1.player-title').text().trim()
  if (!name) {
    throw new Error(`Player with ID ${fideId} not found on FIDE.`)
  }

  // Parse Federation, B-Year, Gender, Title
  const federation = $('.profile-info-country').text().trim() || null
  const bYearText = $('.profile-info-byear').text().trim()
  const birthYear = bYearText ? parseInt(bYearText, 10) : null
  const gender = $('.profile-info-sex').text().trim() || null
  const title = $('.profile-info-title p').first().text().trim() || null

  // Parse Ratings
  const parseRatingText = (selector: string) => {
    const text = $(selector).find('p').first().text().trim()
    const val = parseInt(text, 10)
    return isNaN(val) ? null : val
  }

  const stdRating = parseRatingText('.profile-standart')
  const rapidRating = parseRatingText('.profile-rapid')
  const blitzRating = parseRatingText('.profile-blitz')

  // Parse Ranks
  let worldRankActive: number | null = null
  let worldRankAll: number | null = null
  let nationalRankActive: number | null = null
  let nationalRankAll: number | null = null
  let continentRankActive: number | null = null
  let continentRankAll: number | null = null

  $('.profile-rank-block').each((_, block) => {
    const blockTitle = $(block).find('h5').text().trim().toLowerCase()
    const rows = $(block).find('.profile-rank-row')

    let activeVal: number | null = null
    let allVal: number | null = null

    rows.each((_, row) => {
      const label = $(row).find('h6').text().trim().toLowerCase()
      const valText = $(row).find('p').text().trim()
      const val = parseInt(valText, 10)
      if (!isNaN(val)) {
        if (label.includes('active')) {
          activeVal = val
        } else if (label.includes('all')) {
          allVal = val
        }
      }
    })

    if (blockTitle.includes('world')) {
      worldRankActive = activeVal
      worldRankAll = allVal
    } else if (blockTitle.includes('national')) {
      nationalRankActive = activeVal
      nationalRankAll = allVal
    } else if (blockTitle.includes('continent')) {
      continentRankActive = activeVal
      continentRankAll = allVal
    }
  })

  // Fetch Chart Data
  let charts: PlayerProfile['charts'] = []
  try {
    const chartResponse = await fetch(`https://ratings.fide.com/a_chart_data.phtml?event=${fideId}&period=0`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://ratings.fide.com',
        'Referer': profileUrl,
      },
    })
    if (chartResponse.ok) {
      const chartJson = await chartResponse.json()
      if (Array.isArray(chartJson)) {
        charts = chartJson.map((item: any) => ({
          period: item.date_2 || '',
          rating: item.rating ? parseInt(item.rating, 10) : null,
          games: item.period_games ? parseInt(item.period_games, 10) : null,
          rapidRating: item.rapid_rtng ? parseInt(item.rapid_rtng, 10) : null,
          rapidGames: item.rapid_games ? parseInt(item.rapid_games, 10) : null,
          blitzRating: item.blitz_rtng ? parseInt(item.blitz_rtng, 10) : null,
          blitzGames: item.blitz_games ? parseInt(item.blitz_games, 10) : null,
        })).filter(c => c.period)
      }
    }
  } catch (err) {
    console.error('Failed to fetch chart data:', err)
  }

  // Fetch Stats Data
  let stats: PlayerProfile['stats'] = null
  try {
    const statsResponse = await fetch(`https://ratings.fide.com/a_data_stats.php?id1=${fideId}&id2=0`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://ratings.fide.com',
        'Referer': profileUrl,
      },
    })
    if (statsResponse.ok) {
      const statsJson = await statsResponse.json()
      if (Array.isArray(statsJson) && statsJson.length > 0) {
        const item = statsJson[0]
        stats = {
          whiteTotal: parseInt(item.white_total, 10) || 0,
          whiteWinNum: parseInt(item.white_win_num, 10) || 0,
          whiteDrawNum: parseInt(item.white_draw_num, 10) || 0,
          blackTotal: parseInt(item.black_total, 10) || 0,
          blackWinNum: parseInt(item.black_win_num, 10) || 0,
          blackDrawNum: parseInt(item.black_draw_num, 10) || 0,

          whiteTotalStd: parseInt(item.white_total_std, 10) || 0,
          whiteWinNumStd: parseInt(item.white_win_num_std, 10) || 0,
          whiteDrawNumStd: parseInt(item.white_draw_num_std, 10) || 0,
          blackTotalStd: parseInt(item.black_total_std, 10) || 0,
          blackWinNumStd: parseInt(item.black_win_num_std, 10) || 0,
          blackDrawNumStd: parseInt(item.black_draw_num_std, 10) || 0,

          whiteTotalRpd: parseInt(item.white_total_rpd, 10) || 0,
          whiteWinNumRpd: parseInt(item.white_win_num_rpd, 10) || 0,
          whiteDrawNumRpd: parseInt(item.white_draw_num_rpd, 10) || 0,
          blackTotalRpd: parseInt(item.black_total_rpd, 10) || 0,
          blackWinNumRpd: parseInt(item.black_win_num_rpd, 10) || 0,
          blackDrawNumRpd: parseInt(item.black_draw_num_rpd, 10) || 0,

          whiteTotalBlz: parseInt(item.white_total_blz, 10) || 0,
          whiteWinNumBlz: parseInt(item.white_win_num_blz, 10) || 0,
          whiteDrawNumBlz: parseInt(item.white_draw_num_blz, 10) || 0,
          blackTotalBlz: parseInt(item.black_total_blz, 10) || 0,
          blackWinNumBlz: parseInt(item.black_win_num_blz, 10) || 0,
          blackDrawNumBlz: parseInt(item.black_draw_num_blz, 10) || 0,
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch stats data:', err)
  }

  return {
    id: fideId,
    name,
    federation,
    birthYear,
    gender,
    title,
    stdRating,
    rapidRating,
    blitzRating,
    worldRankActive,
    worldRankAll,
    nationalRankActive,
    nationalRankAll,
    continentRankActive,
    continentRankAll,
    charts,
    stats,
  }
}
