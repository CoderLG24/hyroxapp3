import { describe, expect, it } from "vitest";

import { athletes } from "@/data/athletes";
import { goalDefinitions } from "@/data/goals";
import { rewards } from "@/data/rewards";
import { dailyPointRules, sharedBonusRules, weeklyBonusRules } from "@/data/shared-rules";
import type { AthleteId, GoalKey, Reward } from "@/lib/types";

describe("domain seeds", () => {
  it("defines both athletes with stable ids", () => {
    const athleteIds = athletes.map((athlete) => athlete.id);

    expect(athleteIds).toEqual<AthleteId[]>(["lawton", "katy"]);
  });

  it("defines the six daily checklist goals", () => {
    const goalKeys = goalDefinitions.map((goal) => goal.key);

    expect(goalKeys).toEqual<GoalKey[]>([
      "scheduled_workout_complete",
      "eat_at_home",
      "protein_target_hit",
      "hydration_target_hit",
      "mobility_complete",
      "step_goal_hit"
    ]);
  });

  it("defines personal and shared reward catalogs", () => {
    const personalRewards = rewards.filter((reward) => reward.scope === "personal");
    const sharedRewards = rewards.filter((reward) => reward.scope === "shared");

    expect(personalRewards.some((reward) => reward.athleteId === "lawton")).toBe(true);
    expect(personalRewards.some((reward) => reward.athleteId === "katy")).toBe(true);
    expect(sharedRewards).toHaveLength(5);
  });

  it("includes the exact scoring rules from the specification", () => {
    expect(dailyPointRules).toEqual({
      scheduled_workout_complete: 20,
      eat_at_home: 10,
      protein_target_hit: 8,
      hydration_target_hit: 4,
      mobility_complete: 4,
      step_goal_hit: 4
    });

    expect(weeklyBonusRules).toEqual({
      five_plus_workouts: 20,
      five_plus_eat_at_home_days: 10,
      four_plus_protein_days: 10,
      five_plus_strong_days: 15
    });

    expect(sharedBonusRules).toEqual({
      both_complete_workout_same_day: 10,
      both_complete_perfect_day_same_day: 15,
      both_hit_full_training_week: 25
    });
  });

  it("keeps every reward fully typed and scoped", () => {
    expect(rewards.every((reward: Reward) => typeof reward.id === "string")).toBe(true);
    expect(rewards.every((reward: Reward) => reward.cost > 0)).toBe(true);
    expect(rewards.every((reward: Reward) => reward.scope === "shared" || reward.athleteId)).toBe(true);
  });
});
