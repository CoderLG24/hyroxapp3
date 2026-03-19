import { describe, expect, it } from "vitest";

import type { PersistedState } from "@/lib/storage";
import {
  completionToRow,
  redemptionToRow,
  rowToCompletion,
  rowToRedemption,
  rowToSettings,
  settingsToRow
} from "@/lib/supabase/mappers";
import type { DailyCompletion, RewardRedemption } from "@/lib/types";

describe("supabase mappers", () => {
  it("round-trips completions between app and database shapes", () => {
    const completion: DailyCompletion = {
      date: "2026-03-17",
      athleteId: "lawton",
      goals: {
        scheduled_workout_complete: true,
        eat_at_home: false,
        protein_target_hit: true,
        hydration_target_hit: false,
        mobility_complete: true,
        step_goal_hit: true
      },
      notes: "Solid session",
      rpe: 7,
      soreness: 3,
      sleepHours: 7.5,
      readinessStatus: "green",
      symptomNotes: "None"
    };

    const row = completionToRow("house-1", completion);

    expect(rowToCompletion({
      ...row,
      updated_at: "2026-03-17T10:00:00Z"
    })).toEqual(completion);
  });

  it("round-trips settings between app and database shapes", () => {
    const settings: PersistedState["settings"] = {
      proteinTargets: { lawton: 190, katy: 150 },
      hydrationTargets: { lawton: 110, katy: 96 },
      stepTargets: { lawton: 10000, katy: 10000 },
      cycle: { anchorDate: "2026-03-31", cycleLength: 29 }
    };

    const row = settingsToRow("house-1", settings);

    expect(rowToSettings({
      ...row,
      updated_at: "2026-03-17T10:00:00Z"
    })).toEqual(settings);
  });

  it("round-trips reward redemptions between app and database shapes", () => {
    const redemption: RewardRedemption = {
      id: "reward-1",
      rewardId: "shared-dinner",
      scope: "shared",
      redeemedOn: "2026-03-17T10:00:00Z",
      cost: 1200
    };

    const row = redemptionToRow("house-1", redemption);

    expect(rowToRedemption(row)).toEqual(redemption);
  });
});
