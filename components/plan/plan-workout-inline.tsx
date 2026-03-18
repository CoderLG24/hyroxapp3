"use client";

import { Dumbbell, Flame, Snowflake } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type { WorkoutDay } from "@/lib/types";

function InlineList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/60">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanWorkoutInline({ workout }: { workout: WorkoutDay }) {
  return (
    <Panel className="mt-4 border-sky-400/15 bg-slate-950/55 p-4">
      <p className="text-sm text-slate-300">{workout.description}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <InlineList title="Warmup" items={workout.warmup} />
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/60">Main Work</p>
            <div className="space-y-2">
              {workout.mainWork.map((block) => (
                <div key={`${block.name}-${block.reps}-${block.duration}`} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  <div className="flex items-center gap-2 text-white">
                    <Dumbbell className="h-4 w-4 text-sky-300" />
                    <p className="font-medium">{block.name}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {[block.sets ? `${block.sets} sets` : null, block.reps, block.distance, block.duration].filter(Boolean).join(" • ")}
                  </p>
                  {block.notes ? <p className="mt-1 text-sm text-slate-400">{block.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/60">Conditioning</p>
            {workout.conditioning.length ? (
              <div className="space-y-2">
                {workout.conditioning.map((block) => (
                  <div key={`${block.name}-${block.reps}-${block.duration}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2 text-white">
                      <Flame className="h-4 w-4 text-amber-300" />
                      <p className="font-medium">{block.name}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {[block.reps, block.distance, block.duration].filter(Boolean).join(" • ")}
                    </p>
                    {block.notes ? <p className="mt-1 text-sm text-slate-400">{block.notes}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-sm text-slate-400">
                No extra conditioning block assigned.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200/60">Cooldown</p>
            <div className="space-y-2">
              {workout.cooldown.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                  <Snowflake className="h-4 w-4 text-cyan-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {workout.cycleAwareNotes?.length ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber-100/80">Cycle-aware adjustments</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-50">
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
