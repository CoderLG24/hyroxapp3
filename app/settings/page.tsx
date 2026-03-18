"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const { settings, updateSetting, athleteId, setAthleteId } = useAppStore();

  return (
    <AppShell eyebrow="Local-first preferences" title="Settings">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Device athlete</p>
          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
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
        </Panel>

        <Panel className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Daily targets</p>
          <div className="mt-5 grid gap-4">
            {(["lawton", "katy"] as const).map((id) => (
              <div key={id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium capitalize text-white">{id}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Protein</span>
                    <input
                      type="number"
                      value={settings.proteinTargets[id]}
                      onChange={(event) => updateSetting("proteinTargets", id, Number(event.target.value))}
                      className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Hydration</span>
                    <input
                      type="number"
                      value={settings.hydrationTargets[id]}
                      onChange={(event) => updateSetting("hydrationTargets", id, Number(event.target.value))}
                      className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Steps</span>
                    <input
                      type="number"
                      value={settings.stepTargets[id]}
                      onChange={(event) => updateSetting("stepTargets", id, Number(event.target.value))}
                      className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
