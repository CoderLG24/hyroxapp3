import { describe, expect, it } from "vitest";

import { applyProgressReset, type PersistedState } from "@/lib/storage";

describe("applyProgressReset", () => {
  it("clears completions and redemptions on or after the reset date while preserving older history", () => {
    const state: PersistedState = {
      preferredAthlete: "lawton",
      completions: {
        "lawton:2026-05-01": {
          date: "2026-05-01",
          athleteId: "lawton",
          goals: {
            scheduled_workout_complete: true,
            eat_at_home: true,
            protein_target_hit: true,
            hydration_target_hit: true,
            mobility_complete: false,
            step_goal_hit: false
          }
        },
        "lawton:2026-05-02": {
          date: "2026-05-02",
          athleteId: "lawton",
          goals: {
            scheduled_workout_complete: true,
            eat_at_home: false,
            protein_target_hit: false,
            hydration_target_hit: false,
            mobility_complete: false,
            step_goal_hit: false
          }
        }
      },
      redemptions: [
        {
          id: "before-reset",
          rewardId: "shared-date-night",
          scope: "shared",
          redeemedOn: "2026-05-01T16:00:00.000Z",
          cost: 200
        },
        {
          id: "after-reset",
          rewardId: "lawton-steak",
          scope: "personal",
          athleteId: "lawton",
          redeemedOn: "2026-05-02T16:00:00.000Z",
          cost: 120
        }
      ],
      settings: {
        proteinTargets: { lawton: 190, katy: 150 },
        hydrationTargets: { lawton: 110, katy: 96 },
        stepTargets: { lawton: 10000, katy: 10000 },
        cycle: {
          anchorDate: "2026-03-16",
          cycleLength: 28
        }
      }
    };

    const nextState = applyProgressReset(state, {
      resetDate: "2026-05-02",
      resetKey: "restart-2026-05-02"
    });

    expect(nextState.completions).toEqual({
      "lawton:2026-05-01": state.completions["lawton:2026-05-01"]
    });
    expect(nextState.redemptions).toEqual([state.redemptions[0]]);
    expect(nextState.appliedResetKeys).toEqual(["restart-2026-05-02"]);
    expect(nextState.settings).toEqual(state.settings);
    expect(nextState.preferredAthlete).toBe("lawton");
  });

  it("preserves later logged days instead of wiping them on first launch after the reset date", () => {
    const state: PersistedState = {
      preferredAthlete: "lawton",
      completions: {
        "lawton:2026-05-03": {
          date: "2026-05-03",
          athleteId: "lawton",
          goals: {
            scheduled_workout_complete: true,
            eat_at_home: true,
            protein_target_hit: true,
            hydration_target_hit: false,
            mobility_complete: false,
            step_goal_hit: false
          }
        }
      },
      redemptions: [],
      settings: {
        proteinTargets: { lawton: 190, katy: 150 },
        hydrationTargets: { lawton: 110, katy: 96 },
        stepTargets: { lawton: 10000, katy: 10000 },
        cycle: {
          anchorDate: "2026-03-16",
          cycleLength: 28
        }
      }
    };

    const nextState = applyProgressReset(state, {
      resetDate: "2026-05-02",
      resetKey: "restart-2026-05-02"
    });

    expect(nextState.completions).toEqual(state.completions);
    expect(nextState.redemptions).toEqual(state.redemptions);
    expect(nextState.appliedResetKeys).toEqual(["restart-2026-05-02"]);
  });

  it("does nothing when the reset key has already been applied", () => {
    const state = {
      preferredAthlete: "katy",
      completions: {
        "katy:2026-05-04": {
          date: "2026-05-04",
          athleteId: "katy",
          goals: {
            scheduled_workout_complete: true,
            eat_at_home: false,
            protein_target_hit: true,
            hydration_target_hit: true,
            mobility_complete: true,
            step_goal_hit: true
          }
        }
      },
      redemptions: [],
      settings: {
        proteinTargets: { lawton: 190, katy: 150 },
        hydrationTargets: { lawton: 110, katy: 96 },
        stepTargets: { lawton: 10000, katy: 10000 },
        cycle: {
          anchorDate: "2026-03-16",
          cycleLength: 28
        }
      },
      appliedResetKeys: ["restart-2026-05-02"]
    } satisfies PersistedState;

    const nextState = applyProgressReset(state, {
      resetDate: "2026-05-02",
      resetKey: "restart-2026-05-02"
    });

    expect(nextState).toEqual(state);
  });
});
