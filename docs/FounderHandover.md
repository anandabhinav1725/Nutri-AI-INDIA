# Nutri AI India: Founder Handover and Project Context

Status: canonical project context

Last verified: 2026-10-06

Audience: founders and future engineers working on Nutri AI

## How To Use This Document

This is the single starting point for a new engineer or a new Codex conversation. It records what the founders approved, what exists in the codebase, what is intentionally deferred, and what must not be assumed.

When this document conflicts with an older PRD, roadmap, meeting note, or architecture draft, this document and the explicit founder decisions recorded here take precedence. Historical documents are kept for product thinking, not as implementation instructions.

## Product In One Sentence

Nutri AI India aims to make nutrition logging for Indian meals feel as easy as sending a natural message to a helpful companion, with honest estimates and progressively less effort over time.

## The Core Product Insight

The product is not meant to be another calorie-counting app. The intended advantage is lower effort for people who eat Indian home-cooked, regional, and repeated meals. Calories and macros are outputs; reduced friction is the product.

The longer-term product promise is that Nutri AI learns useful context, such as repeated meals and corrections, so a user does not need to explain the same food repeatedly. This learning behavior is a future direction, not present V0.1 functionality.

## Founders

- Abhinav: Founder
- Jenny: Co-Founder

## Current Stage

The current product is V0.1, Slice 1: a local, responsive WhatsApp-style web prototype. It proves the narrow logging loop and is not a complete consumer nutrition platform.

The application currently runs locally against PostgreSQL. It has been verified with automated tests, TypeScript compilation, a production build, Prisma migration status, and browser/API smoke checks.

## Approved Founder Decisions

The following decisions are approved and should be treated as constraints unless the founders explicitly change them.

### Product Surface And Scope

- Build a responsive WhatsApp-style web prototype first.
- Do not begin with WhatsApp Business integration. WhatsApp remains a possible future distribution surface.
- Keep V0.1 focused on one vertical loop: meal description, AI interpretation, nutrition estimate, user review/correction, confirmation, persistence, and daily totals.
- Use inline editable meal items as the initial correction experience.
- Estimate by default. Ask a clarification only when missing information would make an estimate materially misleading.
- Describe uncertainty with simple human language such as `Estimated` and `Low confidence`; do not display artificial confidence percentages.
- Begin testing internally with the founders, then use a small private tester group.
- V0.1 success metrics are time to meal confirmation, correction rate, completion/abandonment rate, repeat usage, and qualitative tester feedback.

### Data, Identity, And Analytics

- Use a hybrid nutrition strategy: a small curated Indian-food dataset plus a clearly marked fallback estimate for unknown foods.
- Use lightweight browser-local tester identity for the initial prototype. Do not build full authentication yet.
- Use a simple `ProductEvent` database table for validation analytics.

### Technical Architecture

- Use a modular monolith, not microservices.
- Use PostgreSQL with Prisma. Do not replace PostgreSQL with SQLite.
- Maintain an AI-provider boundary with structured output and Zod validation.
- The first vertical slice must use a deterministic mock AI interpreter. Final model/provider selection is deferred.
- Deployment target is deferred until the local vertical slice works.
- The founders approved implementation of the narrow Slice 1 only. Approval of V0.1 does not automatically approve later product features.

## What Is Implemented Today

### User Experience

1. The browser creates or reuses a locally stored tester ID.
2. The user enters a meal description in a chat-style interface.
3. The app sends the description to the interpretation endpoint.
4. The mock interpreter returns structured food items.
5. The nutrition resolver calculates per-item and total macros.
6. The user can edit each food name, quantity, and unit inline.
7. The user confirms the meal.
8. The confirmed meal and items are stored in PostgreSQL.
9. The page refreshes daily totals from stored confirmed meals.

The UI does not yet support saved meals, memory, real AI interpretation, WhatsApp messages, voice, photos, goals, coaching, authentication, or deployment.

### Current Test Meal

