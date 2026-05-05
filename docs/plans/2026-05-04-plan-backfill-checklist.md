# Plan Backfill Checklist Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users backfill specific checklist items for past dates directly from the Plan screen without exposing notes or other Today-only metadata.

**Architecture:** Reuse the existing date-keyed completion model and `toggleGoal(goal, athleteId, date)` pathway instead of creating a second persistence flow. Add a small store selector for arbitrary-date completions, then render a Plan-only backfill checklist inside expanded past-day cards when `day.date` is earlier than `currentDate`.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, Testing Library

---

### Task 1: Add failing Plan tests for past-day backfill behavior

**Files:**
- Modify: `tests/app/plan-page.test.tsx`
- Read: `components/plan/plan-day-card.tsx`
- Read: `components/plan/plan-workout-inline.tsx`

**Step 1: Write the failing tests**

Add tests that assert:

- expanding a past day shows a "Mark completed" checklist with the individual goal labels
- expanding the current focused date does not show the backfill checklist
- clicking a past-day goal calls the store toggle handler with that goal key and the selected date

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/app/plan-page.test.tsx`
Expected: FAIL because the Plan day details currently render workout content only and expose no date-scoped checklist controls.

**Step 3: Verify failure reason**

Confirm the failure is caused by the missing Plan backfill UI, not by incorrect test fixtures or ambiguous selectors.

### Task 2: Add minimal store support for arbitrary-date completion reads

**Files:**
- Modify: `lib/store.tsx`
- Read: `lib/storage.ts`
- Test: `tests/app/plan-page.test.tsx`

**Step 1: Add a read helper to the store value**

Expose a selector like `getCompletionForDate(date: string, athleteId?: AthleteId)` that returns the normalized completion object for any date/athlete pair.

**Step 2: Keep writes on the existing path**

Do not add a second mutation API. Continue using `toggleGoal(goal, athleteId, date)` so the existing persistence and household sync behavior remain intact.

**Step 3: Re-run the failing test**

Run: `npm run test -- tests/app/plan-page.test.tsx`
Expected: still FAIL until the Plan UI consumes the new selector.

### Task 3: Implement the Plan backfill checklist UI

**Files:**
- Modify: `components/plan/plan-workout-inline.tsx`
- Modify: `components/plan/plan-day-card.tsx`
- Modify: `lib/store.tsx`
- Modify: `tests/app/plan-page.test.tsx`

**Step 1: Pass the expanded day date into the inline detail component**

Update the Plan day card so the inline details component can determine which date it is rendering.

**Step 2: Render the backfill section only for past dates**

Inside the inline detail component:

- compare `workout.date` with `currentDate`
- if the day is earlier, render a compact checklist panel
- if the day is current or future, render nothing extra

**Step 3: Reuse existing goal definitions and point calculation**

Read the target date's completion from the store, display the individual checklist items, and compute the date's point total with the existing scoring helper.

**Step 4: Wire per-item toggles**

Each checklist button should call `toggleGoal(goal.key, athleteId, workout.date)`.

**Step 5: Run the targeted tests**

Run: `npm run test -- tests/app/plan-page.test.tsx`
Expected: PASS

### Task 4: Verify surrounding behavior still works

**Files:**
- Modify: `tests/app/plan-page.test.tsx` if additional coverage is needed
- Read: `app/plan/page.tsx`

**Step 1: Keep existing Plan interactions green**

Ensure the existing expand/collapse and jump-to-current-week tests still pass with the new checklist section in place.

**Step 2: Run the related regression set**

Run: `npm run test -- tests/app/plan-page.test.tsx tests/lib/storage-reset.test.ts tests/app/today-date-isolation.test.tsx tests/data/workout-seeds.test.ts tests/lib/scoring.test.ts`
Expected: PASS

### Task 5: Final verification

**Files:**
- None required

**Step 1: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS
