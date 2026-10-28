# Meeting Notes

Status: Consolidated notes from source planning documents
Purpose: Preserve founder/product thinking, validation questions, and open threads.

## Source Notes

These notes consolidate the provided concept document, PRD, pain point analysis, PDF export, and poster direction.

## Core Founder Insight

"We are not building an AI calorie tracker. We are building the easiest way for Indians to understand what they eat."

Key interpretation:

- Calories are the output.
- Reducing friction is the product.
- Indian food understanding is the wedge.
- WhatsApp is the behavior layer.

## Product Principles Captured

- Every feature must reduce friction.
- Never ask twice.
- Remember everything that helps.
- Personalization beats perfection.
- Honest estimates beat fake accuracy.
- Users do not want calorie tracking.
- Users want effortless nutrition tracking.
- Validate before building.
- Build before scaling.
- Listen to users more than assumptions.
- Solve Indian nutrition, not just calorie tracking.

## Pain Points Discussed

### Indian Food Recognition

Existing food databases are Western-first and weak on Indian foods, especially regional and homemade dishes.

Examples:

- Litti chokha
- Ghugni
- Sattu drink
- Dal pitha
- Chura dahi
- Homemade sabzi

### Portion Estimation

Users rarely know gram weights and often describe meals in household terms.

Observed issue:

- "I ate rice" could mean 200g, 400g, or 600g.

Potential solutions:

- Plate calibration
- Household utensil calibration
- Personalized serving history
- Confidence ranges

### Food Variability

The same dish can vary dramatically by household and ingredients.

Examples:

- Paneer: homemade, low-fat, full-fat, branded, local dairy
- Milk: cow, buffalo, toned, double toned, full cream
- Dal: low oil, high oil, ghee tadka

Potential solution:

- Ask context once and remember it.
- Create a household or kitchen profile over time.

### Repetitive Meal Logging

Users often eat the same meals repeatedly.

Example:

- "OG Bulking Shake" with milk, bananas, peanut butter, sattu, dates, and other ingredients.

Potential solution:

- Saved meals
- Meal memory
- Automatic repeated meal detection
- One-message logging

### Trust

AI estimates can damage trust if they look exact but are wrong.

Potential solution:

- Use ranges.
- Show confidence.
- State assumptions.
- Allow quick corrections.

## Validation Participants

Early participants named in source planning:

- Sakhi
- Rahul
- Rounak
- Ria

## Validation Questions

- Would users use this daily?
- What frustrates them?
- Where do they stop?
- What feature do they ask for?
- Do they trust nutrition estimates?
- Do confidence ranges help or hurt trust?
- Does meal memory reduce effort?
- How often do users correct estimates?
- Which Indian foods fail most often?

## Poster Direction Notes

The poster establishes a public-facing product frame:

- Brand: NutriAI India
- Surface: WhatsApp
- Message: Eat Indian. Text on WhatsApp. Get instant calories and macros.
- Inputs: Text, voice note, photo
- Positioning: India's first AI nutrition assistant built for Indian food, Indian habits, and Indian goals
- Premium feature direction: photo analysis, advanced reports, personalized meal suggestions, custom goals and plans, weekly progress insights
- Audience: gym-goers, students, working professionals, weight-loss users, weight-gain users, healthy families

## Current Follow-Ups

- Select technical stack.
- Choose WhatsApp provider.
- Define first nutrition database seed list.
- Design the MVP response format.
- Define saved meal commands.
- Define correction handling.
- Define confidence/range language.
- Start manual validation with named participants.
- Decide what data is required for the first user profile.
