# Product Specification

Status: Current product specification
Product name: NutriAI India
Tagline direction: Eat Indian. Text on WhatsApp. Get instant calories and macros.

Implementation note: This document preserves product vision and requirements. The current V0.1 implementation is a responsive web prototype with a deliberately limited mock parser; it does not yet provide inbound WhatsApp messaging, saved meals, or Meal Memory. See `docs/FounderHandover.md` for the current approved scope.

## Product Promise

NutriAI India helps users understand Indian meals without the work of traditional calorie tracking.

The assistant should make meal logging feel like sending a normal WhatsApp message to a helpful nutrition buddy.

## Core Experience

### Text Meal Logging

User sends a meal:

"Breakfast: 2 aloo paratha + curd"

Assistant replies:

"Logged: Aloo Paratha (2) + Curd. Estimated: 720 kcal, 24g protein, 84g carbs, 28g fat."

The response should be fast, clear, and concise.

### Daily Summary

The assistant can summarize daily progress:

- Calories consumed vs target
- Protein consumed vs target
- Carbs consumed vs target
- Fat consumed vs target
- Practical suggestion if the user is short on a target

Example:

"You are 28g short of your protein goal. Try 4 eggs, 250ml milk, or 100g paneer."

### Saved Meals

Users can name repeated meals:

"Save this as OG Bulking Shake."

Future logging:

"OG Bulking Shake"

The assistant should log the full saved recipe without asking again.

### Corrections

The assistant should accept corrections naturally:

- "It was 1 paratha, not 2."
- "My curd was 200g."
- "Use less oil for my home sabzi."

Corrections should update the current log and inform future estimates where appropriate.

## MVP Requirements

### Functional Requirements

- Accept inbound WhatsApp text.
- Parse natural meal descriptions.
- Identify one or more food items.
- Estimate quantity using Indian serving language.
- Return calories, protein, carbs, and fat.
- Store each logged meal.
- Maintain daily totals.
- Allow users to request today's summary.
- Support saved meals.
- Support simple corrections.
- Track assumptions and estimate confidence.

### Product Requirements

- The primary path should not require a mobile app.
- Logging should complete in less than 10 seconds for common text meals.
- The assistant should ask clarification questions only when the answer materially affects the estimate.
- The assistant should prefer approximate usefulness over burdensome precision.
- The assistant should use Indian food names and Indian portion language naturally.

## Response Design Principles

Responses should be:

- Short enough for WhatsApp.
- Confidence-aware.
- Actionable.
- Friendly but not verbose.
- Focused on calories and macros first.

Avoid:

- Long nutrition lectures after every meal.
- Medical claims.
- Overconfident exact values when uncertainty is high.
- Asking multiple follow-up questions for a simple meal.

## Current Supported Input Scope

MVP input:

- English text
- Common Indian dish names
- Simple Hindi/Hinglish terms where easy to support
- Quantity phrases such as "2", "1 bowl", "1 katori", "1 plate", "half plate", "glass", and "cup"

Future input:

- Voice notes
- Hindi and Hinglish first-class support
- Food photos
- Multi-image meals
- Restaurant meals

## Food Coverage Priorities

First-priority foods:

- Common gym and student meals
- Indian breakfasts
- Homemade sabzi, dal, rice, roti, paratha, curd
- Regional dishes from early concept materials
- High-repeat meals suitable for saved meal workflows

Examples:

- Aloo paratha
- Curd
- Khichdi
- Aloo chokha
- Litti chokha
- Sattu drink
- Ghugni
- Chura dahi
- Dal pitha
- Poha
- Idli sambar
- Chole bhature

## Premium Feature Direction

Premium should add value by reducing effort and improving insight:

- Photo analysis
- Advanced reports
- Personalized meal suggestions
- Custom goals and plans
- Weekly progress insights
- AI coach

Premium should not make the free core logging loop feel broken.

## Out Of Scope For MVP

- Medical diet planning
- Diagnosis or disease treatment
- Full mobile app
- Barcode scanner
- Restaurant scanner
- Wearable integration
- Family sharing
- Community challenges
- Fully automated plate calibration

## Acceptance Criteria

The MVP is acceptable when:

- A user can log common Indian meals by WhatsApp text.
- The assistant returns plausible calories and macros.
- The assistant stores and summarizes daily totals.
- A repeated meal can be saved and reused.
- Corrections can update a meal.
- The product does not require app installation.
- The user can complete common logging in under 10 seconds.
