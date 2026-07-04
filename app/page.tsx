"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface ListPlayer {
  rank: number
  fideId: number
  name: string
  fed: string
  rating: number
  bYear: number | null
  updatedAt?: string
}

interface PlayerChart {
  period: string
  rating: number | null
  games: number | null
  rapidRating: number | null
  rapidGames: number | null
  blitzRating: number | null
  blitzGames: number | null
}

interface PlayerStats {
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
}

interface PlayerDetail {
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
  charts?: PlayerChart[]
  stats?: PlayerStats | null
  updatedAt?: string
}

const LIST_OPTIONS = [
  { label: 'Open (Standard)', value: 'open' },
  { label: 'Open (Rapid)', value: 'men_rapid' },
  { label: 'Open (Blitz)', value: 'men_blitz' },
  { label: 'Women (Standard)', value: 'women' },
  { label: 'Women (Rapid)', value: 'women_rapid' },
  { label: 'Women (Blitz)', value: 'women_blitz' },
  { label: 'Juniors (Standard)', value: 'juniors' },
  { label: 'Juniors (Rapid)', value: 'juniors_rapid' },
  { label: 'Juniors (Blitz)', value: 'juniors_blitz' },
  { label: 'Girls (Standard)', value: 'girls' },
  { label: 'Girls (Rapid)', value: 'girls_rapid' },
  { label: 'Girls (Blitz)', value: 'girls_blitz' },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedList, setSelectedList] = useState('open')
  const [players, setPlayers] = useState<ListPlayer[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statsFormat, setStatsFormat] = useState<'all' | 'std' | 'rpd' | 'blz'>('all')

  const [historyStatus, setHistoryStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [statsStatus, setStatsStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [playerHistory, setPlayerHistory] = useState<PlayerChart[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [historyUpdatedAt, setHistoryUpdatedAt] = useState<string | null>(null)
  const [statsUpdatedAt, setStatsUpdatedAt] = useState<string | null>(null)

  // Load top list
  const fetchList = async (listName: string, force = false) => {
    setListLoading(true)
    setListError(null)
    try {
      const res = await fetch(`/api/list?list=${listName}${force ? '&forceUpdate=true' : ''}`)
      const data = (await res.json()) as any
      if (data.error) throw new Error(data.error)
      setPlayers(data.data || [])
      
      // Auto select first player if none is selected
      if (data.data && data.data.length > 0 && !selectedPlayerId) {
        setSelectedPlayerId(data.data[0].fideId)
      }
    } catch (err: any) {
      setListError(err.message || 'Failed to fetch list')
    } finally {
      setListLoading(false)
    }
  }

  // Load player details
  const fetchPlayerDetail = async (fideId: number, force = false) => {
    setDetailLoading(true)
    setDetailError(null)
    setHistoryStatus('loading')
    setStatsStatus('loading')
    try {
      const res = await fetch(`/api/profile?id=${fideId}${force ? '&forceUpdate=true' : ''}`)
      const data = (await res.json()) as any
      if (data.error) throw new Error(data.error)
      
      const p = data.data
      setPlayerDetail(p)
      setPlayerHistory(p.charts || [])
      setPlayerStats(p.stats || null)
      setHistoryUpdatedAt(p.chart?.updatedAt || p.updatedAt || null)
      setStatsUpdatedAt(p.stats?.updatedAt || p.updatedAt || null)
      setHistoryStatus('loaded')
      setStatsStatus('loaded')
    } catch (err: any) {
      setDetailError(err.message || 'Failed to fetch player profile')
      setHistoryStatus('error')
      setStatsStatus('error')
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    fetchList(selectedList)
  }, [selectedList])

  useEffect(() => {
    if (selectedPlayerId) {
      fetchPlayerDetail(selectedPlayerId)
    }
  }, [selectedPlayerId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const id = parseInt(searchQuery.trim(), 10)
    if (!isNaN(id)) {
      setSelectedPlayerId(id)
      setSearchQuery('')
    }
  }

  // Sort and filter chart data for SVG
  const chartData = useMemo(() => {
    if (playerHistory.length === 0) return []
    
    const monthsMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    }

    const parsePeriod = (period: string) => {
      const parts = period.split('-')
      const year = parseInt(parts[0], 10) || 2000
      const month = monthsMap[parts[1]] !== undefined ? monthsMap[parts[1]] : 0
      return new Date(year, month, 1)
    }

    return [...playerHistory]
      .sort((a, b) => parsePeriod(a.period).getTime() - parsePeriod(b.period).getTime())
  }, [playerHistory])

  // Get SVG dimensions and coordinates
  const svgParams = useMemo(() => {
    if (chartData.length === 0) return null
    const ratings = chartData.map(c => c.rating).filter((r): r is number => r !== null)
    if (ratings.length === 0) return null

    const minRating = Math.min(...ratings) - 40
    const maxRating = Math.max(...ratings) + 40
    const range = maxRating - minRating

    const width = 600
    const height = 240
    const paddingLeft = 50
    const paddingRight = 20
    const paddingTop = 20
    const paddingBottom = 40

    const graphWidth = width - paddingLeft - paddingRight
    const graphHeight = height - paddingTop - paddingBottom

    const points = chartData.map((d, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * graphWidth
      const y = paddingTop + graphHeight - (( (d.rating || minRating) - minRating) / range) * graphHeight
      return { x, y, period: d.period, rating: d.rating }
    })

    // SVG path string
    let path = ''
    if (points.length > 0) {
      path = `M ${points[0].x} ${points[0].y} `
      for (let i = 1; i < points.length; i++) {
        path += `L ${points[i].x} ${points[i].y} `
      }
    }

    // Grid lines Y values
    const gridLinesCount = 4
    const gridLines = Array.from({ length: gridLinesCount + 1 }).map((_, i) => {
      const ratingVal = Math.round(minRating + (i / gridLinesCount) * range)
      const y = paddingTop + graphHeight - (i / gridLinesCount) * graphHeight
      return { y, value: ratingVal }
    })

    return { width, height, points, path, gridLines, minRating, maxRating, paddingLeft, paddingTop, graphWidth, graphHeight }
  }, [chartData])

  // Parse Stats values
  const currentStats = useMemo(() => {
    if (!playerStats) return null
    const s = playerStats
    if (statsFormat === 'std') {
      return {
        white: { total: s.whiteTotalStd, win: s.whiteWinNumStd, draw: s.whiteDrawNumStd },
        black: { total: s.blackTotalStd, win: s.blackWinNumStd, draw: s.blackDrawNumStd }
      }
    } else if (statsFormat === 'rpd') {
      return {
        white: { total: s.whiteTotalRpd, win: s.whiteWinNumRpd, draw: s.whiteDrawNumRpd },
        black: { total: s.blackTotalRpd, win: s.blackWinNumRpd, draw: s.blackDrawNumRpd }
      }
    } else if (statsFormat === 'blz') {
      return {
        white: { total: s.whiteTotalBlz, win: s.whiteWinNumBlz, draw: s.whiteDrawNumBlz },
        black: { total: s.blackTotalBlz, win: s.blackWinNumBlz, draw: s.blackDrawNumBlz }
      }
    }
    return {
      white: { total: s.whiteTotal, win: s.whiteWinNum, draw: s.whiteDrawNum },
      black: { total: s.blackTotal, win: s.blackWinNum, draw: s.blackDrawNum }
    }
  }, [playerStats, statsFormat])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-900/20">
            {/* Chess Knight SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-zinc-950">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">FIDE Analytics</h1>
            <p className="text-xs text-zinc-500 font-medium">Scraper &amp; Statistics Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
          <nav className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
              About
            </Link>
            <Link href="/docs" className="text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
              APIs
            </Link>
          </nav>
          <form onSubmit={handleSearch} className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search FIDE ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-60 bg-zinc-900 border border-zinc-800 text-sm px-4 py-2 pl-9 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-600 text-zinc-200"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-zinc-600 absolute left-3 top-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </form>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Top Lists */}
        <section className="lg:col-span-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex flex-col overflow-hidden max-h-[calc(100vh-140px)]">
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between gap-3 bg-zinc-900/10">
            <div className="flex-1">
              <label className="text-xs font-semibold text-zinc-500 tracking-wider uppercase block mb-1">Rankings Category</label>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                disabled
                className="w-full bg-zinc-900 border border-zinc-800 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-zinc-700 text-zinc-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {LIST_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {mounted && players.length > 0 && players[0].updatedAt && (
                <span className="text-[10px] text-zinc-500 font-medium mt-1 block">
                  Last synced: {new Date(players[0].updatedAt).toLocaleString()}
                </span>
              )}
            </div>
            
            <button
              onClick={() => fetchList(selectedList, true)}
              disabled={mounted ? (listLoading ? true : undefined) : undefined}
              title="Force Update Rankings"
              className="mt-5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className={`w-4 h-4 ${listLoading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[400px]">
            {listError && (
              <div className="p-4 m-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs rounded-xl flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>{listError}</span>
              </div>
            )}

            {listLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-zinc-900/40 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-zinc-900" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3 bg-zinc-900 rounded" />
                        <div className="w-12 h-2.5 bg-zinc-900/60 rounded" />
                      </div>
                    </div>
                    <div className="w-10 h-4 bg-zinc-900 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-xs font-semibold text-zinc-500 uppercase bg-zinc-900/5 select-none">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-2">Player</th>
                    <th className="py-3 px-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => {
                    const isSelected = selectedPlayerId === p.fideId
                    return (
                      <tr
                        key={p.fideId}
                        onClick={() => setSelectedPlayerId(p.fideId)}
                        className={`border-b border-zinc-900/50 hover:bg-zinc-900/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-950/15 text-amber-100 border-l-2 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-bold text-zinc-600">
                          {p.rank}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-zinc-200">{p.name}</div>
                          <div className="text-xs text-zinc-500 font-medium">
                            {p.fed || 'N/A'} {p.bYear ? `• ${p.bYear}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold tabular-nums text-zinc-300">
                          {p.rating}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Right Side: Player Profile Details */}
        <section className="lg:col-span-7 space-y-6">
          {detailError && (
            <div className="p-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs rounded-xl flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{detailError}</span>
            </div>
          )}

          {detailLoading ? (
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-pulse">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-zinc-900 rounded" />
                  <div className="h-4 w-28 bg-zinc-900/60 rounded" />
                </div>
                <div className="h-10 w-28 bg-zinc-900 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-zinc-900 rounded-xl" />
                <div className="h-20 bg-zinc-900 rounded-xl" />
                <div className="h-20 bg-zinc-900 rounded-xl" />
              </div>
              <div className="h-40 bg-zinc-900 rounded-xl" />
            </div>
          ) : playerDetail ? (
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 space-y-6">
              
              {/* Profile Header */}
              <div className="flex items-start justify-between border-b border-zinc-900 pb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{playerDetail.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-zinc-400 font-medium">
                    {playerDetail.title && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20 font-bold uppercase tracking-wider">
                        {playerDetail.title}
                      </span>
                    )}
                    <span>Fed: <strong className="text-zinc-300">{playerDetail.federation || 'N/A'}</strong></span>
                    {playerDetail.birthYear && (
                      <>
                        <span className="text-zinc-700">•</span>
                        <span>B-Year: <strong className="text-zinc-300">{playerDetail.birthYear}</strong></span>
                      </>
                    )}
                    {playerDetail.gender && (
                      <>
                        <span className="text-zinc-700">•</span>
                        <span>Gender: <strong className="text-zinc-300">{playerDetail.gender}</strong></span>
                      </>
                    )}
                    <span className="text-zinc-700">•</span>
                    <span>ID: <strong className="text-zinc-500 tabular-nums">{playerDetail.id}</strong></span>
                    {mounted && playerDetail.updatedAt && (
                      <>
                        <span className="text-zinc-700">•</span>
                        <span className="text-amber-500/80 font-semibold">Synced: {new Date(playerDetail.updatedAt).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fetchPlayerDetail(playerDetail.id, true)}
                  disabled={mounted ? (detailLoading ? true : undefined) : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Sync Profile
                </button>
              </div>

              {/* Rating Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                    <span className="text-amber-500 font-bold text-xs">S</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Standard</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-400 tracking-tight tabular-nums">
                      {playerDetail.stdRating || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/10 flex items-center justify-center transition-colors">
                    <span className="text-cyan-500 font-bold text-xs">R</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rapid</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-cyan-400 tracking-tight tabular-nums">
                      {playerDetail.rapidRating || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-violet-500/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-colors">
                    <span className="text-violet-500 font-bold text-xs">B</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Blitz</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-violet-400 tracking-tight tabular-nums">
                      {playerDetail.blitzRating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ranks Information */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">FIDE Rankings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-900">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium">World Rank</span>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs text-zinc-600">Active</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.worldRankActive || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600">All</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.worldRankAll || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:pl-4 pt-3 sm:pt-0">
                    <span className="text-xs text-zinc-400 font-medium">National Rank ({playerDetail.federation || 'N/A'})</span>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs text-zinc-600">Active</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.nationalRankActive || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600">All</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.nationalRankAll || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:pl-4 pt-3 sm:pt-0">
                    <span className="text-xs text-zinc-400 font-medium">Continent Rank</span>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs text-zinc-600">Active</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.continentRankActive || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600">All</div>
                        <div className="text-lg font-bold text-zinc-200 tabular-nums">#{playerDetail.continentRankAll || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              {historyStatus === 'loading' ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[240px] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-zinc-700 animate-spin mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span className="text-xs text-zinc-500 font-medium">Fetching rating history from FIDE...</span>
                </div>
              ) : historyStatus === 'error' ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[240px] space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-400">Failed to Load History</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">There was an issue fetching the player's rating history.</p>
                  </div>
                  <button
                    onClick={() => fetchPlayerDetail(playerDetail.id, true)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Retry Fetching
                  </button>
                </div>
              ) : svgParams ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Rating History</h3>
                      {mounted && historyUpdatedAt && (
                        <span className="text-[10px] text-amber-500/80 font-semibold bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                          Synced: {new Date(historyUpdatedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-zinc-500 font-medium">
                        Range: {svgParams.minRating + 40} – {svgParams.maxRating - 40}
                      </div>
                      <button
                        onClick={() => fetchPlayerDetail(playerDetail.id, true)}
                        title="Force Update History"
                        className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="relative overflow-x-auto">
                    <svg viewBox={`0 0 ${svgParams.width} ${svgParams.height}`} className="w-full h-auto text-zinc-800">
                      <defs>
                        {/* Area gradient */}
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {svgParams.gridLines.map((line, idx) => (
                        <g key={idx}>
                          <line
                            x1={svgParams.paddingLeft}
                            y1={line.y}
                            x2={svgParams.width - 20}
                            y2={line.y}
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                            className="text-zinc-900"
                          />
                          <text
                            x={svgParams.paddingLeft - 10}
                            y={line.y + 4}
                            textAnchor="end"
                            fill="currentColor"
                            className="text-[10px] text-zinc-500 font-medium font-mono"
                          >
                            {line.value}
                          </text>
                        </g>
                      ))}

                      {/* Area under the line */}
                      {svgParams.points.length > 0 && (
                        <path
                          d={`${svgParams.path} L ${svgParams.points[svgParams.points.length - 1].x} ${svgParams.height - 40} L ${svgParams.points[0].x} ${svgParams.height - 40} Z`}
                          fill="url(#areaGrad)"
                        />
                      )}

                      {/* The Main Line */}
                      <path
                        d={svgParams.path}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* X axis labels (show first, middle, last to prevent overlap) */}
                      {(() => {
                        const count = svgParams.points.length
                        if (count === 0) return null
                        const indicesToShow = count <= 5 
                          ? Array.from({ length: count }).map((_, i) => i) 
                          : [0, Math.floor(count * 0.25), Math.floor(count * 0.5), Math.floor(count * 0.75), count - 1]

                        return indicesToShow.map((i) => {
                          const pt = svgParams.points[i]
                          if (!pt) return null
                          return (
                            <g key={i}>
                              <line
                                x1={pt.x}
                                y1={svgParams.height - 40}
                                x2={pt.x}
                                y2={svgParams.height - 35}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-zinc-700"
                              />
                              <text
                                x={pt.x}
                                y={svgParams.height - 18}
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-[10px] text-zinc-500 font-medium font-sans rotate-12 origin-center"
                              >
                                {pt.period}
                              </text>
                            </g>
                          )
                        })
                      })()}

                      {/* Data Point Dots on hover */}
                      {svgParams.points.map((pt, i) => (
                        <g key={i} className="group/dot cursor-pointer">
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4"
                            fill="#f59e0b"
                            className="transition-all group-hover/dot:r-6"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="8"
                            fill="transparent"
                          />
                          {/* Simple tooltips */}
                          <title>{`${pt.period}: ${pt.rating} rating`}</title>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center text-zinc-600 text-sm">
                  No progress history data available.
                </div>
              )}

              {/* Game Stats */}
              {statsStatus === 'loading' ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-zinc-700 animate-spin mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span className="text-xs text-zinc-500 font-medium">Fetching stats from FIDE...</span>
                </div>
              ) : statsStatus === 'error' ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-400">Failed to Load Stats</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">There was an issue fetching the player's game stats.</p>
                  </div>
                  <button
                    onClick={() => fetchPlayerDetail(playerDetail.id, true)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Retry Fetching
                  </button>
                </div>
              ) : currentStats ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Game Statistics</h3>
                      {mounted && statsUpdatedAt && (
                        <span className="text-[10px] text-amber-500/80 font-semibold bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                          Synced: {new Date(statsUpdatedAt).toLocaleString()}
                        </span>
                      )}
                      <button
                        onClick={() => fetchPlayerDetail(playerDetail.id, true)}
                        title="Force Update Stats"
                        className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                      {(['all', 'std', 'rpd', 'blz'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setStatsFormat(fmt)}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                            statsFormat === fmt ? 'bg-zinc-850 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* White Stats */}
                    {(() => {
                      const total = currentStats.white.total
                      const wins = currentStats.white.win
                      const draws = currentStats.white.draw
                      const losses = Math.max(0, total - (wins + draws))
                      
                      const winPct = total > 0 ? (wins / total) * 100 : 0
                      const drawPct = total > 0 ? (draws / total) * 100 : 0
                      const lossPct = total > 0 ? (losses / total) * 100 : 0

                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-zinc-400">
                            <span>Playing as White ({total} games)</span>
                            <span className="text-zinc-500 font-medium">Wins: {wins} • Draws: {draws} • Losses: {losses}</span>
                          </div>
                          {total > 0 ? (
                            <div className="h-3 rounded-full overflow-hidden flex bg-zinc-900">
                              <div style={{ width: `${winPct}%` }} className="bg-emerald-500 h-full" title={`Win: ${winPct.toFixed(1)}%`} />
                              <div style={{ width: `${drawPct}%` }} className="bg-zinc-500 h-full" title={`Draw: ${drawPct.toFixed(1)}%`} />
                              <div style={{ width: `${lossPct}%` }} className="bg-rose-500 h-full" title={`Loss: ${lossPct.toFixed(1)}%`} />
                            </div>
                          ) : (
                            <div className="text-xs text-zinc-700 italic">No games recorded.</div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Black Stats */}
                    {(() => {
                      const total = currentStats.black.total
                      const wins = currentStats.black.win
                      const draws = currentStats.black.draw
                      const losses = Math.max(0, total - (wins + draws))
                      
                      const winPct = total > 0 ? (wins / total) * 100 : 0
                      const drawPct = total > 0 ? (draws / total) * 100 : 0
                      const lossPct = total > 0 ? (losses / total) * 100 : 0

                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-zinc-400">
                            <span>Playing as Black ({total} games)</span>
                            <span className="text-zinc-500 font-medium">Wins: {wins} • Draws: {draws} • Losses: {losses}</span>
                          </div>
                          {total > 0 ? (
                            <div className="h-3 rounded-full overflow-hidden flex bg-zinc-900">
                              <div style={{ width: `${winPct}%` }} className="bg-emerald-500 h-full" title={`Win: ${winPct.toFixed(1)}%`} />
                              <div style={{ width: `${drawPct}%` }} className="bg-zinc-500 h-full" title={`Draw: ${drawPct.toFixed(1)}%`} />
                              <div style={{ width: `${lossPct}%` }} className="bg-rose-500 h-full" title={`Loss: ${lossPct.toFixed(1)}%`} />
                            </div>
                          ) : (
                            <div className="text-xs text-zinc-700 italic">No games recorded.</div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-center text-zinc-600 text-sm">
                  No stats history data available.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-zinc-900/10 border border-zinc-900 border-dashed rounded-2xl p-12 text-center text-zinc-500 flex flex-col items-center justify-center h-full min-h-[400px]">
              {/* Chess King SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-zinc-700 mb-3 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l1.05-3h3.9L15 9M9 9h6M9 9l-1 5h8l-1-5m-6 5v6m6-6v6M4 21h16" />
              </svg>
              <h3 className="font-semibold text-zinc-400">Select a Player</h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">Select any player from the top list or type in a specific FIDE ID in the search box to analyze their record.</p>
            </div>
          )}
        </section>

      </main>

      <footer className="mt-auto border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 font-medium">
        <p>© 2026 cassiofernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>
    </div>
  )
}
