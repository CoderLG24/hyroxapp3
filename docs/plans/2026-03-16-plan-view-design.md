# Plan View Design

**Date:** 2026-03-16

## Goal

Refine the Plan section so it behaves like a date-aware training timeline instead of a flat archive. Users should be able to inspect full workout details inline and should be guided toward the workouts closest to the currently relevant date.

## Product Change

The existing Plan screen shows every week with equal weight and forces the user to open dates one-by-one without seeing the actual workout details in place. This makes March, June, and September feel visually identical even though only a narrow date window is usually relevant at a given moment.

The new Plan experience stays entirely inside the Plan section and introduces three behaviors:

- The screen centers itself on the current `focusDate`
- Nearby weeks around that date are emphasized
- Tapping a day expands the full workout details inline

## Interaction Model

When the user opens the Plan route:

- The selected `focusDate` determines the active week
- The active week is expanded by default
- The selected day inside that week is expanded by default
- Nearby weeks around the active week remain easy to access
- Distant weeks are compressed into lighter summary cards

The user can:

- Tap any day to make it the selected day
- Expand inline workout details without leaving Plan
- Jump back to the current week using a dedicated control

## UI Structure

The updated Plan route includes:

1. A sticky context bar showing:
   - active date
   - week number
   - current phase feeling
   - jump-to-current-week action

2. A focused week stack:
   - current week expanded
   - adjacent weeks shown with stronger visual prominence
   - distant weeks compressed

3. An inline workout detail section inside the expanded day card:
   - description
   - warmup
   - main work
   - conditioning
   - cooldown
   - cycle-aware notes when present

## Architecture

The shared `focusDate` remains in the existing app store. The Plan route gains plan-local state for:

- expanded week ids
- selected expanded day
- centered week window

This keeps the app-wide date context consistent while preventing plan-specific disclosure state from leaking into unrelated routes.

## Implementation Notes

- Reuse the existing workout-detail content model rather than inventing a second detail format
- Extract plan-specific components instead of keeping the entire experience inside `app/plan/page.tsx`
- Prefer a mobile-first stack layout with clean expansion behavior
- Keep the far weeks browsable but visually subordinate

## Verification

The update is complete only if:

- the current/focused week is expanded on load
- a selected day reveals its workout details inline
- nearby weeks are easier to access than distant weeks
- the jump control returns the user to the current week
- the Plan route still works on mobile and desktop
