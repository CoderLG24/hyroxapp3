import { dailyPointRules, perfectDayPoints, sharedBonusRules, weeklyBonusRules } from "@/data/shared-rules";
import type { DailyCompletion } from "@/lib/types";

export function calculateDailyPoints(completion: DailyCompletion) {
  return Object.entries(completion.goals).reduce((total, [goal, isComplete]) => {
    if (!isComplete) {
      return total;
    }

    return total + dailyPointRules[goal as keyof typeof dailyPointRules];
  }, 0);
}

export function isPerfectDay(completion: DailyCompletion) {
  return calculateDailyPoints(completion) === perfectDayPoints;
}

export function calculateWeeklyBonuses(completions: DailyCompletion[]) {
  const workoutDays = completions.filter((completion) => completion.goals.scheduled_workout_complete).length;
  const eatDays = completions.filter((completion) => completion.goals.eat_at_home).length;
  const proteinDays = completions.filter((completion) => completion.goals.protein_target_hit).length;
  const strongDays = completions.filter((completion) => calculateDailyPoints(completion) >= 40).length;

  const result = {
    five_plus_workouts: workoutDays >= 5 ? weeklyBonusRules.five_plus_workouts : 0,
    five_plus_eat_at_home_days: eatDays >= 5 ? weeklyBonusRules.five_plus_eat_at_home_days : 0,
    four_plus_protein_days: proteinDays >= 4 ? weeklyBonusRules.four_plus_protein_days : 0,
    five_plus_strong_days: strongDays >= 5 ? weeklyBonusRules.five_plus_strong_days : 0,
    total: 0
  };

  result.total =
    result.five_plus_workouts +
    result.five_plus_eat_at_home_days +
    result.four_plus_protein_days +
    result.five_plus_strong_days;

  return result;
}

export function calculateSharedPoints(
  pairedDays: Array<{
    lawton: DailyCompletion;
    katy: DailyCompletion;
  }>
) {
  const workoutDays = pairedDays.filter(
    (entry) =>
      entry.lawton.goals.scheduled_workout_complete &&
      entry.katy.goals.scheduled_workout_complete
  ).length;

  const perfectDays = pairedDays.filter(
    (entry) => isPerfectDay(entry.lawton) && isPerfectDay(entry.katy)
  ).length;

  const fullTrainingWeek =
    workoutDays >= 5 ? sharedBonusRules.both_hit_full_training_week : 0;

  return {
    both_complete_workout_same_day:
      workoutDays * sharedBonusRules.both_complete_workout_same_day,
    both_complete_perfect_day_same_day:
      perfectDays * sharedBonusRules.both_complete_perfect_day_same_day,
    both_hit_full_training_week: fullTrainingWeek,
    total:
      workoutDays * sharedBonusRules.both_complete_workout_same_day +
      perfectDays * sharedBonusRules.both_complete_perfect_day_same_day +
      fullTrainingWeek
  };
}
