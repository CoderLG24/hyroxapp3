"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { goalDefinitions } from "@/data/goals";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChecklistCard() {
  const { completion, dailyPoints, toggleGoal } = useAppStore();

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Daily Checklist</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Today&apos;s Mission</h2>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
          {dailyPoints} pts
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {goalDefinitions.map((goal, index) => {
          const checked = completion.goals[goal.key];

          return (
            <motion.button
              key={goal.key}
              type="button"
              onClick={() => toggleGoal(goal.key)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                checked
                  ? "border-emerald-400/30 bg-emerald-400/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl border",
                  checked ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-slate-900/60 text-slate-500"
                )}
              >
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{goal.label}</p>
                <p className="text-sm text-slate-400">{goal.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </Panel>
  );
}
