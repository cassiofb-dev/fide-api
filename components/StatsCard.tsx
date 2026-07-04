"use client"

import React, { useState, useMemo } from "react"

export interface PlayerStats {
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

interface StatsCardProps {
  playerId: number
  playerStats: PlayerStats | null
  statsStatus: "idle" | "loading" | "loaded" | "error"
  statsUpdatedAt: string | null
  onSyncStats: () => void
  mounted: boolean
}

export function StatsCard({
  playerId,
  playerStats,
  statsStatus,
  statsUpdatedAt,
  onSyncStats,
  mounted,
}: StatsCardProps) {
  const [statsFormat, setStatsFormat] = useState<"all" | "std" | "rpd" | "blz">("all")

  // Parse Stats values
  const currentStats = useMemo(() => {
    if (!playerStats) return null
    const s = playerStats
    if (statsFormat === "std") {
      return {
        white: { total: s.whiteTotalStd, win: s.whiteWinNumStd, draw: s.whiteDrawNumStd },
        black: { total: s.blackTotalStd, win: s.blackWinNumStd, draw: s.blackDrawNumStd },
      }
    } else if (statsFormat === "rpd") {
      return {
        white: { total: s.whiteTotalRpd, win: s.whiteWinNumRpd, draw: s.whiteDrawNumRpd },
        black: { total: s.blackTotalRpd, win: s.blackWinNumRpd, draw: s.blackDrawNumRpd },
      }
    } else if (statsFormat === "blz") {
      return {
        white: { total: s.whiteTotalBlz, win: s.whiteWinNumBlz, draw: s.whiteDrawNumBlz },
        black: { total: s.blackTotalBlz, win: s.blackWinNumBlz, draw: s.blackDrawNumBlz },
      }
    }
    return {
      white: { total: s.whiteTotal, win: s.whiteWinNum, draw: s.whiteDrawNum },
      black: { total: s.blackTotal, win: s.blackWinNum, draw: s.blackDrawNum },
    }
  }, [playerStats, statsFormat])

  if (statsStatus === "loading") {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] animate-pulse">
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
          Fetching stats from FIDE...
        </span>
      </div>
    )
  }

  if (statsStatus === "error") {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] space-y-4">
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
          <h4 className="text-sm font-bold text-destructive">Failed to Load Stats</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            There was an issue fetching the player's game stats.
          </p>
        </div>
        <button
          onClick={onSyncStats}
          disabled={!mounted}
          className="px-4 py-2 bg-muted hover:bg-muted-accent/10 border border-border text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Retry Fetching
        </button>
      </div>
    )
  }

  if (currentStats) {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-5 space-y-4">
        {/* Stats Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Game Statistics
            </h3>
            {mounted && statsUpdatedAt && (
              <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                Synced: {new Date(statsUpdatedAt).toLocaleString()}
              </span>
            )}
            <button
              onClick={onSyncStats}
              title="Force Update Stats"
              className="p-1 rounded-md bg-muted hover:bg-muted-accent/10 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-1.5 bg-muted p-1 rounded-lg border border-border text-xs">
            {(["all", "std", "rpd", "blz"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setStatsFormat(fmt)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  statsFormat === fmt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bars */}
        <div className="space-y-4 pt-2">
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
                <div className="flex justify-between text-xs font-semibold text-foreground/80">
                  <span>Playing as White ({total} games)</span>
                  <span className="text-muted-foreground font-semibold">
                    Wins: {wins} • Draws: {draws} • Losses: {losses}
                  </span>
                </div>
                {total > 0 ? (
                  <div className="h-3 rounded-full overflow-hidden flex bg-muted/50 border border-border/20">
                    <div
                      style={{ width: `${winPct}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Win: ${winPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${drawPct}%` }}
                      className="bg-zinc-500 h-full transition-all"
                      title={`Draw: ${drawPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${lossPct}%` }}
                      className="bg-rose-500 h-full transition-all"
                      title={`Loss: ${lossPct.toFixed(1)}%`}
                    />
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic pl-1">
                    No games recorded.
                  </div>
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
                <div className="flex justify-between text-xs font-semibold text-foreground/80">
                  <span>Playing as Black ({total} games)</span>
                  <span className="text-muted-foreground font-semibold">
                    Wins: {wins} • Draws: {draws} • Losses: {losses}
                  </span>
                </div>
                {total > 0 ? (
                  <div className="h-3 rounded-full overflow-hidden flex bg-muted/50 border border-border/20">
                    <div
                      style={{ width: `${winPct}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Win: ${winPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${drawPct}%` }}
                      className="bg-zinc-500 h-full transition-all"
                      title={`Draw: ${drawPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${lossPct}%` }}
                      className="bg-rose-500 h-full transition-all"
                      title={`Loss: ${lossPct.toFixed(1)}%`}
                    />
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic pl-1">
                    No games recorded.
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/45 border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px] space-y-4">
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
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
          />
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground/80">No Game Stats Available</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          No game statistics are available/synced for this player.
        </p>
      </div>
      <button
        onClick={onSyncStats}
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
        Sync Stats
      </button>
    </div>
  )
}
