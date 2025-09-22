## Ecom Store — Next.js E‑commerce Starter

A minimal e-commerce starter built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, and Prisma (PostgreSQL via Neon serverless). Includes product listing, product details with gallery, featured banners, dark mode, and a small component set based on Radix UI.

### Stack

-   Next.js 15, React 19, TypeScript
-   Tailwind CSS 4, Radix UI primitives, Lucide icons
-   Prisma 6 with Neon serverless Postgres (WebSocket adapter)

## Quick start

1. Clone and install

```bash
git clone <your-fork-or-repo-url>
cd ecomStore
npm install
```

2. Environment variables

Create `.env.local` with your database URL (see `.env.example`):

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

Neon users: copy the connection string from the Neon console; keep `sslmode=require`.

3. Database

Apply migrations and generate the Prisma client (postinstall runs `prisma generate`).

```bash
npx prisma migrate dev
```

Optional: open Prisma Studio to inspect data.

```bash
npx prisma studio
```

4. Seed sample data (products)

```bash
npx tsx db/seed.ts
```

This uses the local seed script in `db/seed.ts` and the Prisma client generated to `lib/generated/prisma`.

5. Run the app

```bash
npm run dev
```

Build and start production server:

```bash
npm run build
npm start
```

## Scripts

-   `npm run dev` — start Next.js in development
-   `npm run build` — production build
-   `npm start` — start production server
-   `npm run lint` — run ESLint
-   `postinstall` — `prisma generate` (auto-generated client to `lib/generated/prisma`)

## Project layout (high level)

-   `app/` — App Router pages (home, product details), shared layouts
-   `components/` — UI primitives and feature components (header, product list/card)
-   `db/` — Prisma client wrapper and seed utilities
-   `lib/` — utilities, server actions, constants, Prisma client output
-   `prisma/` — Prisma schema and migrations
-   `public/` — static assets and sample images
-   `types/` — shared TypeScript types

## Data model

Single `Product` model with fields like `name`, `slug`, `images[]`, `description`, `brand`, `stock`, `price`, `rating`, `numReviews`, `isFeatured`, `banner`, and timestamps. See `prisma/schema.prisma` for details.

## Environment

-   Node.js 18.18+ or 20+ recommended
-   One PostgreSQL database (Neon recommended). The project is configured to use Neon WebSockets via `@prisma/adapter-neon` and `ws`.

## Troubleshooting

-   Prisma client not found or type errors: run `npx prisma generate`.
-   Cannot connect to DB: verify `DATABASE_URL` and that `sslmode=require` is present for Neon.
-   Seeding fails about TypeScript: `npx tsx db/seed.ts` installs a one-off TS runner; ensure internet access for `npx`.

## License

Copyright © 2025 Rythem7. All rights reserved.
