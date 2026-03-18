# Hyrox Couple App

Local-first Next.js app for Lawton and Katy's Hyrox build.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- shadcn-style component foundation
- Local TypeScript seed data

## What It Includes

- Explicit date-based workout seeds from `2026-03-16` through `2026-09-18`
- Personal-first mobile experience with local device athlete preference
- Daily checklist and point economy
- Personal and shared rewards
- Shared bonus scoring
- Katy cycle-day and readiness overlay
- Dashboard, Today, Plan, Rewards, Progress, and Settings screens

## Local-First Behavior

No sign-in is required. The app stores:

- selected athlete per device
- daily completion state
- notes and readiness data
- reward redemption history
- editable target settings

Storage lives in browser `localStorage` under `hyrox-couple-v1`.

## Key Data Files

- `data/athletes.ts`
- `data/goals.ts`
- `data/rewards.ts`
- `data/shared-rules.ts`
- `data/workouts-lawton.ts`
- `data/workouts-katy.ts`

## Commands

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```
