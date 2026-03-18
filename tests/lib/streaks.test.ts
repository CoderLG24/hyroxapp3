import { describe, expect, it } from "vitest";

import type { DailyCompletion } from "@/lib/types";
import { calculateCurrentStreak } from "@/lib/streaks";

const makeDay = (date: string, complete = true): DailyCompletion => ({
  date,
  athleteId: "lawton",
  goals: {
    scheduled_workout_complete: complete,
    eat_at_home: complete,
    protein_target_hit: complete,
    hydration_target_hit: complete,
    mobility_complete: complete,
    step_goal_hit: complete
  }
});

describe("streaks", () => {
  it("counts consecutive days from the latest completion backward", () => {
    expect(
      calculateCurrentStreak([
        makeDay("2026-03-16"),
        makeDay("2026-03-17"),
        makeDay("2026-03-18")
      ])
    ).toBe(3);
  });

  it("breaks the streak at the first incomplete day", () => {
    expect(
      calculateCurrentStreak([
        makeDay("2026-03-16"),
        makeDay("2026-03-17", false),
        makeDay("2026-03-18")
      ])
    ).toBe(1);
  });
});