The mock interpreter recognizes one intentional Slice 1 pattern: a message containing all of `roti`, `chana`, and `rice`.

It produces these structured items:

| Item | Default quantity | Assumption |
| --- | --- | --- |
| roti | 2 pieces | Medium homemade rotis |
| black chana sabzi | 1 serving | Quantity was not supplied |
| cooked rice | 200 g | Plain cooked white rice |

For other messages, the mock interpreter returns the original message as one unrecognized item marked `needsClarification: true`. The nutrition layer then uses a low-confidence fallback estimate. This is deliberate test-slice behavior, not an indication that general food recognition exists.

### Curated Food Dataset

The initial curated dataset is intentionally small:

| Food | Basis | Calories | Protein | Carbs | Fat | Label |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| roti | 1 piece | 110 | 3.5 g | 18 g | 3 g | Estimated |
| black chana sabzi | 1 serving | 220 | 10 g | 32 g | 6 g | Estimated |
| cooked rice | 100 g | 130 | 2.7 g | 28 g | 0.3 g | Estimated |

The approved test meal resolves to 700 calories, 22.4 g protein, 124 g carbohydrates, and 12.6 g fat before user edits.

Unknown foods use a generic fallback of 250 calories, 6 g protein, 30 g carbohydrates, and 9 g fat, labelled `Low confidence`. It exists to exercise the complete product loop, not to provide trustworthy nutrition values for arbitrary meals.

## Architecture

### Design Principle

The codebase is a modular monolith: one Next.js application with separate UI, API, domain, persistence, and shared-support responsibilities. This is the appropriate level of complexity for a founder-tested prototype.

### Repository Layout

```text
NutriAI India/
  prisma/
    schema.prisma              PostgreSQL schema
    migrations/                Prisma migration history
  src/
    app/                       Next.js pages, styles, and API routes
    components/                Chat logger, editable review, daily totals UI
    domain/
      ai/                      Interpreter interface and mock implementation
      meal/                    Schemas, types, workflow, persistence helpers
      nutrition/               Curated foods, fallback logic, macro calculation
    lib/                       Prisma client, identity, logging, API helpers, events
  tests/                       Vitest unit and API-flow tests
  docs/                        Project, product, and architecture documentation
```

### Main Modules

| Module | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Renders the initial application page |
| `src/components/ChatMealLogger.tsx` | Owns browser interaction, calls APIs, refreshes totals |
| `src/components/MealReview.tsx` | Shows editable meal items and recalculates review macros after an edit |
| `src/components/DailyTotals.tsx` | Displays confirmed meals and today's macro totals |
| `src/domain/ai/interpreter.ts` | Defines the `MealInterpreter` provider contract |
| `src/domain/ai/mockInterpreter.ts` | Deterministic Slice 1 interpreter |
| `src/domain/meal/mealWorkflow.ts` | Converts interpreted items to a nutrition-resolved review |
| `src/domain/meal/schemas.ts` | Zod request, item, and review contracts |
| `src/domain/meal/mealRepository.ts` | Writes confirmed meals and reads today's meals |
| `src/domain/nutrition/curatedFoods.ts` | Small curated food dataset |
| `src/domain/nutrition/nutritionResolver.ts` | Resolves curated foods, fallback values, and totals |
| `src/lib/testerIdentity.ts` | Creates/reads the browser-local tester ID |
| `src/lib/testerRepository.ts` | Upserts browser identities as database testers |
| `src/lib/validation/events.ts` | Defines and stores product events |
| `src/lib/logger.ts` | Produces structured JSON server logs |
| `src/lib/api/responses.ts` | Produces shared JSON responses and safe failures |

### Request And Data Flow

