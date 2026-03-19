import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import TodayPage from "@/app/today/page";

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

vi.mock("@/components/progress/points-chart", () => ({
  PointsChart: () => <div>Points chart</div>
}));

vi.mock("@/components/rewards/reward-card", () => ({
  RewardCard: ({ reward }: { reward: { name: string } }) => <div>{reward.name}</div>
}));

vi.mock("@/components/training/checklist-card", () => ({
  ChecklistCard: () => <div>Checklist</div>
}));

vi.mock("@/components/training/workout-details", () => ({
  WorkoutDetails: () => <div>Workout details</div>
}));

vi.mock("@/components/ui/panel", () => ({
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock("@/components/ui/progress-ring", () => ({
  ProgressRing: ({ detail }: { detail: string }) => <div>{detail}</div>
}));

vi.mock("@/lib/store", () => ({
  useAppStore: () => ({
    athleteId: "lawton",
    currentDate: "2026-03-17",
    focusDate: "2026-06-20",
    todayWorkout: {
      title: "March Workout",
      description: "Workout for the real current day."
    },
    partnerWorkout: {
      title: "Partner Workout",
      description: "Partner workout"
    },
    completion: {
      date: "2026-03-17",
      goals: {
        scheduled_workout_complete: false,
        eat_at_home: false,
        protein_target_hit: false,
        hydration_target_hit: false,
        mobility_complete: false,
        step_goal_hit: false
      }
    },
    dailyPoints: 0,
    partnerDailyPoints: 0,
    streak: 0,
    partnerStreak: 0,
    personalPoints: 0,
    partnerPoints: 0,
    sharedPoints: 0,
    personalRewards: [],
    friendlyCompetition: {
      weekLabel: "Mar 16 - Mar 22",
      lawton: { athleteId: "lawton", points: 0, workouts: 0, perfectDays: 0, proteinDays: 0, stepDays: 0, streak: 0 },
      katy: { athleteId: "katy", points: 0, workouts: 0, perfectDays: 0, proteinDays: 0, stepDays: 0, streak: 0 },
      categories: [],
      leadCount: { lawton: 0, katy: 0 },
      momentumMessage: "Neck and neck."
    },
    cycleStatus: {
      cycleDay: 5,
      status: "green",
      guidance: "Do workout as written."
    },
    countdownDays: 185,
    workouts: [],
    updateCompletionMeta: vi.fn(),
    settings: {
      proteinTargets: { lawton: 190, katy: 150 },
      hydrationTargets: { lawton: 110, katy: 96 },
      stepTargets: { lawton: 10000, katy: 10000 },
      cycle: { anchorDate: "2026-03-31", cycleLength: 29 }
    }
  })
}));

describe("today date isolation", () => {
  it("keeps the dashboard anchored to the real current date", () => {
    render(<HomePage />);

    expect(screen.getByText(/lawton's dashboard for march 17, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/march workout/i)).toBeInTheDocument();
  });

  it("shows today's date and today's workout on the today page", () => {
    render(<TodayPage />);

    expect(screen.getByText(/today's mission/i)).toBeInTheDocument();
    expect(screen.getByText(/march 17, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/march workout/i)).toBeInTheDocument();
  });
});
