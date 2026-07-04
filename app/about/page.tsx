"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("executive-summary")
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
      const sections = [
        "executive-summary",
        "system-architecture",
        "scraping-engine",
        "caching-layer",
        "theme-system",
        "developer-api",
      ]
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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/30 selection:text-primary scroll-smooth">
      {/* Shared Header */}
      <Header />

      {/* Hero Banner Grid Background */}
      <div className="relative w-full border-b border-border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] py-12 md:py-16 px-6 overflow-hidden bg-muted/10">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="relative max-w-4xl w-full mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            Engineering Blog &amp; Specifications
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Refactoring UI &amp; Architecting a Modular Edge-Enabled FIDE Dashboard
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                CF
              </span>
              Cassio Fernando
            </span>
            <span>•</span>
            <span>July 4, 2026</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-muted border border-border rounded-md">8 min read</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:grid lg:grid-cols-12 lg:gap-12 relative">
        {/* Table of Contents - Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-8 pr-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Table of Contents</h4>
            <nav className="flex flex-col gap-2.5 text-sm font-semibold">
              {[
                { id: "executive-summary", label: "1. Executive Summary" },
                { id: "system-architecture", label: "2. Modular Architecture" },
                { id: "scraping-engine", label: "3. Scraping Engine" },
                { id: "caching-layer", label: "4. Caching & Edge D1" },
                { id: "theme-system", label: "5. Multi-Theme System" },
                { id: "developer-api", label: "6. Developer API" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`transition-colors border-l-2 pl-3 py-0.5 ${
                    activeSection === item.id
                      ? "text-primary border-primary font-bold"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Runtime Environment
            </h4>
            <div className="text-[11px] text-muted-foreground space-y-1 font-mono font-semibold">
              <p>
                <strong className="text-foreground/75">Platform:</strong> Cloudflare Pages
              </p>
              <p>
                <strong className="text-foreground/75">Database:</strong> SQLite / D1
              </p>
              <p>
                <strong className="text-foreground/75">Parser:</strong> Cheerio v1.2
              </p>
              <p>
                <strong className="text-foreground/75">Adapter:</strong> Drizzle ORM
              </p>
              <p>
                <strong className="text-foreground/75">UI Components:</strong> shadcn &amp; base-ui
              </p>
            </div>
          </div>
        </aside>

        {/* Article Text Content */}
        <article className="lg:col-span-9 max-w-3xl space-y-16 text-foreground/80 leading-relaxed text-[15px] select-text">
          
          {/* Executive Summary */}
          <section id="executive-summary" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg">01.</span>
              Executive Summary
            </h3>
            <p>
              Traditional chess dashboards render analytics in heavy monolithic pages that degrade client performance and increase DOM size. The official FIDE rating database serves as the source of truth, yet lacks clean structural endpoints for developers.
            </p>
            <p>
              <strong className="text-foreground font-bold">FIDE Analytics</strong> resolves this by acting as a high-performance scraping pipeline, edge database cache, and modular React interface. In our latest refactor, we split the application into decoupled client-side components and isolated complex widgets (rating history charts and game statistics) onto dedicated player pages.
            </p>
            <blockquote className="bg-muted/30 border-l-2 border-primary p-4 rounded-r-xl my-6">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;Our core engineering goal is to query FIDE profiles, compile historical progress charts, aggregate White vs. Black game performance, and store them securely at the edge. Moving history and statistics to dynamic player routes reduces initial bundle size and provides a focused analytical environment.&rdquo;
              </p>
            </blockquote>
          </section>

          {/* System Architecture */}
          <section id="system-architecture" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary font-mono text-lg">02.</span>
                Modular System Architecture
              </h3>
              <p>
                By refactoring our codebase to use <strong className="text-foreground">shadcn</strong> with <strong className="text-foreground">base-ui</strong> primitives, we replaced a 1000-line monolithic file with clean, reusable components:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-1.5">
                <h4 className="font-bold text-foreground text-sm">Dashboard Components</h4>
                <p className="text-xs text-muted-foreground">
                  The homepage dashboard houses the <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">RankingList</code> component for sorting standard categories and the <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">PlayerProfileCard</code> displaying core statistics and links.
                </p>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-1.5">
                <h4 className="font-bold text-foreground text-sm">Dynamic Player Route</h4>
                <p className="text-xs text-muted-foreground">
                  Opening `/player/[id]` renders the selected player profile card along with <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">HistoryChart</code> (Recharts ratings progress) and <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">StatsCard</code> (White/Black win percentages).
                </p>
              </div>
            </div>

            <p>
              This modular architecture allows components to fetch their own revalidated cache segments dynamically on Cloudflare Pages workers using OpenNext.
            </p>
          </section>

          {/* Scraping Engine */}
          <section id="scraping-engine" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg">03.</span>
              The Scraping Engine
            </h3>
            <p>
              At the heart of the service is the parsing component inside <code className="bg-muted border border-border px-1.5 py-0.5 rounded text-foreground text-xs font-mono font-semibold">lib/scraper.ts</code>. Using the <strong className="text-foreground font-bold">Cheerio</strong> parser, the backend reads raw HTML and executes document traversals using jQuery-style selectors.
            </p>

            {/* Code Snippet Box */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
              <div className="bg-muted/65 border-b border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-foreground/80 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-muted-foreground">
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
}`, "scraper")}
                  className="px-2.5 py-1 bg-background border border-border rounded-md hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                >
                  {copiedId === "scraper" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-xs font-mono text-foreground/80 leading-relaxed overflow-x-auto p-4 select-text bg-muted/10 border border-border/40 rounded-xl">
                <code>
{`// Fetch and parse FIDE ranking list
import * as cheerio from 'cheerio'

