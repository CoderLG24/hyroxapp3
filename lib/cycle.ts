import { differenceInCalendarDays } from "date-fns";

import type { ReadinessStatus } from "@/lib/types";

const CYCLE_ANCHOR = new Date("2026-03-31T12:00:00Z");
const CYCLE_LENGTH = 29;

export function getCycleDay(date: string) {
  const current = new Date(`${date}T12:00:00Z`);
  const offset = differenceInCalendarDays(current, CYCLE_ANCHOR);
  const normalized = ((offset % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;

  return normalized + 1;
}

export function getCycleStatusForDate(date: string): {
  cycleDay: number;
  status: ReadinessStatus;
  guidance: string;
} {
  const cycleDay = getCycleDay(date);

  if (cycleDay <= 2) {
    return {
      cycleDay,
      status: "red",
      guidance: "Switch to easy aerobic work, upper body, mobility, or rest if symptoms are high."
    };
  }

  if (cycleDay <= 7) {
    return {
      cycleDay,
      status: "yellow",
      guidance: "Reduce volume 15-25% or trade intervals for steady tempo work if needed."
    };
  }

  return {
    cycleDay,
    status: "green",
    guidance: "Run the workout as written if symptoms feel manageable."
  };
}

export const cycleSettings = {
  anchorDate: "2026-03-31",
  cycleLength: CYCLE_LENGTH
};
