"use client";

import { Dumbbell, Flame, Snowflake } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

function BlockList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">{title}</p>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkoutDetails({ partner = false }: { partner?: boolean }) {
  const { todayWorkout, partnerWorkout } = useAppStore();
  const workout = partner ? partnerWorkout : todayWorkout;

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">
            {partner ? "Partner Workout" : "Scheduled Workout"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{workout.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">{workout.description}</p>
        </div>
        <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sm font-medium capitalize text-sky-100">
          {workout.type}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5">
          <BlockList title="Warmup" items={workout.warmup} />
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Main Work</p>
            <div className="space-y-3">
              {workout.mainWork.map((block) => (
                <div key={`${block.name}-${block.reps}-${block.duration}`} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Dumbbell className="h-4 w-4 text-sky-300" />
                    <p className="font-medium">{block.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {[block.sets ? `${block.sets} sets` : null, block.reps, block.distance, block.duration].filter(Boolean).join(" • ")}
                  </p>
                  {block.notes ? <p className="mt-2 text-sm text-slate-400">{block.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Conditioning</p>
            <div className="space-y-3">
              {workout.conditioning.length ? (
                workout.conditioning.map((block) => (
                  <div key={`${block.name}-${block.reps}-${block.duration}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-white">
                      <Flame className="h-4 w-4 text-amber-300" />
                      <p className="font-medium">{block.name}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {[block.reps, block.distance, block.duration].filter(Boolean).join(" • ")}
                    </p>
                    {block.notes ? <p className="mt-2 text-sm text-slate-400">{block.notes}</p> : null}
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">
                  No extra conditioning block assigned for this session.
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Cooldown</p>
            <div className="space-y-2">
              {workout.cooldown.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <Snowflake className="h-4 w-4 text-cyan-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          {workout.cycleAwareNotes?.length ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/80">Cycle-aware adjustments</p>
              <ul className="mt-3 space-y-2 text-sm text-amber-100">
                {workout.cycleAwareNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
