import type { PersistedState } from "@/lib/storage";
import type { Database } from "@/lib/supabase/database.types";
import type { DailyCompletion, RewardRedemption } from "@/lib/types";

type CompletionRow = Database["public"]["Tables"]["daily_completions"]["Row"];
type SettingsRow = Database["public"]["Tables"]["household_settings"]["Row"];
type RedemptionRow = Database["public"]["Tables"]["reward_redemptions"]["Row"];

export function completionToRow(
  householdId: string,
  completion: DailyCompletion
): Database["public"]["Tables"]["daily_completions"]["Insert"] {
  return {
    household_id: householdId,
    date: completion.date,
    athlete_id: completion.athleteId,
    goals: completion.goals,
    notes: completion.notes ?? null,
    rpe: completion.rpe ?? null,
    soreness: completion.soreness ?? null,
    sleep_hours: completion.sleepHours ?? null,
    readiness_status: completion.readinessStatus ?? null,
    symptom_notes: completion.symptomNotes ?? null,
    updated_at: new Date().toISOString()
  };
}

export function rowToCompletion(row: CompletionRow): DailyCompletion {
  return {
    date: row.date,
    athleteId: row.athlete_id,
    goals: row.goals as DailyCompletion["goals"],
    notes: row.notes ?? undefined,
    rpe: row.rpe ?? undefined,
    soreness: row.soreness ?? undefined,
    sleepHours: row.sleep_hours ?? undefined,
    readinessStatus: row.readiness_status ?? undefined,
    symptomNotes: row.symptom_notes ?? undefined
  };
}

export function settingsToRow(
  householdId: string,
  settings: PersistedState["settings"]
): Database["public"]["Tables"]["household_settings"]["Insert"] {
  return {
    household_id: householdId,
    protein_targets: settings.proteinTargets,
    hydration_targets: settings.hydrationTargets,
    step_targets: settings.stepTargets,
    cycle_anchor_date: settings.cycle.anchorDate,
    cycle_length: settings.cycle.cycleLength,
    updated_at: new Date().toISOString()
  };
}

export function rowToSettings(row: SettingsRow): PersistedState["settings"] {
  return {
    proteinTargets: row.protein_targets as PersistedState["settings"]["proteinTargets"],
    hydrationTargets: row.hydration_targets as PersistedState["settings"]["hydrationTargets"],
    stepTargets: row.step_targets as PersistedState["settings"]["stepTargets"],
    cycle: {
      anchorDate: row.cycle_anchor_date,
      cycleLength: row.cycle_length
    }
  };
}

export function redemptionToRow(
  householdId: string,
  redemption: RewardRedemption
): Database["public"]["Tables"]["reward_redemptions"]["Insert"] {
  return {
    id: redemption.id,
    household_id: householdId,
    reward_id: redemption.rewardId,
    scope: redemption.scope,
    athlete_id: redemption.athleteId ?? null,
    redeemed_on: redemption.redeemedOn,
    cost: redemption.cost
  };
}

export function rowToRedemption(row: RedemptionRow): RewardRedemption {
  return {
    id: row.id,
    rewardId: row.reward_id,
    scope: row.scope,
    athleteId: row.athlete_id ?? undefined,
    redeemedOn: row.redeemed_on,
    cost: row.cost
  };
}
