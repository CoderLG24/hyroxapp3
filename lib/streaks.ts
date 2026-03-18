import type { DailyCompletion } from "@/lib/types";
import { isPerfectDay } from "@/lib/scoring";

export function calculateCurrentStreak(completions: DailyCompletion[]) {
  const ordered = [...completions].sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0;

  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (!isPerfectDay(ordered[index])) {
      break;
    }

    streak += 1;
  }

  return streak;
}
