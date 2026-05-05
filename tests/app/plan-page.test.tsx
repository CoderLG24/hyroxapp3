import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PlanPage from "@/app/plan/page";

const toggleGoal = vi.fn();

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
    athleteId: "lawton",
    currentDate: "2026-06-16",
    workouts: [
      {
        date: "2026-06-15",
        athleteId: "lawton",
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
        athleteId: "lawton",
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
        athleteId: "lawton",
        title: "Rest Day",
        type: "rest",
        description: "Full rest day with optional walking and light mobility.",
        warmup: [],
        mainWork: [],
        conditioning: [],
        cooldown: ["Optional easy walk"],
        isRestDay: true
      },
      {
        date: "2026-06-18",
        athleteId: "lawton",
        title: "Tempo Run",
        type: "run",
        description: "Tempo intervals.",
        warmup: ["5 min jog"],
        mainWork: [{ name: "Tempo Run", duration: "20 min", notes: "Steady hard effort" }],
        conditioning: [],
        cooldown: ["Walk 5 min"],
        isRestDay: false
      },
      {
        date: "2026-06-19",
        athleteId: "lawton",
        title: "Rest Day",
        type: "rest",
        description: "Rest.",
        warmup: [],
        mainWork: [],
        conditioning: [],
        cooldown: ["Walk"],
        isRestDay: true
      },
      {
        date: "2026-06-20",
        athleteId: "lawton",
        title: "Carry Day",
        type: "strength",
        description: "Carries and upper body.",
        warmup: ["5 min row"],
        mainWork: [{ name: "Farmer Carry", sets: 4, distance: "40 m", notes: "Heavy" }],
        conditioning: [],
        cooldown: ["Lat stretch"],
        isRestDay: false
      },
      {
        date: "2026-06-21",
        athleteId: "lawton",
        title: "Hyrox CS4 Class",
        type: "hyrox",
        description: "Class day.",
        warmup: ["5 min jog"],
        mainWork: [{ name: "Hyrox CS4 Class", duration: "60 min", notes: "Coach-led" }],
        conditioning: [],
        cooldown: ["Walk 5 min"],
        isRestDay: false
      },
      {
        date: "2026-06-22",
        athleteId: "lawton",
        title: "Lower Strength",
        type: "strength",
        description: "Lower-body day.",
        warmup: ["5 min bike"],
        mainWork: [{ name: "Leg Press", sets: 4, reps: "8", notes: "Rest 2 min" }],
        conditioning: [],
        cooldown: ["Calf stretch"],
        isRestDay: false
      },
      {
        date: "2026-06-23",
        athleteId: "lawton",
        title: "Upper Strength + Run Work",
        type: "mixed",
        description: "Another upper day.",
        warmup: ["5 min easy row"],
        mainWork: [{ name: "Dumbbell Bench Press", sets: 4, reps: "8", notes: "Rest 90 sec" }],
        conditioning: [{ name: "Run Work", reps: "5 rounds", notes: "2 min hard / 2 min easy" }],
        cooldown: ["Walk 3 min"],
        isRestDay: false
      }
    ],
    focusDate: "2026-06-16",
    toggleGoal,
    getCompletionForDate: (date: string) => ({
      date,
      athleteId: "lawton",
      goals: {
        scheduled_workout_complete: date === "2026-06-15",
        eat_at_home: false,
        protein_target_hit: false,
        hydration_target_hit: false,
        mobility_complete: false,
        step_goal_hit: false
      }
    })
  })
}));

describe("PlanPage", () => {
  it("shows a past-day checklist in Plan and toggles specific items for that date", () => {
    toggleGoal.mockClear();
    render(<PlanPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /2026-06-15/i })[1]);

    expect(screen.getByText(/mark completed/i)).toBeInTheDocument();
    expect(screen.getByText(/complete scheduled workout/i)).toBeInTheDocument();
    expect(screen.getByText(/eat at home/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /eat at home/i }));

    expect(toggleGoal).toHaveBeenCalledWith("eat_at_home", "lawton", "2026-06-15");
  });

  it("does not show the backfill checklist for the current focused date", () => {
    render(<PlanPage />);

    expect(screen.queryByText(/mark completed/i)).not.toBeInTheDocument();
  });

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

  it("scrolls the focused week into view when jumping to the current week", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<PlanPage />);

    fireEvent.click(screen.getByRole("button", { name: /jump to current week/i }));

    expect(scrollIntoView).toHaveBeenCalled();
  });
});
