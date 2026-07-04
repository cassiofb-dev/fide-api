# FIDE API Scraper & Viewer

A modern Next.js application designed to scrape and display top chess players' ratings and profile details from the official FIDE website, using Cloudflare Pages, Cloudflare D1 (SQLite), and Drizzle ORM.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Deployment & Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS v4, shadcn & base-ui primitives
- **Package Manager**: pnpm

---

## Project Structure & Architecture

The application is structured into modular client-side React components and page routes:

### Core Components
- `ThemeProvider.tsx`: Handles theme context state, storage persistence, and early SSR injection.
- `ThemeSwitcher.tsx`: Stylized theme switcher placed in the header to easily swap layouts.
- `Header.tsx`: Exposes app branding, page navigation, responsive search input, and theme controllers.
- `RankingList.tsx`: Rankings categories selection, cache metadata sync, and standard ranking tables.
- `PlayerProfileCard.tsx`: Display for standard, rapid, and blitz ratings, ranks, and sync utility.
- `HistoryChart.tsx`: Ratings progress chart over time powered by Recharts.
- `StatsCard.tsx`: Game statistics split by White vs Black, support standard, rapid, blitz filters.

### Pages & Routes
- **Homepage (`/`)**: Displays the rankings category selector, player search, and the selected player's **Profile Details** (name, country, rating numbers, FIDE ranks).
- **Player Details (`/player/[id]`)**: Dynamic route displaying the player's full profile cards, their **Rating History Chart**, and their **White/Black Game Statistics**.

### Theme System
The dashboard includes support for 6 theme variants:
1. **Light Theme**: Standard clean light layout.
2. **Dark Theme**: Sleek dark interface.
3. **Catppuccin Latte**: Warm light pastel theme.
4. **Catppuccin Frappé**: Soft dark pastel variant.
5. **Catppuccin Macchiato**: Medium dark pastel variant.
6. **Catppuccin Mocha**: Deep dark pastel variant.

Themes use CSS variables dynamically mapped in `app/globals.css`, ensuring Tailwind utilities adapt immediately on theme toggles.

---

## Getting Started

### 1. Prerequisites
Make sure you have Node.js and `pnpm` installed.

Install dependencies:
```bash
pnpm install
```

### 2. Configure Local D1 State & Migrations

1. **Generate type definitions** for Cloudflare bindings:
   ```bash
   pnpm cf-typegen
   ```
2. **Apply migrations** to your local D1 database:
   ```bash
   pnpm exec wrangler d1 migrations apply fide-db --local
   ```
   *(Confirm with `y` when prompted)*

This initializes your local SQLite database structure in `.wrangler/state`.

---

## Development Workflow

### Run Development Server
Start the local Next.js development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

- The application uses `initOpenNextCloudflareForDev()` inside `next.config.ts` to expose the local D1 database bindings.
- Database access is lazily initialized via a request-scoped Proxy wrapper in `lib/db.ts`.
- The local server dynamically updates and hot-reloads as files change.

### Create a New Database Migration
To create database schema migrations:
1. Generate a new SQL migration file:
   ```bash
   pnpm exec wrangler d1 migrations create fide-db <migration_name>
   ```
2. Write your SQL statements in the newly created migration file in the `migrations/` directory.
3. Apply the migration to the local D1 database:
   ```bash
   pnpm exec wrangler d1 migrations apply fide-db --local
   ```

---

## Preview & Deployment

### Preview Locally (Cloudflare Worker Environment)
To build and preview the compiled application locally in an environment simulating the Cloudflare Worker runtime (`workerd`):
```bash
pnpm preview
```

### Deploy to Cloudflare

#### Manual Deployment
To build and deploy the application manually live onto Cloudflare Pages:
```bash
pnpm deploy
```

#### Production Database Migrations (Manual)
To apply your migrations manually to the production Cloudflare D1 database:
```bash
pnpm exec wrangler d1 migrations apply fide-db --remote
```

#### Automated Deployment (CI/CD via GitHub Actions)
This project includes a pre-configured GitHub Actions deployment workflow. Every push to the `main` branch automatically triggers a runner to:
1. Setup Node.js (v20) and pnpm (v9) with dependency caching.
2. Compile and package the Next.js application for Cloudflare using OpenNext.
3. Automatically execute any pending database migrations on the remote Cloudflare D1 instance.
4. Deploy the compiled assets and worker script to Cloudflare.

##### Required GitHub Secrets
To enable automated deployments, configure the following secrets in your repository settings (**Settings > Secrets and variables > Actions**):
- `CLOUDFLARE_API_TOKEN`: A Cloudflare API Token with permissions to edit Workers/Pages and D1 Databases.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.

---

## API Documentation & Endpoints

- **Interactive API Documentation**: [/docs](http://localhost:3000/docs) (powered by Scalar API Reference UI)
- **OpenAPI 3.1 JSON Specification**: [/openapi.json](http://localhost:3000/openapi.json)

### API Endpoints
All endpoints support database cache hits. If `forceUpdate=true` is provided, the backend scrapes fresh data from FIDE and updates D1 cache tables.

1. **Get Top Player List**: `/api/list?list=open&forceUpdate=false`
2. **Get Player Profile (Consolidated)**: `/api/profile?id={fideId}&forceUpdate=false`
3. **Get Player Rating History (Legacy)**: `/api/profile/history?id={fideId}&forceUpdate=false`
4. **Get Player Game Statistics (Legacy)**: `/api/profile/stats?id={fideId}&forceUpdate=false`
