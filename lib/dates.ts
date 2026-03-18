import { differenceInCalendarDays, format, isAfter, isBefore } from "date-fns";

const planStart = new Date("2026-03-16T12:00:00Z");
const planEnd = new Date("2026-09-18T12:00:00Z");
const raceDate = new Date("2026-09-18T12:00:00Z");

export function getPlanFocusDate(now = new Date()) {
  if (isBefore(now, planStart)) {
    return "2026-03-16";
  }

  if (isAfter(now, planEnd)) {
    return "2026-09-18";
  }

  return format(now, "yyyy-MM-dd");
}

export function getRaceCountdown(now = new Date()) {
  return Math.max(differenceInCalendarDays(raceDate, now), 0);
}
