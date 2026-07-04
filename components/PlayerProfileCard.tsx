"use client"

import React from "react"
import Link from "next/link"

export interface PlayerDetail {
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
  updatedAt?: string
}

interface PlayerProfileCardProps {
  playerDetail: PlayerDetail | null
  detailLoading: boolean
  onForceSync: () => void
  mounted: boolean
  showLinkToDetails?: boolean
}

export function PlayerProfileCard({
  playerDetail,
  detailLoading,
  onForceSync,
  mounted,
  showLinkToDetails = false,
}: PlayerProfileCardProps) {
  if (detailLoading) {
    return (
      <div className="bg-card/45 border border-border rounded-2xl p-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-28 bg-muted/60 rounded" />
          </div>
          <div className="h-10 w-28 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    )
  }

  if (!playerDetail) {
    return (
      <div className="bg-card/10 border border-border border-dashed rounded-2xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[400px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-12 h-12 text-muted-foreground/40 mb-3 animate-pulse"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 9l1.05-3h3.9L15 9M9 9h6M9 9l-1 5h8l-1-5m-6 5v6m6-6v6M4 21h16"
          />
        </svg>
        <h3 className="font-semibold text-foreground/80">Select a Player</h3>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs mx-auto">
          Select any player from the top list or type in a specific FIDE ID in the search box to analyze their record.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card/45 border border-border rounded-2xl p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{playerDetail.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-muted-foreground">
            {playerDetail.title && (
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                {playerDetail.title}
              </span>
            )}
            <span>
              Fed: <strong className="text-foreground/80">{playerDetail.federation || "N/A"}</strong>
            </span>
            {playerDetail.birthYear && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>
                  B-Year: <strong className="text-foreground/80">{playerDetail.birthYear}</strong>
                </span>
              </>
            )}
            {playerDetail.gender && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>
                  Gender: <strong className="text-foreground/80">{playerDetail.gender}</strong>
                </span>
              </>
            )}
            <span className="text-muted-foreground/40">•</span>
            <span>
              ID: <strong className="text-foreground/50 tabular-nums">{playerDetail.id}</strong>
            </span>
            {mounted && playerDetail.updatedAt && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-primary font-semibold">
                  Synced: {new Date(playerDetail.updatedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onForceSync}
          disabled={!mounted}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted-accent/10 border border-border text-xs text-foreground font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="currentColor"
            className="w-3.5 h-3.5 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Sync Profile
        </button>
      </div>

      {/* Rating Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-chart-1/10 flex items-center justify-center">
            <span className="text-chart-1 font-bold text-xs">S</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Standard</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-chart-1 tracking-tight tabular-nums">
              {playerDetail.stdRating || "N/A"}
            </span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-chart-2/10 flex items-center justify-center">
            <span className="text-chart-2 font-bold text-xs">R</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rapid</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-chart-2 tracking-tight tabular-nums">
              {playerDetail.rapidRating || "N/A"}
            </span>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col justify-between gap-1.5 relative overflow-hidden group">
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-chart-3/10 flex items-center justify-center">
            <span className="text-chart-3 font-bold text-xs">B</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Blitz</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-chart-3 tracking-tight tabular-nums">
              {playerDetail.blitzRating || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Ranks Information */}
      <div className="bg-muted/20 border border-border rounded-2xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">FIDE Rankings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-semibold">World Rank</span>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">Active</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.worldRankActive || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">All</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.worldRankAll || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:pl-4 pt-3 sm:pt-0">
            <span className="text-xs text-muted-foreground font-semibold">
              National Rank ({playerDetail.federation || "N/A"})
            </span>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">Active</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.nationalRankActive || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">All</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.nationalRankAll || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:pl-4 pt-3 sm:pt-0">
            <span className="text-xs text-muted-foreground font-semibold">Continent Rank</span>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">Active</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.continentRankActive || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase">All</div>
                <div className="text-lg font-bold tabular-nums">
                  #{playerDetail.continentRankAll || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Analytics Detail Button/Link */}
      {showLinkToDetails && (
        <div className="pt-2">
          <Link
            href={`/player/${playerDetail.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-950/20 transition-all text-sm cursor-pointer"
          >
            <span>View Full Analytics, Charts & Game Stats</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
