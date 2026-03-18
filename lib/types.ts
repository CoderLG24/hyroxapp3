export type AthleteId = "lawton" | "katy";

export type GoalKey =
  | "scheduled_workout_complete"
  | "eat_at_home"
  | "protein_target_hit"
  | "hydration_target_hit"
  | "mobility_complete"
  | "step_goal_hit";

export type RewardScope = "personal" | "shared";
export type ReadinessStatus = "green" | "yellow" | "red";

export interface ExerciseBlock {
  name: string;
  sets?: number;
  reps?: string;
  distance?: string;
  duration?: string;
  notes?: string;
}

export interface WorkoutDay {
  date: string;
  athleteId: AthleteId;
  title: string;
  type: "strength" | "run" | "hyrox" | "mixed" | "recovery" | "rest" | "cycle" | "race";
  description: string;
  warmup: string[];
  mainWork: ExerciseBlock[];
  conditioning: ExerciseBlock[];
  cooldown: string[];
  isRestDay: boolean;
  cycleAwareNotes?: string[];
}

export interface DailyCompletion {
  date: string;
  athleteId: AthleteId;
  goals: Record<GoalKey, boolean>;
  notes?: string;
  rpe?: number;
  soreness?: number;
  sleepHours?: number;
  readinessStatus?: ReadinessStatus;
  symptomNotes?: string;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  athleteId?: AthleteId;
  scope: RewardScope;
}

export interface AthleteProfile {
  id: AthleteId;
  name: string;
  role: string;
  accent: string;
  gradient: [string, string];
  proteinTarget: number;
  hydrationTargetOz: number;
  stepTarget: number;
}

export interface GoalDefinition {
  key: GoalKey;
  label: string;
  description: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  scope: RewardScope;
  athleteId?: AthleteId;
  redeemedOn: string;
  cost: number;
}
