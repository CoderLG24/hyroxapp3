# Today Date Isolation Design

**Date:** 2026-03-17

## Goal

Ensure Dashboard and Today always show the real current day's workout and information, while browsing other dates remains isolated to the Plan section.

## Problem

The app currently uses shared date state for both:

- the real current-day experience
- browsing dates inside the Plan route

That coupling causes Plan browsing to leak into Home and Today, which breaks the product expectation that those screens always represent the actual current day.

## Design

The fix is intentionally small:

- keep a real current-day date in shared app state for Dashboard, Today, and any other non-Plan summaries
- remove shared browsing behavior from Plan
- make the Plan route own its selected date locally

After this change:

- Home always shows today's real workout and checklist context
- Today always shows today's real workout and checklist context
- Plan can browse future and past days without changing anything elsewhere

## Architecture

The store should expose a stable current-day date derived from the existing date helper.

The Plan route should manage its own selected date in component-local state. It can initialize from the current-day date, but after that its browsing state is private to Plan.

## Verification

The change is correct only if:

- changing dates in Plan does not change Home
- changing dates in Plan does not change Today
- Home and Today continue to show the current day's workout by default
