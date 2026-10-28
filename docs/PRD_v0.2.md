# PRD v0.2 - Current Direction

Status: Current product direction
Source basis: Approved PRD, pain point analysis, poster direction, and current repository state
Implementation status: Historical product-direction document. V0.1 Slice 1 application code exists; this document describes future direction rather than the current implementation. See `docs/FounderHandover.md` for the current approved scope.

## Mission

Make nutrition tracking effortless for Indian users through AI.

## Vision Statement

Users should spend less than 10 seconds logging a meal.

NutriAI India should feel like a personal nutrition buddy on WhatsApp: fast, familiar, Indian-food-aware, and helpful without forcing the user into a traditional calorie-tracking workflow.

## North Star

Users do not want to track calories. Users want to spend as little time as possible understanding what they eat.

Every feature must reduce friction.

## Core Philosophy

- The AI should think more.
- The user should do less.
- AI should ask fewer questions.
- AI should learn over time.
- Never ask users for information already known.
- Prioritize speed over perfection.
- Honest estimates are better than fake precision.
- Personalization beats generic accuracy.

## Problem Statement

Indian users abandon nutrition tracking because existing tools require too much work.

Current problems:

- Existing apps focus primarily on Western foods.
- Indian cuisines and regional dishes are poorly represented.
- Portion estimation is difficult because users do not know food weights.
- Users repeatedly log the same meals.
- Food varies by household, brand, oil, milk type, paneer type, and preparation style.
- Apps ask too many questions.
- Manual search interrupts the user's natural eating routine.
- Exact-looking numbers create false trust when estimates are uncertain.
- Users must install, learn, and remember another app.

## Current Product Bet

WhatsApp is the primary product surface for validation.

The assistant should support natural text first, then voice and photo as the product matures. The first validated loop is:

1. User sends a meal in natural language.
2. AI identifies likely Indian foods and quantities.
3. AI returns calories and macros with an honest estimate.
4. Daily totals update automatically.
5. AI learns repeated meals and user preferences over time.

## Primary Users

- Gym beginners
- Gym enthusiasts
- Bulking users
- Cutting users
- College students
- Young professionals

## Secondary Users

- Diet-conscious users
- Nutrition coaches
- Families

## MVP Scope

The MVP must validate daily usage and the less-than-10-second logging promise.

Included:

- WhatsApp-first interface
- Text-based meal logging
- Indian food understanding
- Calorie, protein, carbs, and fat estimates
- Daily summary
- Basic user profile
- Saved meals
- Meal memory for repeated meals
- Quick correction flow
- Estimate confidence or ranges where appropriate

Deferred from MVP:

- Full photo recognition
- Full voice note flow
- Plate calibration
- Advanced weekly reports
- Personalized coaching plans
- Restaurant scanner
- Grocery recommendations
- Mobile app

## Key MVP User Stories

As a gym-goer, I can send "2 aloo paratha + curd" on WhatsApp and receive estimated calories and macros.

As a college student, I can save a repeated meal like "OG Bulking Shake" and log it later with one message.

As a weight-loss user, I can see today's total calories and remaining target without opening a separate app.

As a user who eats homemade food, I can correct an estimate once and expect the assistant to remember my preference later.

As a Hindi/Hinglish speaker, I should eventually be able to log meals naturally without switching to formal English.

## Trust Model

The assistant must avoid fake precision.

When uncertainty is meaningful, responses should use:

- Estimated ranges
- Confidence labels
- Quick correction options
- Clear assumptions

Example:

"Estimated: 420-480 kcal, 12-15g protein. Assumption: medium portion, moderate oil."

## Memory Model

The assistant should remember useful context only when it reduces future effort:

- Favorite meals
- Usual quantities
- Breakfast and dinner routines
- Preferred language
- Common utensils
- Household cooking preferences
- Saved recipes
- Corrections to previous estimates

Memory must be transparent enough that users can correct it.

## Product Differentiators

- Indian-first food database and regional food coverage
- WhatsApp-first behavior, not app-first behavior
- Meal memory and repeated-meal detection
- Household and kitchen profile over time
- Honest estimates instead of overconfident numbers
- AI companion behavior for daily summaries and reminders

## Success Metrics

- Meals logged per active user per day
- Percentage of meals logged in under 10 seconds
- Day 7 retention
- Day 30 retention
- Average number of user corrections per meal
- Percentage of meals logged through saved meals or memory
- Most repeated meals
- Number of Indian/regional foods successfully recognized
- User-reported trust in estimates

## Validation Plan

Validate manually before scaling automation.

Named early participants from prior planning:

- Sakhi
- Rahul
- Rounak
- Ria

Questions to answer:

- Would users use this daily?
- What frustrates them?
- Where do they stop?
- Which feature do they ask for?
- Do they trust estimates when uncertainty is explained?
- Does meal memory reduce repeated effort?

## Business Model

Free:

- Basic meal tracking
- Basic daily summaries
- Limited saved meals or limited advanced interactions

Premium:

- AI coach
- Advanced analytics
- Unlimited or expanded photo analysis
- Weekly insights
- Personalized meal suggestions
- Custom goals and plans

## Current Open Questions

- How accurate can portion estimation become without creating onboarding friction?
- How much verification should the user do before logging?
- How should meal memory be introduced without feeling intrusive?
- What is the right balance between ranges and single-number summaries?
- How should Indian regional foods be maintained and reviewed?
- Should WhatsApp remain the long-term primary platform after validation?
- How should AI inference cost influence feature sequencing?
