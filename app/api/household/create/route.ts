import { NextResponse } from "next/server";

import { createHousehold, getHouseholdSnapshot } from "@/lib/supabase/repository";
import type { PersistedState } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      householdName?: string;
      settings: PersistedState["settings"];
    };

    const household = await createHousehold({
      name: body.householdName,
      settings: body.settings
    });
    const snapshot = await getHouseholdSnapshot(household.id);

    if (!snapshot) {
      return NextResponse.json({ error: "Failed to load household after creation." }, { status: 500 });
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create household." },
      { status: 500 }
    );
  }
}
