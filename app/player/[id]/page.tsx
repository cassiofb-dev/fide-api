"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/Header"
import { PlayerProfileCard, PlayerDetail } from "@/components/PlayerProfileCard"
import { HistoryChart, PlayerChart } from "@/components/HistoryChart"
import { StatsCard, PlayerStats } from "@/components/StatsCard"
import { SyncPasswordDialog } from "@/components/SyncPasswordDialog"

export default function PlayerPage() {
  const params = useParams()
  const idStr = params.id as string
  const fideId = parseInt(idStr, 10)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [detailAttempt, setDetailAttempt] = useState(1)

  const [historyStatus, setHistoryStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle")
  const [statsStatus, setStatsStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle")
  const [historyAttempt, setHistoryAttempt] = useState(1)
  const [statsAttempt, setStatsAttempt] = useState(1)

  const [playerHistory, setPlayerHistory] = useState<PlayerChart[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)

  const [historyUpdatedAt, setHistoryUpdatedAt] = useState<string | null>(null)
  const [statsUpdatedAt, setStatsUpdatedAt] = useState<string | null>(null)

  const [syncPrompt, setSyncPrompt] = useState<{
    title: string
    description: string
    onSubmit: (password: string) => void
  } | null>(null)

  const fetchPlayerDetail = async (id: number, force = false, password?: string) => {
    let passwordParam = ""
    if (password) {
      passwordParam = `&password=${encodeURIComponent(password)}`
    }

    setDetailLoading(true)
    setDetailError(null)
    setHistoryStatus("loading")
    setStatsStatus("loading")

    let attempt = 1
    const maxAttempts = 4
    while (attempt <= maxAttempts) {
      setDetailAttempt(attempt)
      setHistoryAttempt(attempt)
      setStatsAttempt(attempt)
      try {
        const res = await fetch(`/api/profile?id=${id}&full=true${force ? "&forceUpdate=true" : ""}${passwordParam}`)
        const data = (await res.json()) as any
        if (data.error) throw new Error(data.error)

        const p = data.data
        setPlayerDetail(p)
        setPlayerHistory(p.charts || [])
        setPlayerStats(p.stats || null)
        setHistoryUpdatedAt(p.chart?.updatedAt || null)
        setStatsUpdatedAt(p.stats?.updatedAt || null)
        setHistoryStatus("loaded")
        setStatsStatus("loaded")
        break
      } catch (err: any) {
        if (attempt >= maxAttempts) {
          setDetailError(err.message || "Failed to fetch player profile")
          setHistoryStatus("error")
          setStatsStatus("error")
          break
        }
        attempt++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    setDetailLoading(false)
  }

  const syncHistory = async (id: number, password?: string) => {
    let passwordParam = ""
    if (password) {
      passwordParam = `&password=${encodeURIComponent(password)}`
    }

    setHistoryStatus("loading")

    let attempt = 1
    const maxAttempts = 4
    while (attempt <= maxAttempts) {
      setHistoryAttempt(attempt)
      try {
        const res = await fetch(`/api/profile/history?id=${id}&forceUpdate=true${passwordParam}`)
        const data = (await res.json()) as any
        if (data.error) throw new Error(data.error)
        setPlayerHistory(data.data || [])
        setHistoryUpdatedAt(data.updatedAt || new Date().toISOString())
        setHistoryStatus("loaded")
        break
      } catch (err: any) {
        if (attempt >= maxAttempts) {
          setHistoryStatus("error")
          break
        }
        attempt++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  const syncStats = async (id: number, password?: string) => {
    let passwordParam = ""
    if (password) {
      passwordParam = `&password=${encodeURIComponent(password)}`
    }

    setStatsStatus("loading")

    let attempt = 1
    const maxAttempts = 4
    while (attempt <= maxAttempts) {
      setStatsAttempt(attempt)
      try {
        const res = await fetch(`/api/profile/stats?id=${id}&forceUpdate=true${passwordParam}`)
        const data = (await res.json()) as any
        if (data.error) throw new Error(data.error)
        setPlayerStats(data.data || null)
        setStatsUpdatedAt(data.updatedAt || new Date().toISOString())
        setStatsStatus("loaded")
        break
      } catch (err: any) {
        if (attempt >= maxAttempts) {
          setStatsStatus("error")
          break
        }
        attempt++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  const handleForceSyncProfile = () => {
    if (!isNaN(fideId)) {
      if (playerDetail && playerDetail.id === fideId && playerDetail.updatedAt) {
        const lastSynced = new Date(playerDetail.updatedAt).getTime()
        const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
        if (isRecent) {
          setSyncPrompt({
            title: "Force Sync Profile",
            description: "This profile was synced less than 10 minutes ago. Please enter the sync password to force update:",
            onSubmit: (pw) => fetchPlayerDetail(fideId, true, pw),
          })
          return
        }
      }
      fetchPlayerDetail(fideId, true)
    }
  }

  const handleSyncHistory = () => {
    if (!isNaN(fideId)) {
      if (historyUpdatedAt) {
        const lastSynced = new Date(historyUpdatedAt).getTime()
        const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
        if (isRecent) {
          setSyncPrompt({
            title: "Force Sync History",
            description: "This rating history was synced less than 10 minutes ago. Please enter the sync password to force update:",
            onSubmit: (pw) => syncHistory(fideId, pw),
          })
          return
        }
      }
      syncHistory(fideId)
    }
  }

  const handleSyncStats = () => {
    if (!isNaN(fideId)) {
      if (statsUpdatedAt) {
        const lastSynced = new Date(statsUpdatedAt).getTime()
        const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
        if (isRecent) {
          setSyncPrompt({
            title: "Force Sync Stats",
            description: "These stats were synced less than 10 minutes ago. Please enter the sync password to force update:",
            onSubmit: (pw) => syncStats(fideId, pw),
          })
          return
        }
      }
      syncStats(fideId)
    }
  }

  useEffect(() => {
    if (!isNaN(fideId)) {
      fetchPlayerDetail(fideId)
    }
  }, [fideId])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/30 selection:text-primary">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to rankings dashboard
          </Link>
        </div>

        {detailError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{detailError}</span>
          </div>
        )}

        {/* Profile Card */}
        <PlayerProfileCard
          playerDetail={playerDetail}
          detailLoading={detailLoading}
          onForceSync={handleForceSyncProfile}
          mounted={mounted}
          showLinkToDetails={false}
          attempt={detailAttempt}
        />

        {/* Charts and Game Stats (only if profile is loaded or loading) */}
        {!isNaN(fideId) && (playerDetail || detailLoading) && (
          <div className="grid grid-cols-1 gap-6">
            <HistoryChart
              playerId={fideId}
              playerHistory={playerHistory}
              historyStatus={historyStatus}
              historyUpdatedAt={historyUpdatedAt}
              onSyncHistory={handleSyncHistory}
              mounted={mounted}
              attempt={historyAttempt}
            />

            <StatsCard
              playerId={fideId}
              playerStats={playerStats}
              statsStatus={statsStatus}
              statsUpdatedAt={statsUpdatedAt}
              onSyncStats={handleSyncStats}
              mounted={mounted}
              attempt={statsAttempt}
            />
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-border py-6 text-center text-xs text-muted-foreground font-semibold">
        <p>© 2026 cassiofernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>

      <SyncPasswordDialog
        isOpen={syncPrompt !== null}
        onClose={() => setSyncPrompt(null)}
        title={syncPrompt?.title}
        description={syncPrompt?.description}
        onSubmit={syncPrompt?.onSubmit || (() => {})}
      />
    </div>
  )
}
