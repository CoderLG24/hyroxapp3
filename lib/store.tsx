"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import { athletes } from "@/data/athletes";
import { goalDefinitions } from "@/data/goals";
import { rewards } from "@/data/rewards";
import { cycleSettings, getCycleStatusForDate } from "@/lib/cycle";
import { getPlanFocusDate, getRaceCountdown } from "@/lib/dates";
import { calculateCurrentStreak } from "@/lib/streaks";
import {
  createDefaultCompletion,
  getStorageKey,
  loadState,
  normalizeCompletion,
  saveState,
  type PersistedState
} from "@/lib/storage";
import { calculateDailyPoints, calculateSharedPoints, calculateWeeklyBonuses } from "@/lib/scoring";
import type { AthleteId, DailyCompletion, GoalKey, Reward, RewardRedemption } from "@/lib/types";
import { katyWorkouts } from "@/data/workouts-katy";
import { lawtonWorkouts } from "@/data/workouts-lawton";

const workoutsByAthlete = {
  lawton: lawtonWorkouts,
  katy: katyWorkouts
};

const defaultState: PersistedState = {
  preferredAthlete: "lawton",
  completions: {},
  redemptions: [],
  settings: {
    proteinTargets: {
      lawton: athletes.find((athlete) => athlete.id === "lawton")?.proteinTarget ?? 190,
      katy: athletes.find((athlete) => athlete.id === "katy")?.proteinTarget ?? 150
    },
    hydrationTargets: {
      lawton: athletes.find((athlete) => athlete.id === "lawton")?.hydrationTargetOz ?? 110,
      katy: athletes.find((athlete) => athlete.id === "katy")?.hydrationTargetOz ?? 96
    },
    stepTargets: {
      lawton: athletes.find((athlete) => athlete.id === "lawton")?.stepTarget ?? 10000,
      katy: athletes.find((athlete) => athlete.id === "katy")?.stepTarget ?? 10000
    },
    cycle: cycleSettings
  }
};

