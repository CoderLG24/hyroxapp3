import { describe, expect, it } from "vitest";

import {
  buildCycleClassDay,
  buildLawtonLowerStrengthRunDay,
  buildRestDay
} from "@/lib/workout-builders";

describe("workout builders", () => {
  it("builds a precise lower-strength plus aerobic day", () => {
    const workout = buildLawtonLowerStrengthRunDay({
      athleteId: "lawton",
      date: "2026-03-16",
      squatSets: 4,
      squatReps: "8",
      rdlSets: 4,
      rdlReps: "8",
      lungeSets: 3,
      lungeReps: "10/leg",
      calfRaiseSets: 3,
      calfRaiseReps: "15",
      runDuration: "20 min"
    });

    expect(workout.title).toBe("Lower Strength + Zone 2 Run");
    expect(workout.type).toBe("strength");
    expect(workout.warmup.length).toBeGreaterThan(0);
    expect(workout.mainWork).toEqual([
      { name: "Back Squat", sets: 4, reps: "8", notes: "Rest 2 min between sets" },
      { name: "Romanian Deadlift", sets: 4, reps: "8", notes: "Rest 90 sec between sets" },
      { name: "Walking Lunge", sets: 3, reps: "10/leg", notes: "Controlled steps, rest 60 sec between sets" },
      { name: "Standing Calf Raise", sets: 3, reps: "15", notes: "1 sec pause at top, rest 45 sec between sets" }
    ]);
    expect(workout.conditioning).toEqual([
      { name: "Zone 2 Run", duration: "20 min", notes: "Keep effort conversational, nasal breathing if possible" }
    ]);
    expect(workout.cooldown.length).toBeGreaterThan(0);
    expect(workout.isRestDay).toBe(false);
  });

  it("builds explicit rest and cycle class days", () => {
    const restDay = buildRestDay("2026-03-20", "katy");
    const cycleDay = buildCycleClassDay("2026-03-18", "katy");

    expect(restDay).toMatchObject({
      title: "Rest Day",
      type: "rest",
      isRestDay: true,
      mainWork: [],
      conditioning: []
    });

    expect(cycleDay).toMatchObject({
      title: "Cycle Class",
      type: "cycle",
      isRestDay: false
    });
    expect(cycleDay.mainWork).toEqual([
      { name: "Cycle Class", duration: "45-60 min", notes: "Instructor-led class with rolling hill and threshold efforts" }
    ]);
  });
});
