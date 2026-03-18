"use client";

import { ChevronDown } from "lucide-react";

import { PlanDayCard } from "@/components/plan/plan-day-card";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import type { WorkoutDay } from "@/lib/types";

export function PlanWeekCard({
  week,
  weekIndex,
  isFocused,
  isNear,
  isExpanded,
  selectedDate,
  onToggleWeek,
  onSelectDate
}: {
  week: WorkoutDay[];
  weekIndex: number;
  isFocused: boolean;
  isNear: boolean;
  isExpanded: boolean;
  selectedDate: string;
  onToggleWeek: () => void;
  onSelectDate: (date: string) => void;
}) {
  return (
    <Panel
      className={cn(
        "overflow-hidden p-5 sm:p-6",
        isFocused && "border-sky-400/25 bg-sky-400/[0.06]",
        !isNear && !isExpanded && "opacity-70"
      )}
    >
      <button type="button" onClick={onToggleWeek} className="flex w-full items-center justify-between gap-4 text-left">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">
            {isFocused ? "Focused week" : "Week"} {weekIndex + 1}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {week[0]?.date} to {week.at(-1)?.date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isNear && !isExpanded ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              Archived
            </span>
          ) : null}
          <ChevronDown className={cn("h-5 w-5 text-slate-400 transition", isExpanded && "rotate-180 text-sky-200")} />
        </div>
      </button>

      {isExpanded ? (
        <div className="mt-5 grid gap-3">
          {week.map((day) => (
            <PlanDayCard
              key={day.date}
              day={day}
              selected={selectedDate === day.date}
              expanded={selectedDate === day.date}
              onSelect={() => onSelectDate(day.date)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
          {week.map((day) => (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDate(day.date)}
              className="rounded-2xl border border-white/5 bg-slate-950/35 px-3 py-3 text-left text-sm text-slate-300 transition hover:border-white/15"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{day.date.slice(5)}</p>
              <p className="mt-2 font-medium text-white">{day.title}</p>
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}
