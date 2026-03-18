import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PlanPage from "@/app/plan/page";

vi.mock("@/components/layout/app-shell", () => ({
  AppShell: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}));

vi.mock("@/lib/store", () => ({
  useAppStore: () => ({
    currentDate: "2026-06-16",
    workouts: [
      {
        date: "2026-06-15",
        title: "Upper Strength + Run Work",
        type: "mixed",
        description: "Upper-body strength paired with running intervals.",
        warmup: ["5 min easy row", "Band pull-apart x 15"],
        mainWork: [{ name: "Bench Press", sets: 4, reps: "8", notes: "Rest 2 min" }],
        conditioning: [{ name: "Run Work", reps: "6 rounds", notes: "2 min hard / 2 min easy" }],
        cooldown: ["Walk 3 min"],
        isRestDay: false
      },
      {
        date: "2026-06-16",
        title: "Hyrox Circuit",
        type: "hyrox",
        description: "Structured station work.",
        warmup: ["5 min SkiErg"],
        mainWork: [{ name: "Main Circuit", reps: "4 rounds", notes: "Ski, sled, row, wall balls" }],
        conditioning: [],
        cooldown: ["Walk 5 min"],
        isRestDay: false
      },
      {
        date: "2026-06-17",
        title: "Rest Day",
        type: "rest",
        description: "Full rest day with optional walking and light mobility.",
        warmup: [],
        mainWork: [],
        conditioning: [],
        cooldown: ["Optional easy walk"],
        isRestDay: true
      }
    ],
    focusDate: "2026-06-16"
  })
}));

describe("PlanPage", () => {
  it("anchors the plan around the focused date and lets a day card expand and collapse inline", () => {
    render(<PlanPage />);

    expect(screen.getByText(/jump to current week/i)).toBeInTheDocument();
    expect(screen.getAllByText(/focused week/i).length).toBeGreaterThan(0);

    const dayButton = screen.getAllByRole("button", { name: /2026-06-15/i })[1];

    fireEvent.click(dayButton);

    expect(screen.getByText(/warmup/i)).toBeInTheDocument();
    expect(screen.getByText(/bench press/i)).toBeInTheDocument();

    fireEvent.click(dayButton);

    expect(screen.queryByText(/warmup/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/bench press/i)).not.toBeInTheDocument();
  });
});
