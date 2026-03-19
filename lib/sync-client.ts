import type { PersistedState } from "@/lib/storage";
import type { HouseholdSession } from "@/lib/types";
import type { DailyCompletion, RewardRedemption } from "@/lib/types";

interface HouseholdSnapshotResponse {
  household: HouseholdSession;
  completions: PersistedState["completions"];
  redemptions: RewardRedemption[];
  settings: PersistedState["settings"] | null;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function createHouseholdRequest(input: {
  householdName?: string;
  settings: PersistedState["settings"];
}) {
  const response = await fetch("/api/household/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<HouseholdSnapshotResponse>(response);
}

export async function joinHouseholdRequest(input: { joinCode: string }) {
  const response = await fetch("/api/household/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<HouseholdSnapshotResponse>(response);
}

export async function fetchHouseholdSnapshot(input: { householdId: string; joinCode: string }) {
  const params = new URLSearchParams(input);
  const response = await fetch(`/api/household/session?${params.toString()}`, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<HouseholdSnapshotResponse>(response);
}

export async function saveCompletionRequest(input: {
  householdId: string;
  joinCode: string;
  completion: DailyCompletion;
}) {
  const response = await fetch("/api/household/completion", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  await readJson<{ ok: true }>(response);
}

export async function saveSettingsRequest(input: {
  householdId: string;
  joinCode: string;
  settings: PersistedState["settings"];
}) {
  const response = await fetch("/api/household/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  await readJson<{ ok: true }>(response);
}

export async function createRewardRedemptionRequest(input: {
  householdId: string;
  joinCode: string;
  redemption: RewardRedemption;
}) {
  const response = await fetch("/api/household/redemption", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  await readJson<{ ok: true }>(response);
}
