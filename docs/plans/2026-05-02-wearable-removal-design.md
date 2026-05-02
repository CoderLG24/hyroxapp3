# Wearable Removal Design

**Date:** 2026-05-02

## Goal

Remove all wearable sync and recovery UI from HyroxAppv3 while preserving the approved training reset, no-spotter workout substitutions, and Plan scroll fix.

## Scope

Keep:

- the one-time progress reset from `2026-05-02`
- the post-`2026-05-02` workout substitutions
- the Plan `Jump to current week` scroll behavior
- existing household sync that predates wearables

Remove:

- wearable API routes under `app/api/integrations/`
- wearable UI components and Settings integration controls
- wearable state and recommendation logic in the app store
- wearable-based scoring and checklist overrides
- wearable provider/config/oauth helper files
- wearable schema/env/doc additions
- wearable-only tests

## Approach

The removal should be a clean rollback to the pre-wearable app behavior, not a partial hide. Any file or code path that only exists to support WHOOP/Oura, recovery cards, or auto-managed step goals should be deleted or reverted. Shared household sync remains, but it should no longer know about wearable connections or metrics.

For mixed files such as `lib/store.tsx`, `lib/scoring.ts`, `app/page.tsx`, `app/today/page.tsx`, `app/settings/page.tsx`, and `components/training/checklist-card.tsx`, revert only the wearable-specific logic while preserving the separately approved reset and schedule changes.

## Testing

Add and run tests that prove:

- Settings no longer renders wearable integration controls
- scoring no longer depends on wearable goal overrides
- the reset and Plan jump regression tests still pass

## Expected Outcome

The app returns to a simpler local/shared Hyrox tracker with no wearable concepts in the product or codebase, while keeping the reset and schedule improvements requested in this session.