interface AppStoreValue {
  athleteId: AthleteId;
  setAthleteId: (athleteId: AthleteId) => void;
  focusDate: string;
  setFocusDate: (date: string) => void;
  todayWorkout: ReturnType<typeof getWorkoutForDate>;
  partnerWorkout: ReturnType<typeof getWorkoutForDate>;
  completion: DailyCompletion;
  partnerCompletion: DailyCompletion;
  toggleGoal: (goal: GoalKey, athleteId?: AthleteId, date?: string) => void;
  updateCompletionMeta: (patch: Partial<DailyCompletion>, athleteId?: AthleteId, date?: string) => void;
  dailyPoints: number;
  partnerDailyPoints: number;
  streak: number;
  partnerStreak: number;
  personalPoints: number;
  partnerPoints: number;
  sharedPoints: number;
  personalRewards: Reward[];
  partnerRewards: Reward[];
  sharedRewards: Reward[];
  redemptions: RewardRedemption[];
  redeemReward: (reward: Reward) => void;
  settings: PersistedState["settings"];
  updateSetting: (kind: "proteinTargets" | "hydrationTargets" | "stepTargets", athleteId: AthleteId, value: number) => void;
  cycleStatus: ReturnType<typeof getCycleStatusForDate>;
  countdownDays: number;
  workouts: typeof lawtonWorkouts;
  partnerWorkouts: typeof katyWorkouts;
  weeklyBonuses: ReturnType<typeof calculateWeeklyBonuses>;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function getWorkoutForDate(athleteId: AthleteId, date: string) {
  return workoutsByAthlete[athleteId].find((workout) => workout.date === date) ?? workoutsByAthlete[athleteId][0];
}

function getCompletionFromState(completions: PersistedState["completions"], athleteId: AthleteId, date: string) {
  return completions[getStorageKey(date, athleteId)] ?? createDefaultCompletion(date, athleteId);
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [focusDate, setFocusDate] = useState(getPlanFocusDate());

  useEffect(() => {
    setState(loadState(defaultState));
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const athleteId = state.preferredAthlete;
  const partnerId: AthleteId = athleteId === "lawton" ? "katy" : "lawton";

  const todayWorkout = getWorkoutForDate(athleteId, focusDate);
  const partnerWorkout = getWorkoutForDate(partnerId, focusDate);
  const completion = getCompletionFromState(state.completions, athleteId, focusDate);
  const partnerCompletion = getCompletionFromState(state.completions, partnerId, focusDate);

  const allCompletions = useMemo(() => Object.values(state.completions), [state.completions]);
  const athleteCompletions = allCompletions.filter((entry) => entry.athleteId === athleteId);
  const partnerCompletions = allCompletions.filter((entry) => entry.athleteId === partnerId);

  const personalPoints = athleteCompletions.reduce((total, item) => total + calculateDailyPoints(item), 0);
  const partnerPoints = partnerCompletions.reduce((total, item) => total + calculateDailyPoints(item), 0);

  const sharedPairs = lawtonWorkouts.map((workout) => ({
    lawton: getCompletionFromState(state.completions, "lawton", workout.date),
    katy: getCompletionFromState(state.completions, "katy", workout.date)
  }));
  const sharedPointSummary = calculateSharedPoints(sharedPairs);
  const sharedPoints = sharedPointSummary.total - state.redemptions.filter((reward) => reward.scope === "shared").reduce((total, item) => total + item.cost, 0);
  const countdownDays = getRaceCountdown();

  const weeklyWindow = workoutsByAthlete[athleteId]
    .filter((workout) => workout.date <= focusDate)
    .slice(-7)
    .map((workout) => getCompletionFromState(state.completions, athleteId, workout.date));

  const streak = calculateCurrentStreak(athleteCompletions);
  const partnerStreak = calculateCurrentStreak(partnerCompletions);

  const value = useMemo<AppStoreValue>(
    () => ({
      athleteId,
      setAthleteId: (nextAthleteId) => setState((current) => ({ ...current, preferredAthlete: nextAthleteId })),
      focusDate,
      setFocusDate,
      todayWorkout,
      partnerWorkout,
      completion,
      partnerCompletion,
      toggleGoal: (goal, targetAthlete = athleteId, targetDate = focusDate) => {
        setState((current) => {
          const key = getStorageKey(targetDate, targetAthlete);
          const existing = current.completions[key];
          const normalized = normalizeCompletion(existing, targetDate, targetAthlete);

          return {
            ...current,
            completions: {
              ...current.completions,
              [key]: {
                ...normalized,
                goals: {
                  ...normalized.goals,
                  [goal]: !normalized.goals[goal]
                }
              }
            }
          };
        });
      },
      updateCompletionMeta: (patch, targetAthlete = athleteId, targetDate = focusDate) => {
        setState((current) => {
          const key = getStorageKey(targetDate, targetAthlete);
          const existing = current.completions[key];
          const normalized = normalizeCompletion(existing, targetDate, targetAthlete, patch.readinessStatus);

          return {
            ...current,
            completions: {
              ...current.completions,
              [key]: {
                ...normalized,
                ...patch
              }
            }
          };
        });
      },
      dailyPoints: calculateDailyPoints(completion),
      partnerDailyPoints: calculateDailyPoints(partnerCompletion),
      streak,
      partnerStreak,
      personalPoints:
        personalPoints -
        state.redemptions
          .filter((reward) => reward.scope === "personal" && reward.athleteId === athleteId)
          .reduce((total, item) => total + item.cost, 0),
      partnerPoints:
        partnerPoints -
        state.redemptions
          .filter((reward) => reward.scope === "personal" && reward.athleteId === partnerId)
          .reduce((total, item) => total + item.cost, 0),
      sharedPoints,
      personalRewards: rewards.filter((reward) => reward.scope === "personal" && reward.athleteId === athleteId),
      partnerRewards: rewards.filter((reward) => reward.scope === "personal" && reward.athleteId === partnerId),
      sharedRewards: rewards.filter((reward) => reward.scope === "shared"),
      redemptions: state.redemptions,
      redeemReward: (reward) => {
        setState((current) => ({
          ...current,
          redemptions: [
            {
              id: `${reward.id}-${Date.now()}`,
              rewardId: reward.id,
              scope: reward.scope,
              athleteId: reward.athleteId,
              redeemedOn: new Date().toISOString(),
              cost: reward.cost
            },
            ...current.redemptions
          ]
        }));
      },
      settings: state.settings,
      updateSetting: (kind, targetAthlete, value) => {
        setState((current) => ({
          ...current,
          settings: {
            ...current.settings,
            [kind]: {
              ...current.settings[kind],
              [targetAthlete]: value
            }
          }
        }));
      },
      cycleStatus: getCycleStatusForDate(focusDate),
      countdownDays,
      workouts: workoutsByAthlete[athleteId],
      partnerWorkouts: workoutsByAthlete[partnerId],
      weeklyBonuses: calculateWeeklyBonuses(weeklyWindow)
    }),
    [
      athleteId,
      completion,
      countdownDays,
      focusDate,
      partnerCompletion,
      partnerId,
      partnerPoints,
      partnerStreak,
      personalPoints,
      sharedPoints,
      state.redemptions,
      state.settings,
      streak,
      todayWorkout,
      partnerWorkout,
      weeklyWindow
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }

  return context;
}

export { goalDefinitions };
