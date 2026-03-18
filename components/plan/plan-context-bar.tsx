"use client";

import { CalendarDays, LocateFixed } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export function PlanContextBar({
  focusedDate,
  weekLabel,
  onJumpToCurrentWeek
}: {
  focusedDate: string;
  weekLabel: string;
  onJumpToCurrentWeek: () => void;
}) {
  return (
    <Panel className="sticky top-4 z-20 border-sky-400/15 bg-slate-950/80 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/60">Focused week</p>
            <p className="mt-1 text-sm text-slate-300">{weekLabel}</p>
            <p className="text-sm text-white">{focusedDate}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onJumpToCurrentWeek}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
        >
          <LocateFixed className="h-4 w-4" />
          Jump to current week
        </button>
      </div>
    </Panel>
  );
}
