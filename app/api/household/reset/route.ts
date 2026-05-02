import { NextResponse } from "next/server";

import { getApiErrorPayload } from "@/lib/api-errors";
import {
  deleteCompletionsFromDate,
  deleteRedemptionsFromDate,
  getHouseholdByCredentials
} from "@/lib/supabase/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      householdId: string;
      joinCode: string;
      resetDate: string;
    };

    const household = await getHouseholdByCredentials(body.householdId, body.joinCode);

    if (!household) {
      return NextResponse.json({ error: "Invalid household credentials." }, { status: 401 });
    }

    await Promise.all([
      deleteCompletionsFromDate(body.householdId, body.resetDate),
      deleteRedemptionsFromDate(body.householdId, body.resetDate)
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(getApiErrorPayload(error, "Unable to reset household progress."), { status: 500 });
  }
}
