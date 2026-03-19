import { NextResponse } from "next/server";

import { getApiErrorPayload } from "@/lib/api-errors";
import { getHouseholdByCredentials, upsertCompletion } from "@/lib/supabase/repository";
import type { DailyCompletion } from "@/lib/types";

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      householdId: string;
      joinCode: string;
      completion: DailyCompletion;
    };

    const household = await getHouseholdByCredentials(body.householdId, body.joinCode);

    if (!household) {
      return NextResponse.json({ error: "Invalid household credentials." }, { status: 401 });
    }

    await upsertCompletion(body.householdId, body.completion);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(getApiErrorPayload(error, "Unable to save completion."), { status: 500 });
  }
}
