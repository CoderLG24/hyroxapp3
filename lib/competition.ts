import { endOfWeek, parseISO, startOfWeek } from "date-fns";

import { calculateDailyPoints, isPerfectDay } from "@/lib/scoring";
import { calculateCurrentStreak } from "@/lib/streaks";
import type { AthleteId, DailyCompletion } from "@/lib/types";

export interface CompetitionStats {
  athleteId: AthleteId;
  points: number;
  workouts: number;
  perfectDays: number;
  proteinDays: number;
  stepDays: number;
  streak: number;
}

export interface CompetitionCategory {
  key: "points" | "workouts" | "perfectDays" | "proteinDays" | "stepDays";
  label: string;
  lawton: number;
  katy: number;
  leader: AthleteId | "tie";
}

export interface FriendlyCompetitionSummary {
  weekLabel: string;
  lawton: CompetitionStats;
  katy: CompetitionStats;
  categories: CompetitionCategory[];
  leadCount: {
    lawton: number;
    katy: number;
  };
  momentumMessage: string;
}

function buildStats(athleteId: AthleteId, completions: DailyCompletion[]): CompetitionStats {
  return {
    athleteId,
    points: completions.reduce((sum, completion) => sum + calculateDailyPoints(completion), 0),
    workouts: completions.filter((completion) => completion.goals.scheduled_workout_complete).length,
    perfectDays: completions.filter((completion) => isPerfectDay(completion)).length,
    proteinDays: completions.filter((completion) => completion.goals.protein_target_hit).length,
    stepDays: completions.filter((completion) => completion.goals.step_goal_hit).length,
    streak: calculateCurrentStreak(completions)
  };
}

function getLeader(lawton: number, katy: number): AthleteId | "tie" {
  if (lawton === katy) {
    return "tie";
  }

  return lawton > katy ? "lawton" : "katy";
}

function getMomentumMessage(lawtonLeads: number, katyLeads: number) {
  if (lawtonLeads === katyLeads) {
    return "Neck and neck this week. Shared consistency is doing its job.";
  }

  if (lawtonLeads > katyLeads) {
    return "Lawton has the slight edge this week, but the race is still close.";
  }

  return "Katy has the slight edge this week, but the race is still close.";
}

export function calculateFriendlyCompetition(
  allCompletions: DailyCompletion[],
  currentDate: string
): FriendlyCompetitionSummary {
  const referenceDate = parseISO(currentDate);
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });

  const weeklyCompletions = allCompletions.filter((completion) => {
    const date = parseISO(completion.date);
    return date >= weekStart && date <= weekEnd;
  });

  const lawtonCompletions = weeklyCompletions.filter((completion) => completion.athleteId === "lawton");
  const katyCompletions = weeklyCompletions.filter((completion) => completion.athleteId === "katy");

  const lawton = buildStats("lawton", lawtonCompletions);
  const katy = buildStats("katy", katyCompletions);

  const categories: CompetitionCategory[] = [
    { key: "points", label: "Points", lawton: lawton.points, katy: katy.points, leader: getLeader(lawton.points, katy.points) },
    { key: "workouts", label: "Workouts", lawton: lawton.workouts, katy: katy.workouts, leader: getLeader(lawton.workouts, katy.workouts) },
    { key: "perfectDays", label: "Perfect days", lawton: lawton.perfectDays, katy: katy.perfectDays, leader: getLeader(lawton.perfectDays, katy.perfectDays) },
    { key: "proteinDays", label: "Protein days", lawton: lawton.proteinDays, katy: katy.proteinDays, leader: getLeader(lawton.proteinDays, katy.proteinDays) },
    { key: "stepDays", label: "Step days", lawton: lawton.stepDays, katy: katy.stepDays, leader: getLeader(lawton.stepDays, katy.stepDays) }
  ];

  const leadCount = categories.reduce(
    (result, category) => {
      if (category.leader === "lawton") {
        result.lawton += 1;
      }
      if (category.leader === "katy") {
        result.katy += 1;
      }
      return result;
    },
    { lawton: 0, katy: 0 }
  );

  return {
    weekLabel: `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    lawton,
    katy,
    categories,
    leadCount,
    momentumMessage: getMomentumMessage(leadCount.lawton, leadCount.katy)
  };
}
