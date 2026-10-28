# Roadmap

Status: Current roadmap
Principle: Validate the smallest WhatsApp-first logging loop before expanding into richer AI features.

Scope note: This roadmap preserves product direction and future sequencing. The implemented V0.1 surface is a responsive WhatsApp-style web prototype, not a WhatsApp integration. See `docs/FounderHandover.md` for current implementation status.

## Phase 0 - Documentation And Product Alignment

Status: In progress

Goals:

- Create repository documentation.
- Preserve historical PRD direction.
- Define current product direction.
- Document architecture and implementation gaps.

Deliverables:

- `docs/PRD_v0.1.md`
- `docs/PRD_v0.2.md`
- `docs/Architecture.md`
- `docs/ProductSpec.md`
- `docs/Roadmap.md`
- `docs/Decisions.md`
- `docs/MeetingNotes.md`

## Phase 1 - Manual Validation

Goal: Prove users want a WhatsApp-first Indian nutrition assistant before building a full product.

Scope:

- Manually simulate WhatsApp meal logging with early testers.
- Collect real Indian meal examples.
- Track logging time, frustration points, and correction frequency.
- Validate daily summary usefulness.
- Test saved meal concepts manually.

Success signals:

- Users log multiple meals per day.
- Users return after day 7.
- Users ask for saved meals, summaries, or corrections.
- Users prefer WhatsApp logging over a traditional app flow.

## Phase 2 - Text MVP

Goal: Build the first automated text-based logging loop.

Scope:

- WhatsApp webhook.
- User identity by phone number.
- Text meal parser.
- Indian food estimate pipeline.
- Meal log storage.
- Daily totals.
- Daily summary command.
- Saved meals.
- Simple corrections.
- Basic confidence or assumptions.

Success signals:

- Common meals log in under 10 seconds.
- Users need few corrections for repeated meals.
- The system recognizes enough Indian foods to feel useful.
- Day 7 retention improves compared with manual testing baseline.

## Phase 3 - Memory And Personalization

Goal: Reduce repeated effort through learning.

Scope:

- Repeated meal detection.
- Saved recipes.
- User routine detection.
- Preferred language memory.
- Household preference memory.
- Correction learning.
- Kitchen profile foundations.

Success signals:

- Increasing share of logs come from saved or remembered meals.
- Average correction rate decreases for returning users.
- Users describe the product as easier than manual tracking.

## Phase 4 - Voice And Language Expansion

Goal: Support natural Indian logging behavior across English, Hindi, and Hinglish.

Scope:

- Voice note transcription.
- Hindi and Hinglish parsing.
- Regional food aliases.
- Language preference memory.
- Weekly reports.

Success signals:

- Voice logs are successfully converted into meal logs.
- Hindi/Hinglish users can complete logs without switching language.
- Weekly reports improve retention.

## Phase 5 - Photo And Portion Intelligence

Goal: Make photo-based logging useful without overpromising accuracy.

Scope:

- Food photo recognition.
- Portion estimation.
- Confidence ranges.
- Quick confirmation/correction.
- Plate, bowl, katori, and glass calibration.

Success signals:

- Photo logging is faster than text for multi-item meals.
- Users trust estimates when assumptions are shown.
- Calibration improves repeat-user estimate quality.

## Phase 6 - Coaching And Premium

Goal: Convert tracking data into useful guidance.

Scope:

- AI nutrition coach.
- Advanced reports.
- Personalized meal suggestions.
- Custom goals and plans.
- Weekly progress insights.
- Budget meal planning.
- Student bulking plans.

Success signals:

- Users engage with suggestions.
- Premium users retain better than free users.
- Coaching remains practical and non-medical.

## Later Opportunities

- Restaurant nutrition estimation
- Grocery recommendations
- Recipe generator
- Family meal sharing
- Health reports
- Wearable integration
- Nutrition challenges
- Community features
- Native mobile app if WhatsApp validation supports it
