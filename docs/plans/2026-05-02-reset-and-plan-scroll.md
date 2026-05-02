# Reset Progress, Shift Post-May Workouts, and Fix Plan Scroll Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reset progress from `2026-05-02` forward without changing the training calendar, replace post-`2026-05-02` spotter-dependent lifts with solo-safe alternatives, and make the Plan screen's "Jump to current week" control actually scroll to the focused week.

**Architecture:** Add a one-time reset migration keyed to `2026-05-02` so local state clears completions and redemptions from that date forward but preserves older history and current settings. When a shared household is connected, mirror the same reset server-side through a dedicated API and repository delete helpers so the old data does not rehydrate. For workout safety, centralize a date-gated exercise substitution transform in the training plan generator so only workouts on or after `2026-05-02` change. For Plan navigation, attach a DOM anchor to the focused week card and scroll it into view when the context-bar button is pressed.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, Testing Library, Supabase

---

### Task 1: Add failing tests for the one-time reset migration

**Files:**
- Modify: `tests/lib/storage.test.ts` or create `tests/lib/storage-reset.test.ts`
- Modify: `lib/storage.ts`

**Step 1: Write the failing tests**

Add tests that assert:

- a reset helper removes completions whose `date >= 2026-05-02`
- the same helper removes redemptions whose `redeemedOn >= 2026-05-02`
- history before `2026-05-02` is preserved
- the reset is only applied once when a matching reset key has not already been recorded

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/lib/storage-reset.test.ts`
Expected: FAIL because the reset helper and reset metadata do not exist yet

**Step 3: Verify failure reason**

Confirm the failure is caused by missing reset migration behavior, not bad fixture setup.

### Task 2: Add failing tests for the post-May workout substitutions

**Files:**
- Modify: `tests/data/workout-seeds.test.ts`
- Modify: `lib/training-plan-source.ts`

**Step 1: Write the failing tests**

Add assertions that:

- workouts before `2026-05-02` still contain existing barbell movements where seeded
- workouts on and after `2026-05-02` replace:
  - `Bench Press` with `Dumbbell Bench Press`
  - `Close-Grip Bench Press` with `Neutral-Grip Dumbbell Bench Press`
  - `Back Squat` with `Leg Press`
  - `Front Squat` with `Heavy Goblet Squat`
  - generic `Squat` with `Heavy Goblet Squat`
- `Overhead Press` remains unchanged after `2026-05-02`

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/data/workout-seeds.test.ts`
Expected: FAIL because seeded workouts still contain the original lift names after `2026-05-02`

**Step 3: Verify failure reason**

Confirm the failure points to missing date-gated substitutions rather than missing workout coverage.

### Task 3: Add failing test for Plan "Jump to current week" scroll behavior

**Files:**
- Modify: `tests/app/plan-page.test.tsx`
- Modify: `app/plan/page.tsx`
- Modify: `components/plan/plan-week-card.tsx`

**Step 1: Write the failing test**

Add a test that:

- renders multiple weeks
- stubs `Element.prototype.scrollIntoView`
- clicks `Jump to current week`
- asserts the focused week container scroll target receives `scrollIntoView`

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/app/plan-page.test.tsx`
Expected: FAIL because the button currently updates state only and never scrolls

**Step 3: Verify failure reason**

Confirm the failure is caused by missing scroll wiring, not test-query ambiguity.

### Task 4: Implement the one-time local reset migration

**Files:**
- Modify: `lib/storage.ts`
- Modify: `lib/store.tsx`

**Step 1: Add reset metadata to persisted state**

Add a small reset-tracking field such as `appliedResetKeys: string[]` so the reset runs once and future completions after `2026-05-02` persist normally.

**Step 2: Implement reset filtering helpers**

Add helpers that return filtered completions, filtered redemptions, and updated reset metadata for the `2026-05-02` reset key.

**Step 3: Apply reset during initial hydration**

When loading local state, apply the reset migration if its key is missing, then save the migrated state.

**Step 4: Run targeted tests**

Run: `npm run test -- tests/lib/storage-reset.test.ts`
Expected: PASS

### Task 5: Implement the shared-household reset path

**Files:**
- Modify: `lib/sync-client.ts`
- Modify: `lib/store.tsx`
- Create: `app/api/household/reset/route.ts`
- Modify: `lib/supabase/repository.ts`

**Step 1: Add repository delete helpers**

Create delete functions for:

- `daily_completions` rows where `date >= 2026-05-02`
- `reward_redemptions` rows where `redeemed_on >= 2026-05-02`

scoped by `household_id`.

**Step 2: Add reset API route**

Create a route that validates household credentials and invokes both delete helpers.

**Step 3: Add sync client request**

Add a typed client helper to call the reset API.

**Step 4: Apply remote reset once from the store**

If a household session exists and the reset has not yet been applied, call the remote reset, update local state to the filtered data, then record the reset key locally so the old data does not rehydrate.

**Step 5: Run targeted tests**

Run: `npm run test -- tests/lib/storage-reset.test.ts`
Expected: PASS and no regressions in local reset behavior

### Task 6: Implement date-gated no-spotter workout substitutions

**Files:**
- Modify: `lib/training-plan-source.ts`
- Modify: `tests/data/workout-seeds.test.ts`

**Step 1: Add a post-May substitution helper**

Create a helper that transforms workout templates only when `date >= 2026-05-02`.

**Step 2: Replace target lift names**

Update `mainWork` exercise names and any directly conflicting warmup strings or descriptions so the displayed plan stays consistent with the substituted lifts.

**Step 3: Preserve untouched movements**

Keep `Overhead Press` and all non-spotter-dependent exercises unchanged.

**Step 4: Run targeted tests**

Run: `npm run test -- tests/data/workout-seeds.test.ts`
Expected: PASS

### Task 7: Implement Plan scroll-to-current-week behavior

**Files:**
- Modify: `app/plan/page.tsx`
- Modify: `components/plan/plan-week-card.tsx`
- Modify: `tests/app/plan-page.test.tsx`

**Step 1: Add a focused-week ref**

Track the focused week element in `PlanPage`.

**Step 2: Scroll on button click**

Update `handleJumpToCurrentWeek` so it expands nearby weeks, resets the selected date, and calls `scrollIntoView` on the focused week card.

**Step 3: Add a stable DOM hook**

Pass a ref or identifier into `PlanWeekCard` so the focused week container can be targeted reliably without changing the existing UI.

**Step 4: Run targeted tests**

Run: `npm run test -- tests/app/plan-page.test.tsx`
Expected: PASS

### Task 8: Final verification

**Files:**
- None required

**Step 1: Run the relevant tests together**

Run: `npm run test -- tests/lib/storage-reset.test.ts tests/data/workout-seeds.test.ts tests/app/plan-page.test.tsx`
Expected: PASS

**Step 2: Run full test suite**

Run: `npm run test`
Expected: PASS

**Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 4: Run production build**

Run: `npm run build`
Expected: PASS
