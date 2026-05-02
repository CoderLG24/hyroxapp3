import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SettingsPage from "@/app/settings/page";

vi.mock("@/components/layout/app-shell", () => ({
  AppShell: ({
    children,
    title,
    eyebrow
  }: {
    children: React.ReactNode;
    title: string;
    eyebrow: string;
  }) => (
    <div>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </div>
  )
}));

vi.mock("@/components/ui/panel", () => ({
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock("@/lib/store", () => ({
  useAppStore: () => ({
    settings: {
      proteinTargets: { lawton: 190, katy: 150 },
      hydrationTargets: { lawton: 110, katy: 96 },
      stepTargets: { lawton: 10000, katy: 10000 },
      cycle: { anchorDate: "2026-03-31", cycleLength: 29 }
    },
    updateSetting: vi.fn(),
    athleteId: "lawton",
    setAthleteId: vi.fn(),
    householdSession: null,
    syncStatus: "local",
    syncError: null,
    createHousehold: vi.fn(),
    joinHousehold: vi.fn(),
    disconnectHousehold: vi.fn(),
    wearableConnections: [],
    wearableMetrics: [],
    connectWearable: vi.fn(),
    syncWearable: vi.fn()
  })
}));

describe("SettingsPage", () => {
  it("does not render wearable integrations controls", () => {
    render(<SettingsPage />);

    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.queryByText(/wearable integrations/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lawton whoop/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/katy oura/i)).not.toBeInTheDocument();
  });
});
