# Hyrox Couple App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local-first premium Hyrox training app for Lawton and Katy with explicit seeded training plans, daily checklists, points and rewards, shared progress, and Katy's cycle-aware overlay.

**Architecture:** Scaffold a Next.js App Router app and organize it around seed data, derived state utilities, persistent local storage, and premium mobile-first route composition. Materialize the provided training plan into explicit day-level TypeScript seed modules, then layer selectors, interactive state, and polished UI over that foundation.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Vitest, Testing Library

---

### Task 1: Scaffold The Project

**Files:**
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `next.config.ts`
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `app/globals.css`

**Step 1: Create the Next.js app shell**

Use `create-next-app` or equivalent project scaffolding for an App Router TypeScript app with Tailwind enabled.

**Step 2: Install runtime UI dependencies**

Install:

- `framer-motion`
- `recharts`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `date-fns`

**Step 3: Install testing dependencies**

Install:

- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jsdom`

**Step 4: Add shadcn/ui configuration**

Configure `components.json`, Tailwind content paths, CSS variables, and shared utility helpers.

**Step 5: Verify the scaffold**

Run: `npm run lint`
Expected: linter passes or reports only issues that are fixed before continuing

### Task 2: Define Domain Types And Static Data Modules

**Files:**
- Create: `lib/types.ts`
- Create: `data/athletes.ts`
- Create: `data/goals.ts`
- Create: `data/rewards.ts`
- Create: `data/shared-rules.ts`

**Step 1: Write failing tests for domain shapes**

Create tests that validate reward catalogs, goal keys, and athlete metadata shapes.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/data/domain.test.ts`
Expected: fail because modules do not exist yet

**Step 3: Implement minimal domain types**

Add the shared types requested by the specification, including:

- `AthleteId`
- `GoalKey`
- `RewardScope`
- `ReadinessStatus`
- `ExerciseBlock`
- `WorkoutDay`
- `DailyCompletion`
- `Reward`

**Step 4: Implement seed modules**

Add athlete metadata, daily goal definitions, personal and shared reward catalogs, and point and shared-bonus rules.

**Step 5: Re-run tests**

Run: `npm run test -- tests/data/domain.test.ts`
Expected: pass

### Task 3: Build Workout Seed Generation Inputs

**Files:**
- Create: `lib/training-plan-source.ts`
- Create: `lib/workout-builders.ts`
- Create: `tests/data/workout-builders.test.ts`

**Step 1: Write failing tests for workout builders**

Test that a structured weekly source entry is converted into a precise `WorkoutDay` object with no missing warmup/main/conditioning/cooldown fields.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/data/workout-builders.test.ts`
Expected: fail because builders do not exist

**Step 3: Implement workout source structures**

Encode the provided weekly plan logic in a source format that is strict enough to generate explicit dates for both athletes.

**Step 4: Implement workout builder helpers**

Add helpers for:

- strength-plus-run days
- interval run days
- Hyrox simulation days
- cycle class days
- rest days
- taper and race days

These helpers must output exact exercise blocks and exact descriptions.

**Step 5: Re-run tests**

Run: `npm run test -- tests/data/workout-builders.test.ts`
Expected: pass

### Task 4: Generate Explicit Date-Based Workout Seeds

**Files:**
- Create: `data/workouts-lawton.ts`
- Create: `data/workouts-katy.ts`
- Create: `tests/data/workout-seeds.test.ts`

**Step 1: Write failing tests for seed coverage**

Tests should verify:

- every date exists from `2026-03-16` through `2026-09-18`
- both athlete arrays include the full date range
- every Friday for both athletes is rest
- every Sunday for both athletes is rest except race week logic where applicable
- every Wednesday and Saturday for Katy is cycle class except explicit taper adjustment text on `2026-09-16`
- every object includes explicit content fields

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/data/workout-seeds.test.ts`
Expected: fail because seed files do not exist

**Step 3: Implement explicit seed generation**

Use the provided plan logic to materialize full arrays of `WorkoutDay` objects for both athletes. Preserve date-specific week 26 entries exactly as provided. Ensure every workout description is precise and non-vague.

**Step 4: Export final seed arrays**

Export as static TypeScript arrays from the requested `data/` files.

**Step 5: Re-run tests**

Run: `npm run test -- tests/data/workout-seeds.test.ts`
Expected: pass

### Task 5: Implement Cycle Logic, Points, Shared Bonuses, And Streaks

**Files:**
- Create: `lib/cycle.ts`
- Create: `lib/scoring.ts`
- Create: `lib/streaks.ts`
- Create: `tests/lib/cycle.test.ts`
- Create: `tests/lib/scoring.test.ts`
- Create: `tests/lib/streaks.test.ts`

**Step 1: Write failing tests**

Cover:

- cycle day calculation from anchor date
- readiness color mapping
- daily points totaling
- perfect day detection
- weekly bonus thresholds
- shared same-day bonus triggers
- shared full-week bonus triggers
- streak counting

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/lib/cycle.test.ts tests/lib/scoring.test.ts tests/lib/streaks.test.ts`
Expected: fail because the utility modules do not exist

**Step 3: Implement the calculation utilities**

Add pure functions that accept seed data plus completion data and return derived progress metrics.

**Step 4: Re-run tests**

Run: `npm run test -- tests/lib/cycle.test.ts tests/lib/scoring.test.ts tests/lib/streaks.test.ts`
Expected: pass

### Task 6: Implement Local Persistence And App State

**Files:**
- Create: `lib/storage.ts`
- Create: `lib/store.ts`
- Create: `tests/lib/storage.test.ts`

**Step 1: Write failing tests for persistence helpers**

Cover safe storage reads, writes, defaults, migration-safe parsing, and athlete preference persistence.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/lib/storage.test.ts`
Expected: fail because storage helpers do not exist

