"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeSwitcher } from "./ThemeSwitcher"

interface HeaderProps {
  initialSearchQuery?: string
  onSearch?: (id: number) => void
}

export function Header({ initialSearchQuery = "", onSearch }: HeaderProps) {
  const [query, setQuery] = useState(initialSearchQuery)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedId = parseInt(query.trim(), 10)
    if (!isNaN(parsedId)) {
      if (onSearch) {
        onSearch(parsedId)
      } else {
        router.push(`/player/${parsedId}`)
      }
      setQuery("")
    }
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-950/20 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-zinc-950">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">FIDE Analytics</h1>
            <p className="text-xs text-muted-foreground font-medium">Scraper &amp; Statistics Engine</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end flex-wrap">
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/docs" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            API Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSubmit} className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search FIDE ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-48 bg-muted border border-border text-sm px-4 py-2 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60 text-foreground"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-muted-foreground/60 absolute left-3 top-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </form>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
