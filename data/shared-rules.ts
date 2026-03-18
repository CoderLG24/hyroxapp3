import type { GoalKey } from "@/lib/types";

export const dailyPointRules: Record<GoalKey, number> = {
  scheduled_workout_complete: 20,
  eat_at_home: 10,
  protein_target_hit: 8,
  hydration_target_hit: 4,
  mobility_complete: 4,
  step_goal_hit: 4
};

export const weeklyBonusRules = {
  five_plus_workouts: 20,
  five_plus_eat_at_home_days: 10,
  four_plus_protein_days: 10,
  five_plus_strong_days: 15
} as const;

export const sharedBonusRules = {
  both_complete_workout_same_day: 10,
  both_complete_perfect_day_same_day: 15,
  both_hit_full_training_week: 25
} as const;

export const perfectDayPoints = 50;

export const raceDate = "2026-09-18";