**Step 3: Implement persistence layer**

Store:

- device athlete preference
- completions
- settings
- redemption history

Use versioned keys and defensive parsing.

**Step 4: Implement app state hooks/selectors**

Expose the current athlete, today's workout, checklist state, computed points, reward progress, and shared metrics.

**Step 5: Re-run tests**

Run: `npm run test -- tests/lib/storage.test.ts`
Expected: pass

### Task 7: Build Premium Design Foundations

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/app-shell.tsx`
- Create: `components/ui/gradient-orb.tsx`
- Create: `components/ui/stat-card.tsx`
- Create: `components/ui/progress-ring.tsx`
- Create: `components/ui/section-heading.tsx`
- Create: `components/ui/animated-number.tsx`

**Step 1: Write failing UI smoke tests**

Add a simple render test for at least one foundation component and the shell.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/ui/foundations.test.tsx`
Expected: fail because components do not exist

**Step 3: Implement the visual system**

Add CSS variables, gradients, card treatments, typography scale, and foundational UI primitives. Ensure the system reads premium on mobile first and scales to desktop.

**Step 4: Re-run tests**

Run: `npm run test -- tests/ui/foundations.test.tsx`
Expected: pass

### Task 8: Build Shared Screen Modules

**Files:**
- Create: `components/dashboard/dashboard-hero.tsx`
- Create: `components/dashboard/workout-card.tsx`
- Create: `components/dashboard/checklist-card.tsx`
- Create: `components/dashboard/race-countdown-card.tsx`
- Create: `components/dashboard/reward-progress-card.tsx`
- Create: `components/dashboard/cycle-status-card.tsx`
- Create: `components/dashboard/shared-progress-card.tsx`
- Create: `components/dashboard/streak-card.tsx`
- Create: `components/progress/points-chart.tsx`
- Create: `components/progress/consistency-chart.tsx`
- Create: `components/rewards/reward-card.tsx`
- Create: `components/plan/calendar-grid.tsx`
- Create: `components/today/today-mission.tsx`

**Step 1: Write failing render tests**

Add render coverage for representative dashboard, rewards, and plan modules with seed data.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/components/modules.test.tsx`
Expected: fail because modules do not exist

**Step 3: Implement the modules**

Compose the premium cards and charts using seed data and derived selectors. Add motion where it supports product feel without slowing the app.

**Step 4: Re-run tests**

Run: `npm run test -- tests/components/modules.test.tsx`
Expected: pass

### Task 9: Implement Routes And Navigation

**Files:**
- Modify: `app/page.tsx`
- Create: `app/today/page.tsx`
- Create: `app/plan/page.tsx`
- Create: `app/rewards/page.tsx`
- Create: `app/progress/page.tsx`
- Create: `app/settings/page.tsx`
- Create: `components/navigation/bottom-nav.tsx`

**Step 1: Write failing route smoke tests**

Verify each route renders its primary screen heading and critical data section.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/app/routes.test.tsx`
Expected: fail because pages do not exist

**Step 3: Implement route pages**

Wire each page to the store/selectors and render the correct modules. The default route should open into the selected athlete's dashboard.

**Step 4: Implement mobile-first navigation**

Add a premium bottom navigation for mobile and an adapted desktop navigation for wider screens.

**Step 5: Re-run tests**

Run: `npm run test -- tests/app/routes.test.tsx`
Expected: pass

### Task 10: Implement Interactive Checklist, Notes, And Redemption Flows

**Files:**
- Create: `components/today/checklist-item.tsx`
- Create: `components/today/daily-notes-form.tsx`
- Create: `components/rewards/redeem-dialog.tsx`
- Modify: `components/today/today-mission.tsx`
- Modify: `components/rewards/reward-card.tsx`
- Create: `tests/components/interactions.test.tsx`

**Step 1: Write failing interaction tests**

Cover:

- checking a goal updates live points
- perfect day state appears when all goals are complete
- reward redemption deducts points and adds history

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/components/interactions.test.tsx`
Expected: fail because interaction components are incomplete

**Step 3: Implement checklist and redemption interactions**

Add motion-enhanced checkbox states, note capture, readiness selection, symptom notes, and reward redemption handling.

**Step 4: Re-run tests**

Run: `npm run test -- tests/components/interactions.test.tsx`
Expected: pass

### Task 11: Add Celebration States And Final UI Polish

**Files:**
- Create: `components/ui/celebration-banner.tsx`
- Modify: `components/dashboard/checklist-card.tsx`
- Modify: `components/rewards/redeem-dialog.tsx`
- Modify: `components/dashboard/dashboard-hero.tsx`

**Step 1: Write failing UI-state tests**

Cover perfect-day and reward-unlock celebratory states rendering when thresholds are met.

**Step 2: Run tests to verify failure**

Run: `npm run test -- tests/ui/celebration.test.tsx`
Expected: fail because celebration states do not exist

**Step 3: Implement celebration treatments**

Add tasteful motion and premium feedback for perfect-day completion and reward unlock events.

**Step 4: Re-run tests**

Run: `npm run test -- tests/ui/celebration.test.tsx`
Expected: pass

### Task 12: Full Verification

**Files:**
- Modify: `README.md`

**Step 1: Run targeted test suite**

Run: `npm run test`
Expected: all tests pass

**Step 2: Run lint**

Run: `npm run lint`
Expected: pass

**Step 3: Run production build**

Run: `npm run build`
Expected: build succeeds

**Step 4: Document local usage**

Add a concise README describing setup, local-first persistence behavior, and project structure.

**Step 5: Final review**

Manually inspect the dashboard, today, rewards, progress, plan, and settings screens in responsive mode and confirm the app feels product-level rather than CRUD-like.