```text
Browser-local tester ID
  -> ChatMealLogger
  -> POST /api/meal/interpret
  -> Zod validates request
  -> ProductEvent: meal_logging_started
  -> Mock MealInterpreter
  -> Zod validates interpreted output
  -> Nutrition resolver
  -> ProductEvent: meal_interpretation_completed
  -> Editable meal review in browser
  -> POST /api/events/correction on field blur
  -> POST /api/meal/confirm
  -> Zod validates reviewed payload
  -> Prisma writes Meal and MealItem records
  -> ProductEvent: meal_confirmed
  -> GET /api/totals/today
  -> Daily totals UI
```

### API Surface

| Endpoint | Purpose |
| --- | --- |
| `POST /api/meal/interpret` | Validates meal text, records start/completion events, builds an editable review |
| `POST /api/meal/confirm` | Validates the review, persists a meal and its items, records confirmation |
| `GET /api/totals/today?testerId=...` | Returns totals across confirmed meals since local start of day |
| `POST /api/events/correction` | Stores a correction event for an edited field |

## Database

The database is PostgreSQL, accessed only through Prisma in application code.

| Table | Purpose |
| --- | --- |
| `Tester` | Maps browser-local identity to a database tester record |
| `Meal` | Stores a confirmed meal, source text, confirmation time, and aggregate macros |
| `MealItem` | Stores individual confirmed items, quantity, macros, assumptions, and uncertainty label |
| `ProductEvent` | Stores lightweight validation events and JSON metadata |

Important relationships:

- One `Tester` has many `Meal` records and many `ProductEvent` records.
- One `Meal` has many `MealItem` records.
- Meals are indexed by tester and confirmation time for daily totals.

The local database name in use is `nutriai`. Database credentials must remain in `.env` and must never be committed or copied into documentation.

## Analytics Events

Current event names:

- `meal_logging_started`
- `meal_interpretation_completed`
- `user_correction_made`
- `meal_confirmed`
- `meal_abandoned` (defined but not yet emitted)

The current implementation records input length, interpreted item count, whether any item is low confidence, correction field/item, confirmation item count, and elapsed time when the browser provides a valid start timestamp.

## Error Handling And Logging

API routes use Zod for payload validation and return safe user-facing JSON errors. Server logs use structured JSON with level, message, timestamp, context, and serialized error information.

Current limitation: validation, database, and unexpected API failures are broadly returned as HTTP 400 to preserve V0.1 behavior. This is a known foundation-hardening item, not a product feature.

## Local Development

### Requirements

- Node.js and npm
- Local PostgreSQL server
- A `nutriai` PostgreSQL database
- Environment variable `DATABASE_URL`

### Environment File

Create `.env` from `.env.example`, then replace the example value with the real local PostgreSQL credentials. Do not place a real password in `.env.example`, README files, or Git history.

```text
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nutriai?schema=public"
```

### Commands

```powershell
npm install
npx prisma migrate dev
npx prisma generate
npm test
npx tsc --noEmit
npm run build
npm run dev
```

Local URL: `http://localhost:3000`

If `npx prisma generate` reports an `EPERM` rename error on Windows, stop the local Next.js development server first. The running server can hold Prisma's Windows query-engine file open. Regenerate, then restart `npm run dev`.

## Verification Baseline

On 2026-10-06, the following passed against the current codebase:

- 12 Vitest tests passed.
- TypeScript check passed: `npx tsc --noEmit`.
- Production build passed: `npm run build`.
- Prisma migration status reported the database schema up to date.
- Prisma client generation passed after releasing the development-server file lock.
- The home page and daily-totals endpoint returned HTTP 200.

## Deferred Work: Do Not Implement Without Founder Approval

The following themes are product directions, not currently approved implementation work:

- Meal Memory and repeated-meal detection
- Saved meals and correction learning
- Clarification engine
- Real AI model/provider selection
- Broader Indian-food coverage
- Hindi/Hinglish support
- Voice-note transcription
- Photo meal logging and portion intelligence
- Dashboard expansion, goals, coaching, weekly reports, and premium capabilities
- WhatsApp Business integration
- Authentication and account management
- Beta tester administration tools
- Production deployment and operations

## Suggested Future Sequence

