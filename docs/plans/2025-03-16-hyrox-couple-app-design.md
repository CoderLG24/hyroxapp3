# Hyrox Couple App Design

**Date:** 2025-03-16

## Goal

Build a premium-quality local-first web app for a married couple training for Hyrox that combines a fully scheduled day-by-day training plan, a 75 Hard-inspired checklist system, a points and rewards economy, shared progress, and Katy's cycle-aware training overlay.

## Product Direction

The app is a consumer fitness product, not an admin panel. It should feel like a premium lifestyle dashboard with strong visual hierarchy, polished motion, elevated cards, rich progress feedback, and satisfying reward mechanics.

Each athlete uses the app on their own phone. The product therefore defaults to a personal-first experience while still exposing shared team progress and shared rewards. There is no sign-in for the first version. Each device stores a preferred athlete locally and opens into that athlete's view by default.

## Core Experience

The app blends four product modes into one system:

- Training planner
- Habit tracker
- Progression game
- Rewards economy

The daily flow is the most important loop:

1. Open the app and immediately see today's mission.
2. Review the scheduled workout with exact details.
3. Complete checklist items throughout the day.
4. Watch points, streaks, and shared bonuses update in real time.
5. See reward progress move forward and unlock milestones.

## Navigation

The app includes six primary screens:

### Dashboard

Primary daily hub for the selected athlete. Shows today's date, race countdown, today's workout, checklist progress, points earned today, streaks, shared progress, reward progress bars, and Katy's cycle status card when applicable.

### Today

Dedicated execution screen for the current day. Shows the hero mission card, workout details, warmup, main work, conditioning, cooldown, checklist, notes, RPE, soreness, sleep, symptoms, and live point totals.

### Plan

A full 26-week calendar view with every day visible, including rest days. Each date card exposes workout type, status, and click-through details.

### Rewards

Displays Lawton rewards, Katy rewards, and shared rewards with point progress, redemption states, and reward history.

### Progress

Shows completion percentage, streaks, point trends, weekly consistency, reward redemption history, and benchmark tracking.

### Settings

Allows editing device athlete preference, protein target, hydration target, step target, Katy cycle settings, reward catalog entries, and theme options.

## Data Model

The app is seed-first and local-first.

Static TypeScript seed files:

- `data/athletes.ts`
- `data/goals.ts`
- `data/rewards.ts`
- `data/shared-rules.ts`
- `data/workouts-lawton.ts`
- `data/workouts-katy.ts`

These files define the fixed training plan, athlete metadata, goals, point rules, shared bonus rules, and reward catalog. The structure must be database-ready later, but the first version reads directly from local modules.

Mutable client-side state is stored locally in browser storage:

- Daily completions
- Notes and readiness inputs
- Reward redemption history
- Device athlete preference
- Editable user settings

Derived selectors compute:

- Personal point totals
- Shared point totals
- Daily point summaries
- Perfect days
- Weekly bonuses
- Shared bonuses
- Workout completion percentages
- Streaks
- Reward affordability and progress
- Race countdown
- Katy cycle day and readiness guidance

## Training Plan Modeling

The plan spans explicit dates from `2026-03-16` through `2026-09-18`.

Every day must exist as a full `WorkoutDay` object for each athlete, including:

- Training days
- Rest days
- Cycle class days
- Taper days
- Race day

No weekly template is used at runtime. The source plan is converted into explicit date-based seed arrays so the application can render every date without inference.

The workout content must be precise. Every workout entry includes exact warmup, main work, conditioning, cooldown, and explicit exercises, sets, reps, rounds, distances, durations, and rest where relevant. Vague descriptions are not allowed.

Rules preserved from the provided plan:

- Lawton trains Monday, Tuesday, Wednesday, Thursday, Saturday
- Lawton rests Friday and Sunday
- Katy trains Monday, Tuesday, Thursday
- Katy has Cycle Class every Wednesday and Saturday
- Katy rests Friday and Sunday
- Friday is always a rest day for both athletes

## Katy Cycle Overlay

Katy's cycle-aware system is additive and date-aware.

