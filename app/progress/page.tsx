"use client";

import { HeadToHeadPanel } from "@/components/competition/head-to-head-panel";
import { AppShell } from "@/components/layout/app-shell";
import { PointsChart } from "@/components/progress/points-chart";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";
import { calculateDailyPoints } from "@/lib/scoring";

export default function ProgressPage() {
  const { workouts, completion, streak, personalPoints, sharedPoints, weeklyBonuses, friendlyCompetition } = useAppStore();

  const chartData = workouts.slice(0, 20).map((workout) => ({
    date: workout.date.slice(5),
    points: calculateDailyPoints(completion.date === workout.date ? completion : { ...completion, date: workout.date, goals: completion.goals })
  }));

  return (
    <AppShell eyebrow="Consistency tracking" title="Progress">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <PointsChart data={chartData} title="Points over time" />
          <HeadToHeadPanel summary={friendlyCompetition} />
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Weekly consistency</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Workout bonus</p>
                <p className="mt-2 text-2xl font-semibold text-white">{weeklyBonuses.five_plus_workouts}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Nutrition bonus</p>
                <p className="mt-2 text-2xl font-semibold text-white">{weeklyBonuses.five_plus_eat_at_home_days + weeklyBonuses.four_plus_protein_days}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Strong-day bonus</p>
                <p className="mt-2 text-2xl font-semibold text-white">{weeklyBonuses.five_plus_strong_days}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Weekly total</p>
                <p className="mt-2 text-2xl font-semibold text-white">{weeklyBonuses.total}</p>
              </div>
            </div>
          </Panel>
        </div>
        <div className="grid gap-6">
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Current streak</p>
            <p className="mt-3 text-5xl font-semibold text-white">{streak}</p>
            <p className="mt-2 text-sm text-slate-300">Perfect-day streaks reward daily consistency, not just workouts.</p>
          </Panel>
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Lifetime points</p>
            <p className="mt-3 text-5xl font-semibold text-white">{personalPoints}</p>
            <p className="mt-2 text-sm text-slate-300">Shared bank currently holds {sharedPoints} points.</p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
