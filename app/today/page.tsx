"use client";

import { format } from "date-fns";

import { AppShell } from "@/components/layout/app-shell";
import { ChecklistCard } from "@/components/training/checklist-card";
import { WorkoutDetails } from "@/components/training/workout-details";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

export default function TodayPage() {
  const { completion, cycleStatus, updateCompletionMeta, athleteId, currentDate, todayWorkout } = useAppStore();

  return (
    <AppShell eyebrow="Execution mode" title="Today's mission">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-6">
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Today</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              {format(new Date(`${currentDate}T12:00:00Z`), "MMMM d, yyyy")}
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Scheduled workout: <span className="font-medium text-white">{todayWorkout.title}</span>
            </p>
          </Panel>
          <WorkoutDetails />
          <ChecklistCard />
        </div>
        <Panel className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Body notes</p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Notes</span>
              <textarea
                value={completion.notes ?? ""}
                onChange={(event) => updateCompletionMeta({ notes: event.target.value })}
                className="min-h-28 rounded-3xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Sleep hours</span>
              <input
                type="number"
                value={completion.sleepHours ?? ""}
                onChange={(event) => updateCompletionMeta({ sleepHours: Number(event.target.value) || undefined })}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">RPE</span>
              <input
                type="number"
                value={completion.rpe ?? ""}
                onChange={(event) => updateCompletionMeta({ rpe: Number(event.target.value) || undefined })}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            {athleteId === "katy" ? (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-medium text-white">Estimated cycle day {cycleStatus.cycleDay}</p>
                <p className="mt-2 text-sm capitalize text-emerald-100">{cycleStatus.status}</p>
                <p className="mt-2 text-sm text-emerald-50/90">{cycleStatus.guidance}</p>
              </div>
            ) : null}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
