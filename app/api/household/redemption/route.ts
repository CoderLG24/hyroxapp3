import { NextResponse } from "next/server";

import { getApiErrorPayload } from "@/lib/api-errors";
import { createRewardRedemption, getHouseholdByCredentials } from "@/lib/supabase/repository";
import type { RewardRedemption } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      householdId: string;
      joinCode: string;
      redemption: RewardRedemption;
    };

    const household = await getHouseholdByCredentials(body.householdId, body.joinCode);

    if (!household) {
      return NextResponse.json({ error: "Invalid household credentials." }, { status: 401 });
    }

    await createRewardRedemption(body.householdId, body.redemption);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(getApiErrorPayload(error, "Unable to save redemption."), { status: 500 });
  }
}
