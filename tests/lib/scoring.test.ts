import { describe, expect, it } from "vitest";

import type { DailyCompletion } from "@/lib/types";
import {
  calculateDailyPoints,
  calculateSharedPoints,
  calculateWeeklyBonuses,
  isPerfectDay
} from "@/lib/scoring";

const day: DailyCompletion = {
  date: "2026-03-16",
  athleteId: "lawton",
  goals: {
    scheduled_workout_complete: true,
    eat_at_home: true,
    protein_target_hit: true,
    hydration_target_hit: true,
    mobility_complete: true,
    step_goal_hit: true
  }
};

describe("scoring", () => {
  it("totals daily points correctly", () => {
    expect(calculateDailyPoints(day)).toBe(50);
    expect(isPerfectDay(day)).toBe(true);
  });

  it("computes weekly bonuses from aggregated completions", () => {
    const completions = Array.from({ length: 5 }, (_, index) => ({
      ...day,
      date: `2026-03-${String(16 + index).padStart(2, "0")}`
    }));

    expect(calculateWeeklyBonuses(completions)).toEqual({
      five_plus_workouts: 20,
      five_plus_eat_at_home_days: 10,
      four_plus_protein_days: 10,
      five_plus_strong_days: 15,
      total: 55
    });
  });

  it("computes same-day and full-week shared bonuses", () => {
    const week = Array.from({ length: 5 }, (_, index) => ({
      lawton: {
        ...day,
        date: `2026-03-${String(16 + index).padStart(2, "0")}`,
        athleteId: "lawton" as const
      },
      katy: {
        ...day,
        date: `2026-03-${String(16 + index).padStart(2, "0")}`,
        athleteId: "katy" as const
      }
    }));

    expect(calculateSharedPoints(week)).toEqual({
      both_complete_workout_same_day: 50,
      both_complete_perfect_day_same_day: 75,
      both_hit_full_training_week: 25,
      total: 150
    });
  });
});
