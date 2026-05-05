# Plan Backfill Checklist Design

**Date:** 2026-05-04

## Goal

Allow a user to open a past day in the Plan screen and mark specific checklist items complete for that exact date if they forgot to log them on the day itself.

## Product Change

The app already stores completions by athlete and date, but only the Today screen exposes those checklist toggles. If a user misses a day, there is currently no clean way to backfill that progress without editing storage directly.

The new behavior stays inside the existing Plan flow:

- expand a day in Plan
- if that day is in the past, show a compact checklist for that date
- allow each checklist item to be toggled independently
- skip notes, sleep, RPE, and other metadata
- keep future dates read-only

## Interaction Model

When the user opens an expanded day card in Plan:

- past dates show a "Mark completed" checklist beneath the workout details
- the checklist uses the same goal set and point model as Today
- tapping an item toggles only that single goal for the selected date
- already-saved past completions render as checked when reopened
- the current date and future dates do not show the backfill checklist

This keeps Today focused on the live day while Plan becomes the place to repair missed history.

## UI Structure

The expanded Plan day card keeps the existing inline workout detail panel and gains one extra section for eligible dates:

1. Workout details
2. Past-day checklist
   - section label indicating the selected date
   - current point total for that date
   - one button per goal definition

The checklist should visually match the existing training checklist enough to feel native, but it should remain compact and obviously date-scoped.

## Architecture

No new persistence model is needed. The store already supports date-targeted goal toggles through `toggleGoal(goal, athleteId, date)`, and completions are already keyed by `athleteId:date`.

The implementation should:

- add a small helper in the store to read a completion for an arbitrary athlete/date pair
- pass the selected day date into the Plan workout detail component
- compute whether the selected day is before the store's `currentDate`
- render a Plan-only checklist component that reads and writes completion state for that date

Because the existing sync path already saves completions by date, backfilled checklist toggles should automatically follow the same local and household-sync behavior as Today.

## Error Handling

- Future dates should not render editable checklist controls.
- Missing completion state for a past day should fall back to an empty completion object rather than erroring.
- Toggling a goal for a past date should create that date's completion record on demand.

## Verification

The feature is complete only if:

- an expanded past day in Plan shows the individual checklist items
- an expanded current or future day does not show the backfill checklist
- toggling one checklist item updates only that item for that exact date
- reopening the same past day shows the saved checked state
- the existing Plan expand/collapse and jump-to-current-week behavior still work
