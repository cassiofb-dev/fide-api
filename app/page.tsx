"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { RankingList, ListPlayer } from "@/components/RankingList"
import { PlayerProfileCard, PlayerDetail } from "@/components/PlayerProfileCard"
import { ListType } from "@/lib/enums"
import { SyncPasswordDialog } from "@/components/SyncPasswordDialog"
import { ERROR_MESSAGES } from "@/lib/errors"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedList, setSelectedList] = useState<string>(ListType.OPEN)
  const [players, setPlayers] = useState<ListPlayer[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [listAttempt, setListAttempt] = useState(1)

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [detailAttempt, setDetailAttempt] = useState(1)

  const [syncPrompt, setSyncPrompt] = useState<{
    title: string
    description: string
    onSubmit: (password: string) => void
  } | null>(null)

  // Load top list
  const fetchList = async (listName: string, force = false, password?: string) => {
    let passwordParam = ""
    if (password) {
      passwordParam = `&password=${encodeURIComponent(password)}`
    }

    setListLoading(true)
    setListError(null)

    let attempt = 1
    const maxAttempts = 4
    while (attempt <= maxAttempts) {
      setListAttempt(attempt)
      try {
        const res = await fetch(`/api/list?list=${listName}${force ? "&forceUpdate=true" : ""}${passwordParam}`)
        const data = (await res.json()) as any
        if (data.error) throw new Error(data.error)
        setPlayers(data.data || [])
        
        // Auto select first player if none is selected
        if (data.data && data.data.length > 0 && !selectedPlayerId) {
          setSelectedPlayerId(data.data[0].fideId)
        }
        break
      } catch (err: any) {
        if (attempt >= maxAttempts) {
          let friendlyMsg = err.message
          if (err.message === "FIDE_CONNECTION_ERROR") {
            friendlyMsg = ERROR_MESSAGES.UI_FIDE_CONNECTION_ERROR
          }
          setListError(friendlyMsg || "Failed to fetch list")
          break
        }
        attempt++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    setListLoading(false)
  }

  // Load player details
  const fetchPlayerDetail = async (fideId: number, force = false, password?: string) => {
    let passwordParam = ""
    if (password) {
      passwordParam = `&password=${encodeURIComponent(password)}`
    }

    setDetailLoading(true)
    setDetailError(null)

    let attempt = 1
    const maxAttempts = 4
    while (attempt <= maxAttempts) {
      setDetailAttempt(attempt)
      try {
        const res = await fetch(`/api/profile?id=${fideId}${force ? "&forceUpdate=true" : ""}${passwordParam}`)
        const data = (await res.json()) as any
        if (data.error) throw new Error(data.error)
        
        const p = data.data
        setPlayerDetail(p)
        break
      } catch (err: any) {
        if (attempt >= maxAttempts) {
          let friendlyMsg = err.message
          if (err.message === "FIDE_CONNECTION_ERROR") {
            friendlyMsg = ERROR_MESSAGES.UI_FIDE_CONNECTION_ERROR
          } else if (err.message === "PLAYER_NOT_FOUND") {
            friendlyMsg = ERROR_MESSAGES.UI_PLAYER_NOT_FOUND
          }
          setDetailError(friendlyMsg || "Failed to fetch player profile")
          break
        }
        attempt++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    setDetailLoading(false)
  }

  const handleForceSyncList = () => {
    if (players.length > 0 && players[0].updatedAt) {
      const lastSynced = new Date(players[0].updatedAt).getTime()
      const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
      if (isRecent) {
        setSyncPrompt({
          title: "Force Sync List",
          description: "This list was synced less than 10 minutes ago. Please enter the sync password to force update:",
          onSubmit: (pw) => {
            fetchList(selectedList, true, pw)
          }
        })
        return
      }
    }
    fetchList(selectedList, true)
  }

  const handleForceSyncPlayer = () => {
    if (selectedPlayerId && playerDetail && playerDetail.id === selectedPlayerId && playerDetail.updatedAt) {
      const lastSynced = new Date(playerDetail.updatedAt).getTime()
      const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
      if (isRecent) {
        setSyncPrompt({
          title: "Force Sync Profile",
          description: "This profile was synced less than 10 minutes ago. Please enter the sync password to force update:",
          onSubmit: (pw) => {
            if (selectedPlayerId) fetchPlayerDetail(selectedPlayerId, true, pw)
          }
        })
        return
      }
    }
    if (selectedPlayerId) fetchPlayerDetail(selectedPlayerId, true)
  }

  useEffect(() => {
    fetchList(selectedList)
  }, [selectedList])

  useEffect(() => {
    if (selectedPlayerId) {
      fetchPlayerDetail(selectedPlayerId)
    }
  }, [selectedPlayerId])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/30 selection:text-primary">
      {/* Header */}
      <Header onSearch={(id) => setSelectedPlayerId(id)} />

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Top Lists */}
        <div className="lg:col-span-5">
          <RankingList
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            players={players}
            listLoading={listLoading}
            listError={listError}
            onForceSync={handleForceSyncList}
            selectedPlayerId={selectedPlayerId}
            setSelectedPlayerId={setSelectedPlayerId}
            mounted={mounted}
            attempt={listAttempt}
          />
        </div>

        {/* Right Side: Player Profile Details */}
        <div className="lg:col-span-7 space-y-6">
          {detailError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{detailError}</span>
            </div>
          )}

          <PlayerProfileCard
            playerDetail={playerDetail}
            detailLoading={detailLoading}
            onForceSync={handleForceSyncPlayer}
            mounted={mounted}
            showLinkToDetails={true}
            attempt={detailAttempt}
          />
        </div>

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
