"use client";

import { ChevronDown } from "lucide-react";

import { PlanWorkoutInline } from "@/components/plan/plan-workout-inline";
import { cn } from "@/lib/utils";
import type { WorkoutDay } from "@/lib/types";

export function PlanDayCard({
  day,
  selected,
  expanded,
  onSelect
}: {
  day: WorkoutDay;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full rounded-[22px] border p-4 text-left transition",
          selected ? "border-sky-400/40 bg-sky-400/10" : "border-white/5 bg-slate-950/35 hover:border-white/15"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{day.date}</p>
            <p className="mt-2 text-lg font-medium text-white">{day.title}</p>
            <p className="mt-2 text-sm capitalize text-slate-400">{day.type}</p>
          </div>
          <ChevronDown className={cn("mt-1 h-5 w-5 text-slate-400 transition", expanded && "rotate-180 text-sky-200")} />
        </div>
      </button>
      {expanded ? <PlanWorkoutInline workout={day} /> : null}
    </div>
  );
}
