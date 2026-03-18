# Sunday CS4 Design

**Date:** 2026-03-17

## Goal

Replace every Sunday rest day in the seeded plan with an explicit `Hyrox CS4 Class` workout for both Lawton and Katy across the full plan range.

## Design

Sunday becomes a fixed schedule rule for both athletes, similar to Katy's fixed cycle-class rules.

After this change:

- all Sundays are `Hyrox CS4 Class`
- no Sunday is `rest`
- the class is represented as a full explicit workout object
- the rule applies across the entire plan, including taper weeks

## Workout Modeling

The Sunday class should be stored as a precise workout object rather than a vague placeholder. It should include:

- title: `Hyrox CS4 Class`
- type: `hyrox`
- a clear description that it is the assigned Sunday class workout
- explicit warmup
- explicit main work/class block
- explicit cooldown

## Verification

The change is correct only if:

- every Sunday between `2026-03-16` and `2026-09-18` is `Hyrox CS4 Class`
- Sunday entries are no longer `rest`
- both athlete arrays still cover the entire date range
