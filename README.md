# Nutri AI

Effortless nutrition tracking for Indian meals.

Nutri AI V0.1 is a responsive, chat-style web prototype for logging a meal, reviewing an estimate, confirming it, and seeing daily nutrition totals. It is an early local baseline, built to validate the core logging loop before broader product work begins.

## Current Features

- Natural-language meal text input in a WhatsApp-style web interface.
- Structured meal interpretation through a mock AI-provider boundary.
- Inline editing of meal names, quantities, and units before confirmation.
- Calories, protein, carbohydrates, and fat estimates.
- PostgreSQL persistence for confirmed meals and items.
- Daily nutrition totals per browser-local tester identity.
- Lightweight product-event capture and structured server logging.

## Important Limitations

- Interpretation is currently a deterministic mock parser, not a real AI model.
- The curated nutrition dataset currently contains only roti, black chana sabzi, and cooked rice; unknown foods receive a generic low-confidence fallback.
- Meal Memory, a Clarification Engine, broader Indian-food support, dashboard improvements, beta tools, WhatsApp integration, deployment, and full authentication are not implemented.

## Technology

- Next.js 14 and React 18
- TypeScript
- PostgreSQL and Prisma
- Zod validation
- Vitest

## Prerequisites

- Node.js and npm
- A running PostgreSQL server
- A local PostgreSQL database named `nutriai`

## Local Setup

Install dependencies:

```powershell
npm install
```

Copy `.env.example` to `.env`, then provide local PostgreSQL credentials:

```text
DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/nutriai?schema=public"
```

Run the database migration and generate the Prisma client:

```powershell
npx prisma migrate dev
npx prisma generate
```

Start the development server:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Commands

```powershell
npm test
npx tsc --noEmit
npm run build
npx prisma migrate status
```

## Project Structure

```text
src/app/          Next.js pages, styles, and API routes
src/components/   Chat logger, meal review, and daily totals UI
src/domain/       AI, meal workflow, and nutrition logic
src/lib/          Prisma, tester identity, logging, API helpers, and events
prisma/           Database schema and migrations
tests/            Vitest tests
docs/             Product, architecture, and founder context
```

## Development Status

V0.1 is a local working prototype. It is not production-ready and is not yet suitable for broad external testing. The planned V0.2 direction begins with foundation stabilization before any Meal Memory work.

For the current founder-approved scope, start with `docs/FounderHandover.md`. Supporting technical detail is in `docs/Architecture.md` and `docs/Decisions.md`.
