import { addDays, differenceInCalendarDays } from "date-fns";
import { describe, expect, it } from "vitest";

import { lawtonWorkouts } from "@/data/workouts-lawton";
import { katyWorkouts } from "@/data/workouts-katy";

const startDate = new Date("2026-03-16");
const endDate = new Date("2026-09-18");

function getExpectedDates() {
  const totalDays = differenceInCalendarDays(endDate, startDate);

  return Array.from({ length: totalDays + 1 }, (_, index) =>
    addDays(startDate, index).toISOString().slice(0, 10)
  );
}

describe("workout seeds", () => {
  it("covers every date in the plan window for both athletes", () => {
    const expectedDates = getExpectedDates();

    expect(lawtonWorkouts.map((workout) => workout.date)).toEqual(expectedDates);
    expect(katyWorkouts.map((workout) => workout.date)).toEqual(expectedDates);
  });

  it("keeps every Friday as rest for both athletes", () => {
    expect(
      lawtonWorkouts
        .filter((workout) => new Date(workout.date).getUTCDay() === 5 && workout.date !== "2026-09-18")
        .every((workout) => workout.type === "rest")
    ).toBe(true);
    expect(
      katyWorkouts
        .filter((workout) => new Date(workout.date).getUTCDay() === 5 && workout.date !== "2026-09-18")
        .every((workout) => workout.type === "rest")
    ).toBe(true);
  });

  it("keeps Katy on cycle class every Wednesday and Saturday except explicit taper flexibility messaging", () => {
    const katyCycleDays = katyWorkouts.filter((workout) => {
      const day = new Date(workout.date).getUTCDay();
      return day === 3 || day === 6;
    });

    expect(
      katyCycleDays.every((workout) => workout.type === "cycle")
    ).toBe(true);
    expect(katyWorkouts.find((workout) => workout.date === "2026-09-16")?.description).toContain(
      "taper adjustment"
    );
  });

  it("stores every day as a full explicit workout object", () => {
    for (const workout of [...lawtonWorkouts, ...katyWorkouts]) {
      expect(workout.title.length).toBeGreaterThan(0);
      expect(workout.description.length).toBeGreaterThan(0);
      expect(Array.isArray(workout.warmup)).toBe(true);
      expect(Array.isArray(workout.mainWork)).toBe(true);
      expect(Array.isArray(workout.conditioning)).toBe(true);
      expect(Array.isArray(workout.cooldown)).toBe(true);
    }
  });

  it("captures race day explicitly for both athletes", () => {
    expect(lawtonWorkouts.at(-1)).toMatchObject({
      date: "2026-09-18",
      title: "Race Day",
      type: "race"
    });
    expect(katyWorkouts.at(-1)).toMatchObject({
      date: "2026-09-18",
      title: "Race Day",
      type: "race"
    });
  });
});
