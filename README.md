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