Inputs:

- Anchor start date: `2026-03-31`
- Cycle length: `29` days

Behavior:

- Show estimated cycle day on each calendar date
- Surface readiness guidance as `green`, `yellow`, or `red`
- Preserve the assigned workout as written
- Provide precise modification guidance when symptoms require adjustment

Rules:

- `green`: do workout as written
- `yellow`: reduce volume 15-25% or swap intervals for tempo
- `red`: switch to easy aerobic, upper body, mobility, or rest

On Wednesday and Saturday, the default assigned workout remains Cycle Class unless symptom-based adjustment is selected.

## Checklist And Economy

Daily checklist items:

- Complete scheduled workout
- Eat at home
- Hit protein target
- Hit hydration goal
- Complete mobility / recovery
- Hit step goal

Daily points:

- `scheduled_workout_complete = 20`
- `eat_at_home = 10`
- `protein_target_hit = 8`
- `hydration_target_hit = 4`
- `mobility_complete = 4`
- `step_goal_hit = 4`

Perfect day:

- `50` points

Weekly bonuses:

- `five_plus_workouts = 20`
- `five_plus_eat_at_home_days = 10`
- `four_plus_protein_days = 10`
- `five_plus_strong_days = 15`

Shared bonuses:

- `both_complete_workout_same_day = 10`
- `both_complete_perfect_day_same_day = 15`
- `both_hit_full_training_week = 25`

Point banks:

1. Lawton personal
2. Katy personal
3. Shared bank

Personal actions earn personal points only. Shared rewards spend only from the shared bank. Personal rewards spend only from the corresponding athlete bank.

## Reward System

Rewards are split across three catalogs:

- Lawton personal rewards
- Katy personal rewards
- Shared rewards

Each reward includes cost, scope, athlete ownership where relevant, and redemption history. UI feedback should emphasize approach-to-unlock and affordability. Unlocking and redeeming a reward should feel emotionally satisfying rather than transactional.

## UI System

The visual system is dark-mode-first and premium.

Characteristics:

- Deep graphite backgrounds
- Blue/teal energy gradients
- Elevated glass-like surfaces
- Strong typography hierarchy
- Soft glow accents
- Refined spacing
- Mobile-first responsive composition
- Smooth transitions and staggered reveals
- Progress rings, streak chips, and reward progress bars

Avoid:

- CRUD-style page layouts
- Data tables as the main interface
- Spreadsheet aesthetics
- Form-heavy flows
- Enterprise styling

`shadcn/ui` provides structural primitives, but the visual system is custom. `framer-motion` handles animated cards, transitions, and celebratory states. `recharts` renders embedded progress charts inside styled cards.

## Architecture

The codebase is organized by domain and product surface:

- `app/` for routes and page composition
- `components/` for layout, dashboard modules, cards, charts, and interactive controls
- `data/` for seed modules
- `lib/` for selectors, calculators, storage, formatting, cycle logic, and seed generation helpers
- `tests/` for unit and integration coverage

The first release is entirely local-first but intentionally structured so the data layer can later move behind a database or API without rewriting the UI model.

## Verification Strategy

Critical verification areas:

- Seed coverage for every date and athlete
- Friday, Sunday, and Katy cycle-class constraints
- Point calculations and shared bonus logic
- Reward affordability and redemption deductions
- Streak calculations
- Katy cycle day and readiness overlay behavior
- Main screen rendering and route health
- Production build success

## Implementation Notes

Because the workspace starts empty, the implementation will need to:

1. Scaffold the Next.js project and UI dependencies.
2. Define the domain types and seed files.
3. Generate explicit workout day objects from the provided weekly structure.
4. Build local persistence and derived state utilities.
5. Implement the premium dashboard UI and route system.
6. Add test coverage for the core domain logic.

## Constraints

- Local-first, no sign-in
- Explicit date-based seed data
- No vague workout descriptions
- Friday rest day for both athletes throughout the seed range
- Wednesday and Saturday Cycle Class for Katy throughout the seed range
- Mobile-first personal experience per device
- Production-quality code and polished visual design
