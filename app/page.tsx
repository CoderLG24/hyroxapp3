"use client";

import { format } from "date-fns";

import { AppShell } from "@/components/layout/app-shell";
import { PointsChart } from "@/components/progress/points-chart";
import { RewardCard } from "@/components/rewards/reward-card";
import { ChecklistCard } from "@/components/training/checklist-card";
import { WorkoutDetails } from "@/components/training/workout-details";
import { Panel } from "@/components/ui/panel";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useAppStore } from "@/lib/store";
import { calculateDailyPoints } from "@/lib/scoring";

export default function HomePage() {
  const {
    athleteId,
    focusDate,
    todayWorkout,
    partnerWorkout,
    completion,
    dailyPoints,
    partnerDailyPoints,
    streak,
    partnerStreak,
    personalPoints,
    partnerPoints,
    sharedPoints,
    personalRewards,
    cycleStatus,
    countdownDays,
    workouts
  } = useAppStore();

  const completionRate =
    (Object.values(completion.goals).filter(Boolean).length / Object.keys(completion.goals).length) * 100;

  const chartData = workouts.slice(0, 12).map((workout) => ({
    date: workout.date.slice(5),
    points: calculateDailyPoints(completion.date === workout.date ? completion : { ...completion, date: workout.date, goals: completion.goals })
  }));

  return (
    <AppShell
      eyebrow="Premium Hyrox system"
      title={`${athleteId === "lawton" ? "Lawton" : "Katy"}'s dashboard for ${format(new Date(`${focusDate}T12:00:00Z`), "MMMM d, yyyy")}`}
    >
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="grid gap-6">
          <Panel className="grid gap-5 p-5 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Race Countdown</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">{countdownDays} days</h2>
              <p className="mt-2 max-w-lg text-sm text-slate-300">
                Today&apos;s assigned session is <span className="font-medium text-white">{todayWorkout.title}</span>. Shared race momentum stays visible, but this device defaults to your own mission first.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <ProgressRing
                value={completionRate}
                label="Checklist"
                detail={`${Object.values(completion.goals).filter(Boolean).length} of ${Object.keys(completion.goals).length} complete`}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Today</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{dailyPoints}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Streak</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{streak}</p>
                </div>
              </div>
            </div>
          </Panel>

          <WorkoutDetails />
          <ChecklistCard />
          <PointsChart data={chartData} title="Points trend" />
        </div>

        <div className="grid gap-6">
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Partner Snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{partnerWorkout.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{partnerWorkout.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Partner today</p>
                <p className="mt-2 text-xl font-semibold text-white">{partnerDailyPoints} pts</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Partner streak</p>
                <p className="mt-2 text-xl font-semibold text-white">{partnerStreak} days</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Points Banks</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Personal</p>
                <p className="mt-1 text-3xl font-semibold text-white">{personalPoints}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Partner personal</p>
                <p className="mt-1 text-3xl font-semibold text-white">{partnerPoints}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Shared</p>
                <p className="mt-1 text-3xl font-semibold text-white">{sharedPoints}</p>
              </div>
            </div>
          </Panel>

          {athleteId === "katy" ? (
            <Panel className="border-emerald-400/20 bg-emerald-400/10 p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Cycle status</p>
              <h2 className="mt-2 text-2xl font-semibold capitalize text-white">{cycleStatus.status}</h2>
              <p className="mt-2 text-sm text-emerald-50/80">Estimated cycle day {cycleStatus.cycleDay}</p>
              <p className="mt-3 text-sm text-emerald-50">{cycleStatus.guidance}</p>
            </Panel>
          ) : null}

          <div className="grid gap-4">
            {personalRewards.slice(0, 2).map((reward) => (
              <RewardCard key={reward.id} reward={reward} balance={personalPoints} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
