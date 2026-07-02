# FIDE API Scraper & Analytics Dashboard

A premium web application and scraper that fetches, caches, and visualizes chess player profiles, rating history, and match statistics directly from the official FIDE website. Built with Next.js, Prisma, and Cloudflare D1.

## Features

- **Rankings Cache & Viewer**: Browse FIDE Top 100 lists for multiple formats (Standard, Rapid, Blitz) across divisions (Open, Women, Juniors, Girls) with automatic SQLite/D1 database caching.
- **Player Lookup**: Query any player directly by FIDE ID (e.g. `1503014` for GM Magnus Carlsen) to retrieve and cache their profile.
- **Rating History Chart**: Interactive, animated custom SVG area charts mapping the player's historical standard, rapid, and blitz ratings over time.
- **Game Statistics Visualizer**: Visually inspect the player's win/draw/loss distribution for playing with White and Black pieces.
- **Real-Time Database Sync**: Force-refresh rankings and profile statistics directly from the live FIDE website.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (vanilla aesthetic modern dark design)
- **Database**: Cloudflare D1 (with local SQLite fallback for development)
- **ORM**: Prisma 7 (using modern pluggable Driver Adapters: `@prisma/adapter-better-sqlite3` and `@prisma/adapter-d1`)
- **Scraper**: Cheerio (for robust DOM parsing and scraping)

---

## Getting Started

### 1. Install Dependencies

Install project workspace dependencies using `pnpm`:

```bash
pnpm install
```

### 2. Database Synchronization

Prisma 7 connection URLs are configured inside `prisma.config.ts`. Set up the local SQLite database file (`dev.db`) and synchronize your database schema:

```bash
npx prisma db push
```

### 3. Run Development Server

Launch the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) on your browser to view the dashboard.

---

## Cloudflare Pages & D1 Deployment

This project is configured to run on Cloudflare Pages using Cloudflare D1 as the production database.

### 1. Create a D1 Database
Create your remote D1 database using Wrangler:
```bash
npx wrangler d1 create fide-db
```
Copy the `database_id` from the output and update it in your [wrangler.json](file:///home/cassio/Documents/Code/fide-api/wrangler.json).

### 2. Initialize Database Schema
Generate the SQL schema script from your Prisma schema:
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql
```
Apply the migration schema to your remote D1 database:
```bash
npx wrangler d1 execute fide-db --remote --file=./migration.sql
```

### 3. Build & Deploy
Compile and deploy the application to Cloudflare Pages:
```bash
npx @cloudflare/next-on-pages
npx wrangler pages deploy .open-next
```

---

## License

MIT License • Copyright (c) 2026 cassiofernando

