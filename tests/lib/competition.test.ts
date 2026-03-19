import { describe, expect, it } from "vitest";

import { calculateFriendlyCompetition } from "@/lib/competition";
import type { DailyCompletion } from "@/lib/types";

function completion(
  athleteId: "lawton" | "katy",
  date: string,
  goals: Partial<DailyCompletion["goals"]>
): DailyCompletion {
  return {
    athleteId,
    date,
    goals: {
      scheduled_workout_complete: false,
      eat_at_home: false,
      protein_target_hit: false,
      hydration_target_hit: false,
      mobility_complete: false,
      step_goal_hit: false,
      ...goals
    }
  };
}

describe("competition", () => {
  it("builds a weekly friendly competition summary with category leaders", () => {
    const summary = calculateFriendlyCompetition(
      [
        completion("lawton", "2026-03-16", {
          scheduled_workout_complete: true,
          protein_target_hit: true,
          step_goal_hit: true
        }),
        completion("lawton", "2026-03-17", {
          scheduled_workout_complete: true,
          eat_at_home: true,
          protein_target_hit: true,
          hydration_target_hit: true,
          mobility_complete: true,
          step_goal_hit: true
        }),
        completion("katy", "2026-03-16", {
          scheduled_workout_complete: true
        }),
        completion("katy", "2026-03-17", {
          protein_target_hit: true,
          step_goal_hit: true
        })
      ],
      "2026-03-18"
    );

    expect(summary.categories).toHaveLength(5);
    expect(summary.lawton.points).toBeGreaterThan(summary.katy.points);
    expect(summary.leadCount.lawton).toBeGreaterThan(0);
    expect(summary.momentumMessage).toMatch(/edge|neck and neck/i);
  });
});
