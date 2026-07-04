"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { RankingList, ListPlayer } from "@/components/RankingList"
import { PlayerProfileCard, PlayerDetail } from "@/components/PlayerProfileCard"
import { ListType } from "@/lib/enums"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedList, setSelectedList] = useState<string>(ListType.OPEN)
  const [players, setPlayers] = useState<ListPlayer[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // Load top list
  const fetchList = async (listName: string, force = false) => {
    let passwordParam = ""
    if (force && players.length > 0 && players[0].updatedAt) {
      const lastSynced = new Date(players[0].updatedAt).getTime()
      const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
      if (isRecent) {
        const pw = prompt("This list was synced less than 10 minutes ago. Please enter the sync password to force update:")
        if (pw === null) return // user cancelled
        passwordParam = `&password=${encodeURIComponent(pw)}`
      }
    }

    setListLoading(true)
    setListError(null)
    try {
      const res = await fetch(`/api/list?list=${listName}${force ? "&forceUpdate=true" : ""}${passwordParam}`)
      const data = (await res.json()) as any
      if (data.error) throw new Error(data.error)
      setPlayers(data.data || [])
      
      // Auto select first player if none is selected
      if (data.data && data.data.length > 0 && !selectedPlayerId) {
        setSelectedPlayerId(data.data[0].fideId)
      }
    } catch (err: any) {
      setListError(err.message || "Failed to fetch list")
    } finally {
      setListLoading(false)
    }
  }

  // Load player details
  const fetchPlayerDetail = async (fideId: number, force = false) => {
    let passwordParam = ""
    if (force && playerDetail && playerDetail.id === fideId && playerDetail.updatedAt) {
      const lastSynced = new Date(playerDetail.updatedAt).getTime()
      const isRecent = Date.now() - lastSynced < 10 * 60 * 1000
      if (isRecent) {
        const pw = prompt("This profile was synced less than 10 minutes ago. Please enter the sync password to force update:")
        if (pw === null) return // user cancelled
        passwordParam = `&password=${encodeURIComponent(pw)}`
      }
    }

    setDetailLoading(true)
    setDetailError(null)
    try {
      const res = await fetch(`/api/profile?id=${fideId}${force ? "&forceUpdate=true" : ""}${passwordParam}`)
      const data = (await res.json()) as any
      if (data.error) throw new Error(data.error)
      
      const p = data.data
      setPlayerDetail(p)
    } catch (err: any) {
      setDetailError(err.message || "Failed to fetch player profile")
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
            onForceSync={() => fetchList(selectedList, true)}
            selectedPlayerId={selectedPlayerId}
            setSelectedPlayerId={setSelectedPlayerId}
            mounted={mounted}
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
            onForceSync={() => selectedPlayerId && fetchPlayerDetail(selectedPlayerId, true)}
            mounted={mounted}
            showLinkToDetails={true}
          />
        </div>

      </main>

      <footer className="mt-auto border-t border-border py-6 text-center text-xs text-muted-foreground font-semibold">
        <p>© 2026 cassiofernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>
    </div>
  )
}
