# FIDE API Scraper & Viewer

A modern Next.js application designed to scrape and display top chess players' ratings and profile details from the official FIDE website, using Cloudflare Pages, Cloudflare D1 (SQLite), and Prisma ORM.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Deployment & Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1
- **ORM**: Prisma 7 (with `@prisma/adapter-d1` and `prisma.config.ts`)
- **Package Manager**: pnpm

---

## Getting Started

Follow the steps below to configure your local development environment, set up the local D1 state, and run/deploy the project.

### 1. Prerequisites
Make sure you have Node.js, `pnpm` installed, and a Cloudflare account setup.

Install dependencies:
```bash
pnpm install
```

### 2. Configure Local D1 State & Migrations
Prisma CLI in version 7+ utilizes `prisma.config.ts` to manage datasource URLs instead of loading them from `schema.prisma`. 

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
- Database access is lazily initialized via a request-scoped Proxy wrapper in `lib/prisma.ts`.
- The local server dynamically updates and hot-reloads as files change.

### Create a New Database Migration
If you make changes to `prisma/schema.prisma`:
1. Generate the SQL migration schema script:
   ```bash
   pnpm exec prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > migrations/XXXX_migration_name.sql
   ```
   *(Or diff from a baseline/previous migration/state)*
2. Apply the migration to the local D1 database:
   ```bash
   pnpm exec wrangler d1 migrations apply fide-db --local
   ```
3. Update database types:
   ```bash
   pnpm exec prisma generate
   ```

---

## Preview & Deployment

### Preview Locally (Cloudflare Worker Environment)
To build and preview the compiled application locally in a environment simulating the Cloudflare Worker runtime (`workerd`):
```bash
pnpm preview
```

### Deploy to Cloudflare
To build and deploy the application live onto Cloudflare Pages:
```bash
pnpm deploy
```

#### Production Database Migrations
To apply your migrations to the production Cloudflare D1 database:
```bash
pnpm exec wrangler d1 migrations apply fide-db --remote
```

---

## API Documentation & Endpoints

This project provides an interactive OpenAPI reference UI powered by [Scalar](https://github.com/scalar/scalar), as well as the raw OpenAPI specification.

- **Interactive API Documentation**: [/docs](http://localhost:3000/docs) (when running locally)
- **OpenAPI 3.1 JSON Specification**: [/openapi.json](http://localhost:3000/openapi.json)

### API Endpoints

All endpoints support caching and database upserts. If `forceUpdate=true` is provided, a fresh scraper request is sent to FIDE's website, and the database cache is updated.

#### 1. Get Top Player List
Retrieve the ranking list of the top 100 chess players across various categories.
- **URL**: `/api/list`
- **Method**: `GET`
- **Query Parameters**:
  - `list` (optional, default: `open`): The category list type. Available values:
    - `open` (Standard Open), `men_rapid` (Rapid Open), `men_blitz` (Blitz Open)
    - `women` (Standard Women), `women_rapid` (Rapid Women), `women_blitz` (Blitz Women)
    - `juniors` (Standard Juniors), `juniors_rapid` (Rapid Juniors), `juniors_blitz` (Blitz Juniors)
    - `girls` (Standard Girls), `girls_rapid` (Rapid Girls), `girls_blitz` (Blitz Girls)
  - `forceUpdate` (optional, default: `false`): Set to `true` to force bypass cache and scrape fresh data.
- **Example request**:
  ```bash
  curl "http://localhost:3000/api/list?list=open"
  ```

#### 2. Get Player Profile
Retrieve core profile information for a player, including federations, birth year, titles, and active ratings.
- **URL**: `/api/profile`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (required): The official FIDE ID of the player (e.g. `1503014` for Magnus Carlsen).
  - `forceUpdate` (optional, default: `false`): Set to `true` to force bypass cache and scrape fresh data.
- **Example request**:
  ```bash
  curl "http://localhost:3000/api/profile?id=1503014"
  ```

#### 3. Get Player Rating History
Retrieve the chronological rating progress chart points for the player across standard, rapid, and blitz time controls.
- **URL**: `/api/profile/history`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (required): The official FIDE ID of the player.
  - `forceUpdate` (optional, default: `false`): Set to `true` to force bypass cache and scrape fresh data.
- **Example request**:
  ```bash
  curl "http://localhost:3000/api/profile/history?id=1503014"
  ```

#### 4. Get Player Game Statistics
Retrieve win/draw/loss counts split by color (White vs. Black) and format (Standard, Rapid, Blitz).
- **URL**: `/api/profile/stats`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (required): The official FIDE ID of the player.
  - `forceUpdate` (optional, default: `false`): Set to `true` to force bypass cache and scrape fresh data.
- **Example request**:
  ```bash
  curl "http://localhost:3000/api/profile/stats?id=1503014"
  ```

