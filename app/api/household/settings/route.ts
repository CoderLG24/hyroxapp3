import { NextResponse } from "next/server";

import { getHouseholdByCredentials, upsertSettings } from "@/lib/supabase/repository";
import type { PersistedState } from "@/lib/storage";

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      householdId: string;
      joinCode: string;
      settings: PersistedState["settings"];
    };

    const household = await getHouseholdByCredentials(body.householdId, body.joinCode);

    if (!household) {
      return NextResponse.json({ error: "Invalid household credentials." }, { status: 401 });
    }

    await upsertSettings(body.householdId, body.settings);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save settings." },
      { status: 500 }
    );
  }
}
