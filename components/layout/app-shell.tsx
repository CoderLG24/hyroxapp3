"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

export function AppShell({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const { athleteId, setAthleteId } = useAppStore();

  return (
    <div className="min-h-screen pb-28 lg:pl-32">
      <BottomNav />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Panel className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_25%),rgba(2,6,23,0.72)] p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-sky-100/70">
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </div>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-slate-950/40 p-1">
              {(["lawton", "katy"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAthleteId(id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${athleteId === id ? "bg-white text-slate-950" : "text-slate-300"}`}
                >
                  {id}
                </button>
              ))}
            </div>
          </motion.div>
        </Panel>
        {children}
      </main>
    </div>
  );
}
