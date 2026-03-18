# Today Date Isolation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Dashboard and Today always use the real current date while keeping Plan date browsing fully local to the Plan route.

**Architecture:** Remove shared browsing date behavior from the store and replace it with a stable current-day date used everywhere outside Plan. Keep Plan selection as local component state initialized from the current day but never written back into the shared store.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, Testing Library

---

### Task 1: Add Regression Tests For Date Isolation

**Files:**
- Modify: `tests/app/plan-page.test.tsx`
- Create: `tests/app/today-date-isolation.test.tsx`

**Step 1: Write the failing test**

Add tests that assert:

- Plan browsing can change the selected date inside Plan
- Home and Today still render the real current-day workout after Plan browsing changes

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/app/plan-page.test.tsx tests/app/today-date-isolation.test.tsx`
Expected: FAIL because shared date state still leaks between routes

**Step 3: Verify failure reason**

Confirm the failure is caused by shared browsing date behavior rather than broken test setup.

### Task 2: Refactor Store Date State

**Files:**
- Modify: `lib/store.tsx`
- Modify: `lib/dates.ts`

**Step 1: Implement a current-day store date**

Replace the shared browsing behavior with a current-day date used by Dashboard and Today.

**Step 2: Remove Plan-driven shared date mutation**

Ensure store consumers outside Plan always read the real current-day context.

**Step 3: Run targeted tests**

Run: `npm run test -- tests/app/plan-page.test.tsx tests/app/today-date-isolation.test.tsx`
Expected: still failing only where Plan has not yet been updated

### Task 3: Make Plan Selection Local

**Files:**
- Modify: `app/plan/page.tsx`
- Modify: `components/plan/plan-context-bar.tsx`
- Modify: `components/plan/plan-week-card.tsx`

**Step 1: Move selected date state into Plan**

Initialize from today's date, then keep browsing local to the Plan route.

**Step 2: Preserve focused-week and inline workout behavior**

Keep the current Plan UX while removing side effects on other pages.

**Step 3: Run targeted tests**

Run: `npm run test -- tests/app/plan-page.test.tsx tests/app/today-date-isolation.test.tsx`
Expected: PASS

### Task 4: Final Verification

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
