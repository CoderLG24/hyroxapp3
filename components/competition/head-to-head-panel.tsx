"use client";

import { Trophy } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type { FriendlyCompetitionSummary } from "@/lib/competition";

export function HeadToHeadPanel({ summary }: { summary: FriendlyCompetitionSummary }) {
  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Head-to-head</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Weekly mini wins</h2>
          <p className="mt-2 text-sm text-slate-300">{summary.momentumMessage}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
          <Trophy className="h-3.5 w-3.5 text-sky-300" />
          {summary.leadCount.lawton}-{summary.leadCount.katy}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {summary.categories.map((category) => (
          <div key={category.key} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{category.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {category.leader === "tie"
                    ? "Even this week"
                    : `${category.leader === "lawton" ? "Lawton" : "Katy"} leading this week`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Lawton {category.lawton}</p>
                <p className="text-sm text-slate-400">Katy {category.katy}</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300"
                style={{
                  width: `${Math.max(
                    20,
                    Math.min(
                      100,
                      category.lawton + category.katy === 0
                        ? 50
                        : (Math.max(category.lawton, category.katy) / (category.lawton + category.katy)) * 100
                    )
                  )}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
