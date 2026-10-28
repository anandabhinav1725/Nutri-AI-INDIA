# Nutri AI V0.1 Architecture

Status: current implementation reference
Last updated: 2026-07-20

Nutri AI V0.1 is a responsive WhatsApp-style web prototype. The goal of this version is to validate the first meal-logging loop before adding V0.2 features such as Meal Memory, a clarification engine, broader Indian food coverage, beta tools, or dashboard improvements.

## Current Scope

Implemented:

- Natural-language meal input through a web chat-style UI.
- Mock AI meal interpretation behind a provider boundary.
- Zod validation for interpreted and confirmed meal payloads.
- Hybrid nutrition strategy using a small curated Indian-food dataset plus fallback estimates.
- Inline editable meal review before confirmation.
- PostgreSQL persistence through Prisma.
- Daily nutrition totals.
- Product event capture for validation analytics.

Not implemented in V0.1:

- WhatsApp Business integration.
- Meal Memory or saved meals.
- Real AI model selection.
- Clarification engine.
- Expanded Indian food database.
- Beta tester tooling.
- Authentication beyond browser-local tester identity.

## Folder Structure

```text
prisma/
  schema.prisma
  migrations/

src/app/
  page.tsx
  layout.tsx
  styles.css
  api/

src/components/
  ChatMealLogger.tsx
  MealReview.tsx
  DailyTotals.tsx

src/domain/
  ai/
  meal/
  nutrition/

src/lib/
  api/
  validation/
  db.ts
  logger.ts
  testerIdentity.ts
  testerRepository.ts

tests/
```

## Module Responsibilities

### UI Layer

`src/components/ChatMealLogger.tsx` owns the browser interaction loop:

1. Create or read a browser-local tester ID.
2. Submit meal text for interpretation.
3. Display editable meal items.
4. Confirm the reviewed meal.
5. Refresh daily totals.

`MealReview.tsx` renders inline correction controls. `DailyTotals.tsx` renders the current daily macro summary.

### API Layer

The API routes are intentionally thin:

- `POST /api/meal/interpret`: validate input, record start event, run mock interpreter workflow, return meal review.
- `POST /api/meal/confirm`: validate confirmed review, persist meal and items, record confirmation event.
- `GET /api/totals/today`: fetch confirmed meals for the tester and calculate daily totals.
- `POST /api/events/correction`: record inline correction events.

Routes use shared response helpers and structured logging.

### Domain Layer

`src/domain/ai` defines the AI provider boundary. V0.1 uses `mockInterpreter.ts`; future real model integrations should implement the same `MealInterpreter` interface.

`src/domain/meal` owns schemas, meal review workflow, and meal persistence helpers.

`src/domain/nutrition` owns curated food data, fallback estimates, item resolution, and macro total calculation.

### Persistence Layer

Prisma is configured for PostgreSQL. The current schema contains:

- `Tester`: browser-based internal tester identity.
- `Meal`: confirmed meal and total macros.
- `MealItem`: persisted interpreted/corrected items.
- `ProductEvent`: validation analytics events.

## Request Flow

```text
Browser input
  -> POST /api/meal/interpret
  -> Zod request validation
  -> ProductEvent: meal_logging_started
  -> Mock MealInterpreter
  -> Zod interpreter-output validation
  -> Nutrition resolver
  -> ProductEvent: meal_interpretation_completed
  -> editable review returned to UI
  -> inline edits
  -> POST /api/meal/confirm
  -> Zod confirmation validation
  -> Prisma meal + meal items write
  -> ProductEvent: meal_confirmed
  -> GET /api/totals/today
  -> daily totals rendered
```

## Error Handling

API routes return safe user-facing messages and log structured developer details. Validation errors and unexpected failures currently return HTTP 400 to preserve the V0.1 API behavior. A later hardening pass can distinguish validation, database, and unexpected failures more precisely if product clients are ready for that change.

## Logging

`src/lib/logger.ts` writes JSON logs with:

- `level`
- `message`
- `timestamp`
- contextual fields
- serialized error details for failures

Info/warn logs are muted during tests to keep test output readable. Error logs remain enabled.

## Environment

Required:

```text
DATABASE_URL
```

Example:

```text
DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/nutriai?schema=public"
```

## Setup

```powershell
npm install
npx prisma migrate dev
npx prisma generate
npm test
npm run dev
```

The local app runs at:

```text
http://localhost:3000
```

## Architectural Decisions

- Keep V0.1 as a modular monolith.
- Keep AI interpretation separate from nutrition resolution.
- Keep real AI provider selection deferred until after the local slice.
- Use PostgreSQL with Prisma.
- Use browser-local tester identity for internal testing.
- Use a simple `ProductEvent` table for validation analytics.
- Do not implement V0.2 features during foundation cleanup.
