"use client"

import React from "react"

import { ListType } from "@/lib/enums"

export interface ListPlayer {
  rank: number
  fideId: number
  name: string
  fed: string
  rating: number
  bYear: number | null
  updatedAt?: string
}

const LIST_OPTIONS = [
  { label: "Open (Standard)", value: ListType.OPEN },
  { label: "Open (Rapid)", value: ListType.MEN_RAPID },
  { label: "Open (Blitz)", value: ListType.MEN_BLITZ },
  { label: "Women (Standard)", value: ListType.WOMEN },
  { label: "Women (Rapid)", value: ListType.WOMEN_RAPID },
  { label: "Women (Blitz)", value: ListType.WOMEN_BLITZ },
  { label: "Juniors (Standard)", value: ListType.JUNIORS },
  { label: "Juniors (Rapid)", value: ListType.JUNIORS_RAPID },
  { label: "Juniors (Blitz)", value: ListType.JUNIORS_BLITZ },
  { label: "Girls (Standard)", value: ListType.GIRLS },
  { label: "Girls (Rapid)", value: ListType.GIRLS_RAPID },
  { label: "Girls (Blitz)", value: ListType.GIRLS_BLITZ },
]


interface RankingListProps {
  selectedList: string
  setSelectedList: (list: string) => void
  players: ListPlayer[]
  listLoading: boolean
  listError: string | null
  onForceSync: () => void
  selectedPlayerId: number | null
  setSelectedPlayerId: (id: number) => void
  mounted: boolean
}

export function RankingList({
  selectedList,
  setSelectedList,
  players,
  listLoading,
  listError,
  onForceSync,
  selectedPlayerId,
  setSelectedPlayerId,
  mounted,
}: RankingListProps) {
  return (
    <section className="bg-card/45 border border-border rounded-2xl flex flex-col overflow-hidden max-h-[calc(100vh-140px)]">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex-1">
          <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase block mb-1">
            Rankings Category
          </label>
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            disabled={true}
            suppressHydrationWarning
            className="w-full bg-muted border border-border text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {LIST_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
          {mounted && players.length > 0 && players[0].updatedAt && (
            <span className="text-[10px] text-muted-foreground/80 font-semibold mt-1 block">
              Last synced: {new Date(players[0].updatedAt).toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={onForceSync}
          disabled={!mounted ? true : listLoading}
          suppressHydrationWarning
          title="Force Update Rankings"
          className="mt-5 p-2 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-muted-accent/20 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="currentColor"
            className={`w-4 h-4 ${listLoading ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar List */}
      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {listError && (
          <div className="p-4 m-4 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/15 text-xs rounded-xl flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{listError}</span>
          </div>
        )}

        {listLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-2 border-b border-border/30 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-muted" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-3 bg-muted rounded" />
                    <div className="w-12 h-2.5 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="w-10 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase bg-muted/5 select-none">
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
                    className={`border-b border-border/50 hover:bg-muted/40 cursor-pointer transition-colors ${isSelected
                        ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                        : "text-foreground"
                      }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-muted-foreground/80">
                      {p.rank}
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-muted-foreground/80 font-semibold">
                        {p.fed || "N/A"} {p.bYear ? `• ${p.bYear}` : ""}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
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
  )
}
