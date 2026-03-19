"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const {
    settings,
    updateSetting,
    athleteId,
    setAthleteId,
    householdSession,
    syncStatus,
    syncError,
    createHousehold,
    joinHousehold,
    disconnectHousehold
  } = useAppStore();
  const [householdName, setHouseholdName] = useState("Lawton + Katy");
  const [joinCodeInput, setJoinCodeInput] = useState("");

  return (
    <AppShell eyebrow="Local-first preferences" title="Settings">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel className="p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Shared sync</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {householdSession ? householdSession.householdName : "No household connected"}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {householdSession
                  ? `This device is connected. Use join code ${householdSession.joinCode} on the other phone once, then both phones will stay connected.`
                  : "Create the household on the first phone, then enter the join code on the second phone. After that, both phones keep the shared connection."}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                Sync status: {syncStatus}
              </p>
              {syncError ? <p className="mt-2 text-sm text-rose-300">{syncError}</p> : null}
            </div>
            {householdSession ? (
              <button
                type="button"
                onClick={disconnectHousehold}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:border-white/20"
              >
                Disconnect device
              </button>
            ) : null}
          </div>

          {!householdSession ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">Create household on this phone</p>
                <label className="mt-4 grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Household name</span>
                  <input
                    value={householdName}
                    onChange={(event) => setHouseholdName(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void createHousehold(householdName)}
                  disabled={syncStatus === "syncing"}
                  className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition disabled:opacity-50"
                >
                  Create shared household
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">Join household from the other phone</p>
                <label className="mt-4 grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Join code</span>
                  <input
                    value={joinCodeInput}
                    onChange={(event) => setJoinCodeInput(event.target.value.toUpperCase())}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm uppercase tracking-[0.2em] text-white outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void joinHousehold(joinCodeInput)}
                  disabled={syncStatus === "syncing" || joinCodeInput.trim().length < 4}
                  className="mt-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
                >
                  Join shared household
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">Connected join code</p>
              <p className="mt-2 text-3xl font-semibold tracking-[0.32em] text-white">
                {householdSession.joinCode}
              </p>
            </div>
          )}
        </Panel>

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