export async function scrapeTopList(listType: string) {
  const url = \`https://ratings.fide.com/a_top.php?list=\${listType}\`
  const response = await fetch(url, { headers: COMMON_HEADERS })
  const html = await response.text()
  const $ = cheerio.load(html)
  const players = []

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
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* Caching & Edge D1 */}
          <section id="caching-layer" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg">04.</span>
              Caching &amp; Edge D1
            </h3>
            <p>
              Scraping external assets dynamically on every HTTP request induces latency and increases the risk of being rate-limited by target hosts. FIDE Analytics implements a double-sided caching pattern:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-5 bg-muted/20 border border-border rounded-xl space-y-2">
                <div className="text-xs font-bold text-primary font-mono">STRATEGY 1</div>
                <h4 className="font-bold text-foreground">Database Persistence (D1)</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every player detail sheet, win-draw-loss stats log, and historical chart table retrieved is parsed and saved permanently in the Cloudflare D1 SQL tables. If subsequent requests land within a threshold, D1 satisfies queries immediately.
                </p>
              </div>

              <div className="p-5 bg-muted/20 border border-border rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-500 font-mono">STRATEGY 2</div>
                <h4 className="font-bold text-foreground">Forced Sync Revalidation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  API endpoints support bypass queries, and the frontend dashboard includes a re-validate action button. This instructs the worker to bypass local cached SQL blocks, retrieve hot FIDE logs, refresh SQLite tables, and return fresh records.
                </p>
              </div>
            </div>
          </section>

          {/* Theme System */}
          <section id="theme-system" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg">05.</span>
              Multi-Theme Architecture
            </h3>
            <p>
              To offer superior customizability, the UI integrates a theme provider supporting 6 color variants: **Light**, **Dark**, and the four **Catppuccin** variants (**Latte**, **Frappé**, **Macchiato**, **Mocha**).
            </p>
            <p>
              Instead of using standard client-only hooks that trigger style re-renders, the provider integrates an inline SSR hydration script in the HTML head tag that reads from localStorage and immediately injects the active class into `document.documentElement` during initial render.
            </p>
            <p>
              Tailwind CSS v4 custom variables map these theme colors to semantic utilities (like `bg-card`, `text-foreground`, `border-border`, and `stroke-chart-1`), keeping our CSS stylesheet compact and performant.
            </p>
          </section>

          {/* Developer API */}
          <section id="developer-api" className="scroll-mt-24 space-y-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary font-mono text-lg">06.</span>
              Developer API
            </h3>
            <p>
              We provide clean, public REST API routes. All endpoints return structural JSON payloads, optimized for application builders and integrations.
            </p>

            <div className="space-y-4 pt-2">
              {/* Endpoint 1 */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-muted/65 border-b border-border flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold rounded font-mono">GET</span>
                    <code className="text-foreground font-mono font-bold">/api/list?list=open</code>
                  </div>
                  <button
                    onClick={() => handleCopy('curl -X GET "https://fide-api.pages.dev/api/list?list=open"', "curl1")}
                    className="text-muted-foreground hover:text-foreground transition-colors font-mono flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedId === "curl1" ? "Copied!" : "Copy curl"}
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Returns the FIDE Top 100 list players of a specific rating category (e.g. <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono font-semibold">open</code>, <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono font-semibold">women</code>, <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono font-semibold">juniors</code>).
                  </p>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-muted/65 border-b border-border flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold rounded font-mono">GET</span>
                    <code className="text-foreground font-mono font-bold">/api/profile?id=1503014</code>
                  </div>
                  <button
                    onClick={() => handleCopy('curl -X GET "https://fide-api.pages.dev/api/profile?id=1503014"', "curl2")}
                    className="text-muted-foreground hover:text-foreground transition-colors font-mono flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedId === "curl2" ? "Copied!" : "Copy curl"}
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Returns comprehensive profile metrics, ratings, active/all-time world rankings, and historical progress coordinates of a chess player in a single consolidated response.
                  </p>
                </div>
              </div>
            </div>

            {/* Developer buttons */}
            <div className="flex flex-wrap gap-3 pt-6">
              <Link
                href="/docs"
                className="py-2.5 px-4 bg-primary hover:opacity-90 rounded-xl text-xs font-bold text-primary-foreground shadow-sm transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125H9.75M9 5.25h6.75M9 13.5h6.75" />
                </svg>
                Scalar Interactive API Docs
              </Link>
              <Link
                href="/openapi.json"
                target="_blank"
                className="py-2.5 px-4 bg-muted hover:bg-muted-accent/10 border border-border rounded-xl text-xs font-bold text-foreground transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                OpenAPI JSON Spec
              </Link>
              <Link
                href="https://github.com/cassiofb-dev/fide-api"
                target="_blank"
                className="py-2.5 px-4 bg-muted hover:bg-muted-accent/10 border border-border rounded-xl text-xs font-bold text-foreground transition-all flex items-center gap-2"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-muted-foreground" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub Repository
              </Link>
            </div>
          </section>

          {/* Feedback Form */}
          <section className="pt-12 border-t border-border space-y-4">
            <div className="p-6 bg-muted/10 border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground text-sm">Was this documentation post helpful?</h4>
                <p className="text-xs text-muted-foreground mt-1">We rely on community inputs to refine architectural articles.</p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                {feedbackSubmitted ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    Thanks for your feedback!
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => setFeedbackSubmitted(true)}
                      className="px-4 py-1.5 bg-muted hover:bg-muted-accent/15 border border-border hover:text-foreground rounded-xl text-xs font-bold transition-all cursor-pointer text-foreground"
                    >
                      Yes, very
                    </button>
                    <button
                      onClick={() => setFeedbackSubmitted(true)}
                      className="px-4 py-1.5 bg-muted hover:bg-muted-accent/15 border border-border hover:text-foreground rounded-xl text-xs font-bold transition-all cursor-pointer text-foreground"
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
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-semibold bg-muted/10 mt-12">
        <p>© 2026 Cassio Fernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>
    </div>
  )
}
