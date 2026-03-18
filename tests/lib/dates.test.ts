import { describe, expect, it } from "vitest";

import { getPlanFocusDate } from "@/lib/dates";

describe("dates", () => {
  it("uses the local calendar day instead of UTC when deriving the current plan date", () => {
    const localLateNight = new Date(2026, 2, 17, 22, 38, 0);

    expect(getPlanFocusDate(localLateNight)).toBe("2026-03-17");
  });
});
