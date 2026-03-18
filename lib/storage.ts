import type { AthleteId, DailyCompletion, RewardRedemption, ReadinessStatus } from "@/lib/types";

export interface AppSettings {
  proteinTargets: Record<AthleteId, number>;
  hydrationTargets: Record<AthleteId, number>;
  stepTargets: Record<AthleteId, number>;
  cycle: {
    anchorDate: string;
    cycleLength: number;
  };
}

export interface PersistedState {
  preferredAthlete: AthleteId;
  completions: Record<string, DailyCompletion>;
  redemptions: RewardRedemption[];
  settings: AppSettings;
}

const STORAGE_KEY = "hyrox-couple-v1";

export function createEmptyGoals() {
  return {
    scheduled_workout_complete: false,
    eat_at_home: false,
    protein_target_hit: false,
    hydration_target_hit: false,
    mobility_complete: false,
    step_goal_hit: false
  };
}

export function createDefaultCompletion(date: string, athleteId: AthleteId): DailyCompletion {
  return {
    date,
    athleteId,
    goals: createEmptyGoals()
  };
}

export function getStorageKey(date: string, athleteId: AthleteId) {
  return `${athleteId}:${date}`;
}

export function loadState(fallback: PersistedState): PersistedState {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    return {
      preferredAthlete: parsed.preferredAthlete ?? fallback.preferredAthlete,
      completions: parsed.completions ?? fallback.completions,
      redemptions: parsed.redemptions ?? fallback.redemptions,
      settings: parsed.settings ?? fallback.settings
    };
  } catch {
    return fallback;
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function normalizeCompletion(
  existing: DailyCompletion | undefined,
  date: string,
  athleteId: AthleteId,
  readinessStatus?: ReadinessStatus
) {
  return {
    ...(existing ?? createDefaultCompletion(date, athleteId)),
    date,
    athleteId,
    goals: existing?.goals ?? createEmptyGoals(),
    readinessStatus: readinessStatus ?? existing?.readinessStatus
  };
}
