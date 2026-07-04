"use client"

import React, { useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export interface PlayerChart {
  period: string
  rating: number | null
  games: number | null
  rapidRating: number | null
  rapidGames: number | null
  blitzRating: number | null
  blitzGames: number | null
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md text-foreground">
        <p className="text-xs font-bold text-muted-foreground mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs font-semibold">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="text-foreground font-bold font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const formatXAxisTick = (tickItem: string) => {
  const parts = tickItem.split("-")
  if (parts.length === 2) {
    const yearShort = parts[0].substring(2)
    return `${parts[1]} '${yearShort}`
  }
  return tickItem
}

interface HistoryChartProps {
  playerId: number
  playerHistory: PlayerChart[]
  historyStatus: "idle" | "loading" | "loaded" | "error"
  historyUpdatedAt: string | null
  onSyncHistory: () => void
  mounted: boolean
}

export function HistoryChart({
  playerId,
  playerHistory,
  historyStatus,
  historyUpdatedAt,
  onSyncHistory,
  mounted,
}: HistoryChartProps) {
  // Sort and filter chart data for SVG
  const chartData = useMemo(() => {
    if (playerHistory.length === 0) return []

    const monthsMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    }

    const parsePeriod = (period: string) => {
      const parts = period.split("-")
      const year = parseInt(parts[0], 10) || 2000
      const month = monthsMap[parts[1]] !== undefined ? monthsMap[parts[1]] : 0
      return new Date(year, month, 1)
    }

    return [...playerHistory].sort(
      (a, b) => parsePeriod(a.period).getTime() - parsePeriod(b.period).getTime()
    )
  }, [playerHistory])

  // Get ratings range
  const ratingRange = useMemo(() => {
    if (chartData.length === 0) return null
    const ratings = chartData
      .flatMap((c) => [c.rating, c.rapidRating, c.blitzRating])
      .filter((r): r is number => r !== null)
    if (ratings.length === 0) return null
    return {
      min: Math.min(...ratings),
      max: Math.max(...ratings),
    }
  }, [chartData])

  if (historyStatus === "loading") {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-8 h-8 text-muted-foreground/40 animate-spin mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span className="text-xs text-muted-foreground font-semibold">
          Fetching rating history from FIDE...
        </span>
      </div>
    )
  }

  if (historyStatus === "error") {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-destructive">Failed to Load History</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            There was an issue fetching the player's rating history.
          </p>
        </div>
        <button
          onClick={onSyncHistory}
          disabled={!mounted}
          className="px-4 py-2 bg-muted hover:bg-muted-accent/10 border border-border text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Retry Fetching
        </button>
      </div>
    )
  }

  if (mounted && chartData.length > 0) {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rating History
            </h3>
            {historyUpdatedAt && (
              <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                Synced: {new Date(historyUpdatedAt).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {ratingRange && (
              <div className="text-xs text-muted-foreground font-semibold">
                Range: {ratingRange.min} – {ratingRange.max}
              </div>
            )}
            <button
              onClick={onSyncHistory}
              title="Force Update History"
              className="p-1 rounded-md bg-muted hover:bg-muted-accent/10 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-72 w-full text-foreground">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/40" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={10}
                fontWeight="semibold"
                tickLine={false}
                axisLine={false}
                dy={10}
                tickFormatter={formatXAxisTick}
                minTickGap={30}
              />
              <YAxis
                domain={["dataMin - 50", "dataMax + 50"]}
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={10}
                fontWeight="semibold"
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                content={({ payload }) => (
                  <div className="flex gap-4 justify-end text-[10px] font-bold tracking-wide uppercase text-muted-foreground">
                    {payload?.map((entry: any, index: number) => {
                      // Only show legend item if there's at least one data point for that key
                      const hasData = chartData.some(
                        (d) => d[entry.dataKey as keyof typeof d] !== null
                      )
                      if (!hasData) return null
                      return (
                        <div key={index} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-0.5 rounded"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{entry.value}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              />
              <Line
                type="monotone"
                dataKey="rating"
                name="Standard"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={{ r: 2, strokeWidth: 1, fill: "var(--background)" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="rapidRating"
                name="Rapid"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 1, fill: "var(--background)" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="blitzRating"
                name="Blitz"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 1, fill: "var(--background)" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] space-y-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/60 border border-border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18M12 9V3m0 0 3 3m-3-3-3 3"
          />
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground/80">No Rating History Available</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          Rating history data has not been synchronized for this player yet.
        </p>
      </div>
      <button
        onClick={onSyncHistory}
        disabled={!mounted}
        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-zinc-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-950/20 transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Sync History
      </button>
    </div>
  )
}
