create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Hyrox Household',
  join_code text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.household_settings (
  household_id uuid primary key references public.households(id) on delete cascade,
  protein_targets jsonb not null,
  hydration_targets jsonb not null,
  step_targets jsonb not null,
  cycle_anchor_date date not null,
  cycle_length integer not null check (cycle_length > 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.daily_completions (
  household_id uuid not null references public.households(id) on delete cascade,
  athlete_id text not null check (athlete_id in ('lawton', 'katy')),
  date date not null,
  goals jsonb not null,
  notes text,
  rpe smallint,
  soreness smallint,
  sleep_hours numeric(4,2),
  readiness_status text check (readiness_status in ('green', 'yellow', 'red')),
  symptom_notes text,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (household_id, athlete_id, date)
);

create table if not exists public.reward_redemptions (
  id text primary key,
  household_id uuid not null references public.households(id) on delete cascade,
  reward_id text not null,
  scope text not null check (scope in ('personal', 'shared')),
  athlete_id text check (athlete_id in ('lawton', 'katy')),
  redeemed_on timestamptz not null,
  cost integer not null check (cost >= 0)
);

create index if not exists idx_daily_completions_household_date
  on public.daily_completions (household_id, date);

create index if not exists idx_reward_redemptions_household_redeemed_on
  on public.reward_redemptions (household_id, redeemed_on desc);

alter table public.households enable row level security;
alter table public.household_settings enable row level security;
alter table public.daily_completions enable row level security;
alter table public.reward_redemptions enable row level security;
