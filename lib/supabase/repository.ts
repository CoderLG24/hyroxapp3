import type { PersistedState } from "@/lib/storage";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  completionToRow,
  redemptionToRow,
  rowToCompletion,
  rowToRedemption,
  rowToSettings,
  settingsToRow
} from "@/lib/supabase/mappers";
import type { DailyCompletion, RewardRedemption } from "@/lib/types";

export interface SharedHouseholdSnapshot {
  householdId: string;
  householdName: string;
  joinCode: string;
  completions: PersistedState["completions"];
  redemptions: RewardRedemption[];
  settings: PersistedState["settings"] | null;
}

function randomJoinCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createHousehold(params: {
  name?: string;
  settings: PersistedState["settings"];
  joinCode?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const joinCode = params.joinCode ?? randomJoinCode();

  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({
      name: params.name ?? "Hyrox Household",
      join_code: joinCode
    })
    .select("id, name, join_code, created_at")
    .single();

  if (householdError) {
    throw householdError;
  }

  const { error: settingsError } = await supabase
    .from("household_settings")
    .insert(settingsToRow(household.id, params.settings));

  if (settingsError) {
    throw settingsError;
  }

  return household;
}

export async function getHouseholdByJoinCode(joinCode: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("households")
    .select("id, name, join_code, created_at")
    .eq("join_code", joinCode.trim().toUpperCase())
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getHouseholdByCredentials(householdId: string, joinCode: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("households")
    .select("id, name, join_code, created_at")
    .eq("id", householdId)
    .eq("join_code", joinCode.trim().toUpperCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getHouseholdSnapshot(householdId: string): Promise<SharedHouseholdSnapshot | null> {
  const supabase = createSupabaseAdminClient();

  const [{ data: household, error: householdError }, { data: settingsRow, error: settingsError }, { data: completionRows, error: completionError }, { data: redemptionRows, error: redemptionError }] =
    await Promise.all([
      supabase.from("households").select("id, name, join_code, created_at").eq("id", householdId).single(),
      supabase.from("household_settings").select("household_id, protein_targets, hydration_targets, step_targets, cycle_anchor_date, cycle_length, updated_at").eq("household_id", householdId).maybeSingle(),
      supabase.from("daily_completions").select("household_id, athlete_id, date, goals, notes, rpe, soreness, sleep_hours, readiness_status, symptom_notes, updated_at").eq("household_id", householdId),
      supabase.from("reward_redemptions").select("id, household_id, reward_id, scope, athlete_id, redeemed_on, cost").eq("household_id", householdId).order("redeemed_on", { ascending: false })
    ]);

  if (householdError) {
    throw householdError;
  }

  if (settingsError) {
    throw settingsError;
  }

  if (completionError) {
    throw completionError;
  }

  if (redemptionError) {
    throw redemptionError;
  }

  if (!household) {
    return null;
  }

  const completions = Object.fromEntries(
    (completionRows ?? []).map((row) => {
      const completion = rowToCompletion(row);
      return [`${completion.athleteId}:${completion.date}`, completion];
    })
  );

  return {
    householdId: household.id,
    householdName: household.name,
    joinCode: household.join_code,
    completions,
    redemptions: (redemptionRows ?? []).map(rowToRedemption),
    settings: settingsRow ? rowToSettings(settingsRow) : null
  };
}

export async function upsertCompletion(householdId: string, completion: DailyCompletion) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("daily_completions")
    .upsert(completionToRow(householdId, completion), {
      onConflict: "household_id,athlete_id,date"
    });

  if (error) {
    throw error;
  }
}

export async function upsertSettings(householdId: string, settings: PersistedState["settings"]) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("household_settings")
    .upsert(settingsToRow(householdId, settings), {
      onConflict: "household_id"
    });

  if (error) {
    throw error;
  }
}

export async function createRewardRedemption(householdId: string, redemption: RewardRedemption) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("reward_redemptions")
    .insert(redemptionToRow(householdId, redemption));

  if (error) {
    throw error;
  }
}
