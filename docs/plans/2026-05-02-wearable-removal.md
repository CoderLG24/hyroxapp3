# Wearable Removal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all wearable sync and recovery UI from HyroxAppv3 while preserving the approved training reset, workout substitutions, and Plan scroll fix.

**Architecture:** Roll back the wearable layer completely instead of hiding it. Revert mixed files to their pre-wearable behavior only where needed, while leaving the reset and Plan changes in place. Delete wearable-only routes, helpers, docs, tests, and schema additions.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, Testing Library, Supabase

---

### Task 1: Add failing tests for wearable removal

**Files:**
- Create: `tests/app/settings-page.test.tsx`
- Modify: `tests/lib/scoring.test.ts`

**Step 1: Write the failing test**

Add tests that assert:

- Settings does not render a wearable integrations section
- scoring still computes daily points and perfect days without wearable override helpers

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/app/settings-page.test.tsx tests/lib/scoring.test.ts`
Expected: FAIL because the current app still renders wearable controls and scoring still contains wearable-specific behavior

**Step 3: Verify failure reason**

Confirm the failures are caused by wearable code still being present.

### Task 2: Remove wearable UI and store wiring

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/settings/page.tsx`
- Modify: `app/today/page.tsx`
- Modify: `components/training/checklist-card.tsx`
- Modify: `lib/store.tsx`
- Delete: `components/wearables/recovery-card.tsx`

**Step 1: Remove recovery cards and settings controls**

Restore Dashboard, Today, and Settings to non-wearable behavior.

**Step 2: Remove wearable state from the store**

Delete wearable connection/metric state, recommendation logic, sync calls, and display-goal overrides, but keep the progress reset logic intact.

**Step 3: Restore manual checklist behavior**

Remove wearable-managed step goal state so all goals toggle normally again.

**Step 4: Run targeted tests**

Run: `npm run test -- tests/app/settings-page.test.tsx tests/app/plan-page.test.tsx tests/lib/storage-reset.test.ts`
Expected: PASS

### Task 3: Remove wearable backend, types, and support files

**Files:**
- Modify: `lib/scoring.ts`
- Modify: `lib/sync-client.ts`
- Modify: `lib/supabase/repository.ts`
- Modify: `lib/supabase/database.types.ts`
- Modify: `lib/supabase/env.ts`
- Modify: `lib/types.ts`
- Delete: `app/api/integrations/[provider]/callback/route.ts`
- Delete: `app/api/integrations/[provider]/connect/route.ts`
- Delete: `app/api/integrations/[provider]/sync/route.ts`
- Delete: `app/api/integrations/status/route.ts`
- Delete: `lib/wearables/config.ts`
- Delete: `lib/wearables/guards.ts`
- Delete: `lib/wearables/normalize.ts`
- Delete: `lib/wearables/oauth-state.ts`
- Delete: `lib/wearables/providers.ts`
- Delete: `supabase/migrations/20260318_create_wearable_tables.sql`
- Delete: `docs/wearables-setup.md`

**Step 1: Remove wearable-specific exports and types**

Strip wearable providers, metrics, and helper functions from shared types and scoring.

**Step 2: Remove wearable endpoints and helpers**

Delete all integration routes and wearable helper modules.

**Step 3: Remove schema/env additions**

Delete wearable table definitions and environment support added only for the wearable feature.

**Step 4: Run targeted tests**

Run: `npm run test -- tests/lib/scoring.test.ts tests/lib/storage-reset.test.ts tests/data/workout-seeds.test.ts`
Expected: PASS

### Task 4: Remove wearable-only tests and finalize docs

**Files:**
- Modify: `tests/lib/scoring.test.ts`
- Create: `docs/plans/2026-05-02-wearable-removal-design.md`
- Modify: `docs/plans/2026-05-02-reset-and-plan-scroll.md` if needed for accuracy

**Step 1: Delete or rewrite wearable-only test cases**

Keep only tests that match the final non-wearable product.

**Step 2: Keep session docs aligned**

Ensure the plan/design docs accurately reflect the final implementation set.

**Step 3: Run targeted tests**

Run: `npm run test -- tests/app/settings-page.test.tsx tests/lib/scoring.test.ts`
Expected: PASS

### Task 5: Final verification

**Files:**
- None required

**Step 1: Run full test suite**

Run: `npm run test`
Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Run production build**

Run: `npm run build`
Expected: PASS
