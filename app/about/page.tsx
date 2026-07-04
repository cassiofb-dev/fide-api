'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('executive-summary')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false)

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Monitor scroll to highlight current section in TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['executive-summary', 'system-architecture', 'scraping-engine', 'caching-layer', 'developer-api']
      const scrollPosition = window.scrollY + 120

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200 scroll-smooth">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-zinc-950">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">FIDE Analytics Docs</h1>
            <p className="text-xs text-zinc-500 font-medium font-mono">system_v1.0.4.sh</p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-xl transition-all flex items-center gap-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
      </header>

      {/* Hero Banner Grid Background */}
      <div className="relative w-full border-b border-zinc-900/50 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] py-12 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        <div className="relative max-w-4xl w-full mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-amber-500 tracking-widest uppercase px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            Engineering Blog &amp; Specifications
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-50 leading-tight">
            Architecting a High-Performance FIDE Scraper at the Edge
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-medium pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-zinc-950 font-bold">CF</span>
              Cassio Fernando
            </span>
            <span>•</span>
            <span>July 4, 2026</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">6 min read</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:grid lg:grid-cols-12 lg:gap-12 relative">
        {/* Table of Contents - Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-8 pr-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Table of Contents</h4>
            <nav className="flex flex-col gap-2.5 text-sm font-medium">
              {[
                { id: 'executive-summary', label: '1. Executive Summary' },
                { id: 'system-architecture', label: '2. System Architecture' },
                { id: 'scraping-engine', label: '3. Scraping Engine' },
                { id: 'caching-layer', label: '4. Caching & Edge D1' },
                { id: 'developer-api', label: '5. Developer API' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`transition-colors border-l-2 pl-3 py-0.5 ${
                    activeSection === item.id
                      ? 'text-amber-500 border-amber-500 font-semibold'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Runtime Environment
            </h4>
            <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
              <p><strong className="text-zinc-500">Platform:</strong> Cloudflare Pages</p>
              <p><strong className="text-zinc-500">Database:</strong> SQLite / D1</p>
              <p><strong className="text-zinc-500">Adapter:</strong> Drizzle ORM</p>
              <p><strong className="text-zinc-500">Parser:</strong> Cheerio v1.2</p>
            </div>
          </div>
        </aside>

        {/* Article Text Content */}
        <article className="lg:col-span-9 max-w-3xl space-y-16 text-zinc-300 leading-relaxed text-[15px] select-text">
          
          {/* Executive Summary */}
          <section id="executive-summary" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 group">
              <span className="text-amber-500 font-mono text-lg">01.</span>
              Executive Summary
            </h3>
            <p>
              Traditional sports platforms rarely offer clean API access to aggregate player metrics, rating histories, and localized statistics. For chess players, the official <strong className="text-zinc-100 font-semibold">FIDE (Fédération Internationale des Échecs)</strong> database is the source of truth, yet it lacks structured outputs for external client developers.
            </p>
            <p>
              <strong className="text-zinc-100">FIDE Analytics</strong> bridges this gap by acting as a high-performance scraping pipeline and cache orchestrator. By combining server-side DOM traversals, localized edge databases, and cache bypass options, it delivers reliable REST endpoints. The dashboard displays these statistics in a modern, lightweight interface with sub-second page loads.
            </p>

            <blockquote className="bg-zinc-900/30 border-l-2 border-amber-500 p-4 rounded-r-xl my-6">
              <p className="text-sm italic text-zinc-400">
                &ldquo;Our core engineering goal is to query FIDE profiles, compile historical progress charts, aggregate White vs. Black game performance, and store them securely at the edge without putting excessive network strain on the official FIDE servers.&rdquo;
              </p>
            </blockquote>
          </section>

          {/* System Architecture */}
          <section id="system-architecture" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-500 font-mono text-lg">02.</span>
                System Architecture
              </h3>
              <p>
                The pipeline runs entirely in Cloudflare Pages edge workers using OpenNext. When a user queries a player profile or loads standard ranking tables, the application traverses database tables in D1 first to fetch cached JSON records. If missing, it hits the target FIDE URL, scrapes the DOM tree, persists it, and pipes it back.
              </p>
            </div>

            {/* Architecture Sequence Flowchart */}
            <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-center">Data Pipeline Flow</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-xs">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="font-semibold text-zinc-200">Client UI</div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono">Browser Fetch</div>
                </div>

                <div className="flex justify-center text-zinc-600 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 animate-pulse hidden md:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="md:hidden">⬇</span>
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-yellow-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="font-semibold text-amber-500 relative z-10">Next.js Edge</div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono relative z-10">API Endpoint</div>
                </div>

                <div className="flex justify-center text-zinc-600 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 animate-pulse hidden md:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="md:hidden">⬇</span>
                </div>

                <div className="grid grid-rows-2 gap-2">
                  <div className="p-2 bg-emerald-950/20 border border-emerald-900/50 rounded-lg text-emerald-400">
                    <div className="font-semibold">Cloudflare D1</div>
                    <div className="text-[9px] font-mono">SQLite Cache</div>
                  </div>
                  <div className="p-2 bg-rose-950/20 border border-rose-900/50 rounded-lg text-rose-400">
                    <div className="font-semibold">FIDE Source</div>
                    <div className="text-[9px] font-mono">HTTP Scraping</div>
                  </div>
                </div>
              </div>
            </div>

            <p>
              By leveraging type-safe database schemas with <strong className="text-zinc-100">Drizzle ORM</strong>, the data access layer easily maps complex tables like profiles, ratings charts, and stats records onto dynamic SQL columns.
            </p>
          </section>

          {/* Scraping Engine & DOM Traversal */}
          <section id="scraping-engine" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500 font-mono text-lg">03.</span>
              The Scraping Engine
            </h3>
            <p>
              At the heart of the service is the parsing component inside <code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs font-mono">lib/scraper.ts</code>. Using the <strong className="text-zinc-100 font-semibold">Cheerio</strong> parser, the backend reads raw HTML and executes document traversals using jQuery-style selectors.
            </p>
            <p>
              Below is a simplified code section that illustrates how player lists are processed from the FIDE top list page:
            </p>

            {/* Code Snippet Box */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-zinc-900/80 border-b border-zinc-900 px-4 py-2 flex items-center justify-between text-xs text-zinc-500">
                <span className="font-mono text-zinc-400 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                  lib/scraper.ts
                </span>
                <button
                  onClick={() => handleCopy(`// Extract FIDE listing
import * as cheerio from 'cheerio'

export async function scrapeTopList(listType: string): Promise<TopListPlayer[]> {
  const url = \`https://ratings.fide.com/a_top.php?list=\${listType}\`
  const response = await fetch(url, { headers: COMMON_HEADERS })
  const html = await response.text()
  const $ = cheerio.load(html)
  const players: TopListPlayer[] = []

  $('table.top_recors_table tr').each((_, element) => {
    const rankSpan = $(element).find('.rank_span')
    if (rankSpan.length === 0) return
    const rank = parseInt(rankSpan.text().trim(), 10)
    const nameLink = $(element).find('a')
    const name = nameLink.text().trim()
    const fideId = parseInt(nameLink.attr('href')?.match(/profile\\/(\\d+)/)?.[1] || '0', 10)
    players.push({ rank, fideId, name })
  })
  return players
}`, 'scraper')}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-md hover:text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
                >
                  {copiedId === 'scraper' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-emerald-400">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto p-4 select-text">
                <code>
                  <span className="text-zinc-500">// Fetch and parse FIDE ranking list</span>{"\n"}
                  <span className="text-amber-500">import</span> * <span className="text-amber-500">as</span> cheerio <span className="text-amber-500">from</span> <span className="text-emerald-400">'cheerio'</span>{"\n"}
                  {"\n"}
                  <span className="text-amber-500">export async function</span> <span className="text-blue-400">scrapeTopList</span>(listType: <span className="text-blue-500">string</span>) {"{"}{"\n"}
                  {"  "}<span className="text-amber-500">const</span> url = <span className="text-emerald-400">`https://ratings.fide.com/a_top.php?list=$&#123;listType&#125;`</span>{"\n"}
                  {"  "}<span className="text-amber-500">const</span> response = <span className="text-amber-500">await</span> <span className="text-blue-400">fetch</span>(url, {"{"} headers: COMMON_HEADERS {"}"}){"\n"}
                  {"  "}<span className="text-amber-500">const</span> html = <span className="text-amber-500">await</span> response.<span className="text-blue-400">text</span>(){"\n"}
                  {"  "}<span className="text-amber-500">const</span> $ = cheerio.<span className="text-blue-400">load</span>(html){"\n"}
                  {"  "}<span className="text-amber-500">const</span> players = []{"\n"}
                  {"\n"}
                  {"  "}$(<span className="text-emerald-400">'table.top_recors_table tr'</span>).<span className="text-blue-400">each</span>((_, element) =&gt; {"{"}{"\n"}
                  {"    "}<span className="text-amber-500">const</span> rankSpan = $(<span className="text-blue-400">element</span>).<span className="text-blue-400">find</span>(<span className="text-emerald-400">'.rank_span'</span>){"\n"}
                  {"    "}<span className="text-amber-500">if</span> (rankSpan.length === <span className="text-amber-500">0</span>) <span className="text-amber-500">return</span>{"\n"}
                  {"    "}<span className="text-amber-500">const</span> rank = <span className="text-blue-400">parseInt</span>(rankSpan.<span className="text-blue-400">text</span>().<span className="text-blue-400">trim</span>(), <span className="text-emerald-400">10</span>){"\n"}
                  {"    "}<span className="text-amber-500">const</span> nameLink = $(<span className="text-blue-400">element</span>).<span className="text-blue-400">find</span>(<span className="text-emerald-400">'a'</span>){"\n"}
                  {"    "}<span className="text-amber-500">const</span> name = nameLink.<span className="text-blue-400">text</span>().<span className="text-blue-400">trim</span>(){"\n"}
                  {"    "}<span className="text-amber-500">const</span> fideId = <span className="text-blue-400">parseInt</span>(nameLink.<span className="text-blue-400">attr</span>(<span className="text-emerald-400">'href'</span>)?.<span className="text-blue-400">match</span>(<span className="text-emerald-400">/profile\\/(\\d+)/</span>)?.[<span className="text-emerald-400">1</span>] || <span className="text-emerald-400">'0'</span>, <span className="text-emerald-400">10</span>){"\n"}
                  {"    "}players.<span className="text-blue-400">push</span>({"{"} rank, fideId, name {"}"}){"\n"}
                  {"  "}{"}"}){"\n"}
                  {"  "}<span className="text-amber-500">return</span> players{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </section>

          {/* Caching & Edge D1 */}
          <section id="caching-layer" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500 font-mono text-lg">04.</span>
              Caching &amp; Edge D1
            </h3>
            <p>
              Scraping external assets dynamically on every HTTP request induces latency and increases the risk of being rate-limited by target hosts. FIDE Analytics implements a double-sided caching pattern:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2">
                <div className="text-xs font-bold text-amber-500 font-mono">STRATEGY 1</div>
                <h4 className="font-bold text-zinc-200">Database Persistence (D1)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every player detail sheet, win-draw-loss stats log, and historical chart table retrieved is parsed and saved permanently in the Cloudflare D1 SQL tables. If subsequent requests land within a threshold, D1 satisfies queries immediately.
                </p>
              </div>

              <div className="p-5 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-500 font-mono">STRATEGY 2</div>
                <h4 className="font-bold text-zinc-200">Forced Sync Revalidation</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  API endpoints support bypass queries, and the frontend dashboard includes a re-validate action button. This instructs the worker to bypass local cached SQL blocks, retrieve hot FIDE logs, refresh SQLite tables, and return fresh records.
                </p>
              </div>
            </div>

            <p>
              To maintain the integrity of our edge configurations, database tables execute schema migrations on Cloudflare D1 upon repository updates, guaranteeing continuous uptime.
            </p>
          </section>

          {/* Developer API */}
          <section id="developer-api" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500 font-mono text-lg">05.</span>
              Developer API
            </h3>
            <p>
              We provide clean, public REST API routes. All endpoints return structural JSON payloads, optimized for application builders and integrations.
            </p>

            <div className="space-y-4 pt-2">
              {/* Endpoint 1 */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-900 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded font-mono">GET</span>
                    <code className="text-zinc-200 font-mono font-semibold">/api/players/list?category=open</code>
                  </div>
                  <button
                    onClick={() => handleCopy('curl -X GET "https://fide-api.pages.dev/api/players/list?category=open"', 'curl1')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors font-mono flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === 'curl1' ? 'Copied!' : 'Copy curl'}
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-zinc-400">
                    Returns the FIDE Top 100 list players of a specific rating category (e.g. <code className="text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded">open</code>, <code className="text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded">women</code>, <code className="text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded">juniors</code>).
                  </p>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-900 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded font-mono">GET</span>
                    <code className="text-zinc-200 font-mono font-semibold">/api/players/{"{fideId}"}</code>
                  </div>
                  <button
                    onClick={() => handleCopy('curl -X GET "https://fide-api.pages.dev/api/players/1503014"', 'curl2')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors font-mono flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === 'curl2' ? 'Copied!' : 'Copy curl'}
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-zinc-400">
                    Returns comprehensive profile metrics, ratings, active/all-time world rankings, and historical progress coordinates of a chess player.
                  </p>
                </div>
              </div>
            </div>

            {/* Developer buttons */}
            <div className="flex flex-wrap gap-3 pt-6">
              <Link
                href="/docs"
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125H9.75M9 5.25h6.75M9 13.5h6.75" />
                </svg>
                Scalar Interactive API Docs
              </Link>
              <Link
                href="/openapi.json"
                target="_blank"
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-350 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                OpenAPI JSON Spec
              </Link>
              <Link
                href="https://github.com/cassiofb-dev/fide-api"
                target="_blank"
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-350 transition-all flex items-center gap-2"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub Repository
              </Link>
            </div>
          </section>

          {/* Feedback Form / Micro-interaction */}
          <section className="pt-12 border-t border-zinc-900 space-y-4">
            <div className="p-6 bg-zinc-900/10 border border-zinc-900/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-zinc-200 text-sm">Was this documentation post helpful?</h4>
                <p className="text-xs text-zinc-500 mt-1">We rely on community inputs to refine architectural articles.</p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                {feedbackSubmitted ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 py-1 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    Thanks for your feedback!
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => setFeedbackSubmitted(true)}
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:text-zinc-100 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Yes, very
                    </button>
                    <button
                      onClick={() => setFeedbackSubmitted(true)}
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:text-zinc-100 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      No, unclear
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-650 font-medium bg-zinc-950 mt-12">
        <p>© 2026 Cassio Fernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>
    </div>
  )
}
