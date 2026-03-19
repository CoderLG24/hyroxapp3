import { NextResponse } from "next/server";

import { getApiErrorPayload } from "@/lib/api-errors";
import { getHouseholdByJoinCode, getHouseholdSnapshot } from "@/lib/supabase/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { joinCode: string };
    const household = await getHouseholdByJoinCode(body.joinCode);
    const snapshot = await getHouseholdSnapshot(household.id);

    if (!snapshot) {
      return NextResponse.json({ error: "Household not found." }, { status: 404 });
    }

    return NextResponse.json({
      household: {
        householdId: snapshot.householdId,
        householdName: snapshot.householdName,
        joinCode: snapshot.joinCode
      },
      completions: snapshot.completions,
      redemptions: snapshot.redemptions,
      settings: snapshot.settings
    });
  } catch (error) {
    return NextResponse.json(getApiErrorPayload(error, "Unable to join household."), { status: 500 });
  }
}
