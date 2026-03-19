"use client";

import { Crown, Flame } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type { FriendlyCompetitionSummary } from "@/lib/competition";
import type { AthleteId } from "@/lib/types";
import { cn } from "@/lib/utils";

function nameForAthlete(id: AthleteId) {
  return id === "lawton" ? "Lawton" : "Katy";
}

function leaderLabel(leader: AthleteId | "tie") {
  if (leader === "tie") {
    return "Even";
  }

  return `${nameForAthlete(leader)} ahead`;
}

export function FriendlyCompetitionCard({
  summary,
  perspective
}: {
  summary: FriendlyCompetitionSummary;
  perspective: AthleteId;
}) {
  const partner = perspective === "lawton" ? "katy" : "lawton";

  return (
    <Panel className="overflow-hidden border-amber-400/15 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">Friendly competition</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">This week: {summary.weekLabel}</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-300">{summary.momentumMessage}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-amber-100">
          {summary.leadCount[perspective]}-{summary.leadCount[partner]} edge
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {([summary[perspective], summary[partner]] as const).map((stats) => (
          <div
            key={stats.athleteId}
            className={cn(
              "rounded-3xl border p-4",
              stats.athleteId === perspective
                ? "border-amber-300/20 bg-amber-300/[0.08]"
                : "border-white/10 bg-white/[0.03]"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{nameForAthlete(stats.athleteId)}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {stats.athleteId === perspective ? "This device" : "Partner"}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                <Flame className="h-3.5 w-3.5 text-amber-300" />
                {stats.streak} day streak
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Points</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.points}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Workouts</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.workouts}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Perfect</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stats.perfectDays}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {summary.categories.map((category) => (
          <div key={category.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{category.label}</p>
              {category.leader !== "tie" ? <Crown className="h-3.5 w-3.5 text-amber-300" /> : null}
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">L</p>
                <p className="text-xl font-semibold text-white">{category.lawton}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">K</p>
                <p className="text-xl font-semibold text-white">{category.katy}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-amber-100/80">{leaderLabel(category.leader)}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
