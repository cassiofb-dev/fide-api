# FIDE API Scraper & Viewer

A modern Next.js application designed to scrape and display top chess players' ratings and profile details from the official FIDE website, using Cloudflare Pages, Cloudflare D1 (SQLite), and Drizzle ORM.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Deployment & Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
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

This project provides an interactive OpenAPI reference UI powered by [Scalar](https://github.com/scalar/scalar), as well as the raw OpenAPI specification.

- **Interactive API Documentation**: [/docs](http://localhost:3000/docs) (when running locally)
- **OpenAPI 3.1 JSON Specification**: [/openapi.json](http://localhost:3000/openapi.json)

### API Endpoints

All endpoints support caching and database upserts. If `forceUpdate=true` is provided, fresh scraper requests are sent to FIDE's website in parallel, and the database cache is updated.

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

#### 2. Get Player Profile (Consolidated)
Retrieve complete details, rating history charts, and game statistics for a player in a single request.
- **URL**: `/api/profile`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (required): The official FIDE ID of the player (e.g. `1503014` for Magnus Carlsen).
  - `forceUpdate` (optional, default: `false`): Set to `true` to force bypass cache, scrape fresh data in parallel on the server, and batch update the D1 database.
- **Example request**:
  ```bash
  curl "http://localhost:3000/api/profile?id=1503014"
  ```

#### 3. Get Player Rating History (Legacy)
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

#### 4. Get Player Game Statistics (Legacy)
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
