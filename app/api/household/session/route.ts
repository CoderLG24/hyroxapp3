import { NextResponse } from "next/server";

import { getApiErrorPayload } from "@/lib/api-errors";
import { getHouseholdByCredentials, getHouseholdSnapshot } from "@/lib/supabase/repository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get("householdId");
    const joinCode = searchParams.get("joinCode");

    if (!householdId || !joinCode) {
      return NextResponse.json({ error: "Missing household credentials." }, { status: 400 });
    }

    const household = await getHouseholdByCredentials(householdId, joinCode);

    if (!household) {
      return NextResponse.json({ error: "Invalid household credentials." }, { status: 401 });
    }

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
    return NextResponse.json(getApiErrorPayload(error, "Unable to load household session."), { status: 500 });
  }
}