The previously discussed order is:

1. V0.2 Foundation Audit: improve maintainability without changing product behavior.
2. Meal Memory: make repeated meals and corrections reduce future effort.
3. Clarification Engine: ask only when ambiguity materially changes the estimate.
4. Dashboard Improvements: deepen feedback after logging is reliable.
5. Indian Food Expansion: grow the curated database from real tester inputs.
6. Beta Tools: support a larger private test group.

This sequence is guidance, not authorization. Each phase should be re-evaluated using founder and tester evidence before implementation.

## Product Reset: Current Decision State

The founders revisited the project after a break and identified an important distinction:

- V0.1 proves the technical logging loop.
- V0.1 does not yet prove that Nutri AI is compelling enough for people to return to every day.

The current implementation is not suitable for a broad 5-10 person product test. The mock interpreter recognizes only the single Slice 1 test pattern of roti, black chana sabzi, and cooked rice. Other food descriptions receive a generic low-confidence fallback. Inviting external testers before improving that would measure an incomplete prototype rather than the intended product.

### Immediate Founder Work

Before new implementation, the founders should decide the one user moment Nutri AI must own. The strongest candidate discussed is effortless repeated-meal logging:

> A user can say "usual breakfast" or "same lunch as yesterday," receive a transparent estimate, make a small correction if needed, and move on.

This is a candidate direction, not yet a newly approved feature.

### When To Recruit Private Testers

Recruit 5-10 real target users only after the product can recognize a deliberately chosen set of their normal meals. The group should be selected from people who:

- eat Indian home-cooked or regional meals regularly;
- are motivated by fitness, bulking, cutting, general health, or nutrition awareness;
- eat repeated meals during a typical week; and
- will provide honest feedback for 7-14 days.

The first group can come from the founders' personal network: gym acquaintances, college friends, family, trainers, and WhatsApp contacts interested in fitness or diet. The aim is qualitative learning, not statistical validation.

### Proposed Evidence Before A Private Test

1. Choose 15-30 foods or meals based on the actual diets of intended testers.
2. Replace the mock-only interpretation behavior with a real, structured interpreter while keeping the existing provider boundary and review-before-save flow.
3. Preserve clear assumptions and simple uncertainty labels.
4. Deploy a private testing link only after the new flow works locally.
5. Measure time to confirmation, corrections, abandonment, repeated use, failed foods, and qualitative feedback during a 7-day test.

No work in this section is authorized merely by documenting it. Founder approval is required before implementation begins.

## Product Questions To Revisit Before Building More

- What single repeated behavior should users adopt daily?
- What is the first moment where Nutri AI is clearly easier than a conventional tracker?
- Which real meals and corrections appear repeatedly during testing?
- Which estimates are trusted enough to save without a follow-up?
- How should memory be transparent, controllable, and non-intrusive?
- What proof is needed before choosing a production deployment and a real AI provider?

## Known Documentation Reconciliation

Some older documents describe a larger WhatsApp MVP with saved meals, memory, and broader food support. Those describe product ambition and historical thinking; they do not represent the implemented Slice 1.

`docs/PRD_v0.2.md` currently states that no application code exists. That statement is obsolete. V0.1 code, database migration, tests, and local runtime now exist.

`docs/Roadmap.md` uses WhatsApp-first language. The approved engineering sequence is a WhatsApp-style responsive web prototype first, followed by a decision on whether WhatsApp Business integration is warranted.

## Starter Prompt For A New Codex Or Engineer

```text
Read docs/FounderHandover.md first, then inspect the current code before proposing changes.
Nutri AI V0.1 is a responsive WhatsApp-style Indian meal logging web prototype.
Treat approved founder decisions as constraints. Do not redesign the architecture.
PostgreSQL and Prisma are required. The current interpreter is intentionally a mock.
Do not implement Meal Memory, clarification, dashboards, food expansion, beta tools,
WhatsApp integration, or other V0.2 features unless I explicitly approve them.
```
