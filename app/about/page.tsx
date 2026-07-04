import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-zinc-950">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">FIDE Analytics</h1>
            <p className="text-xs text-zinc-500 font-medium">About the Project</p>
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:py-12 space-y-12">
        {/* Intro Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">System Architecture & Docs</span>
          <h2 className="text-3.5xl font-extrabold tracking-tight text-zinc-50">High-Performance Chess Scraper</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            FIDE Analytics is a modern dashboard and API designed to scrap, parse, index, and visualize rating histories, rankings, and game statistics of chess players directly from the official FIDE website.
          </p>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Features & Goals */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl space-y-3">
            <h3 className="font-semibold text-zinc-200 text-base flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              Core Features & Goals
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-zinc-300">Live Scraper Engine</strong>: Directly parses FIDE player profiles, game records, and rating logs using Cheerio.
              </li>
              <li>
                <strong className="text-zinc-300">Smart Cache Layer</strong>: Integrates database queries to store cached copies of scraper responses, bypassing heavy network loads on repeat visits.
              </li>
              <li>
                <strong className="text-zinc-300">Win-Draw-Loss statistics</strong>: Aggregates total game stats grouped by White/Black and time formats (Standard, Rapid, Blitz).
              </li>
              <li>
                <strong className="text-zinc-300">Rating History Progress Charts</strong>: Visualizes standard, rapid, and blitz ratings over historical periods inside interactive graphs.
              </li>
            </ul>
          </div>

          {/* Card 2: Technology Stack */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl space-y-3">
            <h3 className="font-semibold text-zinc-200 text-base flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Technology Stack
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-zinc-300">Framework</strong>: Next.js 16 (App Router) for high-performance React server components and dynamic API route handlers.
              </li>
              <li>
                <strong className="text-zinc-300">Database Adapter</strong>: Drizzle ORM for type-safe database querying and relational schema integrity.
              </li>
              <li>
                <strong className="text-zinc-300">HTML Scraping</strong>: Cheerio library for robust document object model traversal and reliable content extraction.
              </li>
              <li>
                <strong className="text-zinc-300">Language</strong>: TypeScript 5 for type-safe schema integrity across the codebase.
              </li>
            </ul>
          </div>

          {/* Card 3: Cloud Infrastructure */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl space-y-3">
            <h3 className="font-semibold text-zinc-200 text-base flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Cloud Infrastructure
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-zinc-300">Hosting & Runtime</strong>: Cloudflare Pages running in a modern Edge worker environment via <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">workerd</code> and OpenNext.
              </li>
              <li>
                <strong className="text-zinc-300">Database State</strong>: Cloudflare D1 SQL database storing player records, charts, game profiles, and category top lists.
              </li>
              <li>
                <strong className="text-zinc-300">Request Routing</strong>: Request-scoped database connections that connect to the local Wrangler state during development.
              </li>
            </ul>
          </div>

          {/* Card 4: OpenAPI Documentation & Source */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-zinc-200 text-base flex items-center gap-2">
              <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
              Developer Resources & Source
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We provide clean, public REST API routes for lists, profiles, statistics, and history. Check our developer tools or explore the source code.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/docs"
                className="text-center py-2 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white shadow-sm transition-all"
              >
                Scalar API Docs
              </Link>
              <Link
                href="/openapi.json"
                target="_blank"
                className="text-center py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-xs font-semibold text-zinc-300 transition-all"
              >
                OpenAPI Spec
              </Link>
              <Link
                href="https://github.com/cassiofb-dev/fide-api"
                target="_blank"
                className="text-center py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-xl text-xs font-semibold text-zinc-300 transition-all flex items-center justify-center gap-1.5"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub Repo
              </Link>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <section className="text-center pt-6 border-t border-zinc-900 text-xs text-zinc-500">
          <p>
            This system runs database migrations on cloud D1 tables on each push, ensuring schema synchronization and data persistency.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 font-medium">
        <p>© 2026 cassiofernando. Built with Next.js, Drizzle ORM &amp; Cloudflare D1.</p>
      </footer>
    </div>
  )
}
