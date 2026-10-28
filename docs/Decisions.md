# Decisions

Status: living decision log
Last updated: 2026-07-20

## Current Implementation Decisions

### D-001: V0.1 uses a responsive web prototype first

Decision: Build and validate the first meal-logging loop through a responsive WhatsApp-style web app.

Reasoning:

- Faster to build and iterate than WhatsApp Business integration.
- Easier to debug locally.
- Avoids provider and webhook complexity before the product loop is proven.

Implication:

- WhatsApp remains a possible future channel, not the current implementation surface.

### D-002: Use a modular monolith

Decision: Keep UI, API routes, domain logic, AI interpretation, nutrition resolution, and persistence in one Next.js codebase with clear boundaries.

Reasoning:

- V0.1 is an experiment, not scale infrastructure.
- A modular monolith is easier to understand and change.

Implication:

- No microservices, queue infrastructure, or event-driven architecture until there is a concrete need.

### D-003: Mock AI interpreter for Slice 1

Decision: Keep a provider boundary but use a deterministic mock interpreter for the first vertical slice.

Reasoning:

- Validates the product workflow without coupling early UX work to model selection.
- Makes tests deterministic.

Implication:

- Real model selection is deferred.
- Future AI providers must implement the existing `MealInterpreter` interface.

### D-004: Separate AI interpretation from nutrition resolution

Decision: AI interpretation returns structured meal items; the nutrition layer owns macro resolution.

Reasoning:

- Prevents one large AI prompt from owning the whole application.
- Keeps nutrition data and estimation logic testable.

Implication:

- Curated food data, fallback estimates, and macro calculations live in `src/domain/nutrition`.

### D-005: Use PostgreSQL and Prisma

Decision: Store tester identity, meals, meal items, and product events in PostgreSQL through Prisma.

Reasoning:

- Relational queries fit meals, meal items, and daily totals.
- Prisma gives migrations and type-safe access.

Implication:

- Do not replace PostgreSQL with SQLite for V0.1/V0.2 local development.

### D-006: Use browser-local tester identity

Decision: Use a browser-local tester ID for internal prototype testing.

Reasoning:

- Full authentication is unnecessary for early founder/internal testing.
- It keeps the meal logging path fast.

Implication:

- This is not production authentication.

### D-007: Capture validation analytics in `ProductEvent`

Decision: Store lightweight product events in the database.

Reasoning:

- V0.1 success depends on time to confirmation, corrections, completion, repeat usage, and tester feedback.
- A table is enough for the current test group.

Implication:

- No analytics platform is required yet.

## Future Decisions Not Yet Approved For Implementation

- WhatsApp provider selection.
- Meal Memory data model and UX.
- Real AI model/provider selection.
- Clarification engine thresholds.
- Expanded Indian food data sourcing and review process.
- Beta tester admin tools.
- Production authentication.
- Deployment target.
