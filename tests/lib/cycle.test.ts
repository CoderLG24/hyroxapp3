import { describe, expect, it } from "vitest";

import { getCycleDay, getCycleStatusForDate } from "@/lib/cycle";

describe("cycle helpers", () => {
  it("computes estimated cycle day from the anchor date", () => {
    expect(getCycleDay("2026-03-31")).toBe(1);
    expect(getCycleDay("2026-04-01")).toBe(2);
    expect(getCycleDay("2026-04-28")).toBe(29);
    expect(getCycleDay("2026-04-29")).toBe(1);
  });

  it("maps dates to a default readiness guidance band", () => {
    expect(getCycleStatusForDate("2026-03-31").status).toBe("red");
    expect(getCycleStatusForDate("2026-04-05").status).toBe("yellow");
    expect(getCycleStatusForDate("2026-04-12").status).toBe("green");
  });
});
