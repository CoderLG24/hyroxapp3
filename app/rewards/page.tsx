"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RewardCard } from "@/components/rewards/reward-card";
import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";

export default function RewardsPage() {
  const {
    personalRewards,
    partnerRewards,
    sharedRewards,
    personalPoints,
    partnerPoints,
    sharedPoints,
    redemptions
  } = useAppStore();

  return (
    <AppShell eyebrow="Reward economy" title="Rewards">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {personalRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} balance={personalPoints} />
            ))}
          </div>
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Shared rewards</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sharedRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} balance={sharedPoints} />
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-6">
          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Banks</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">You</p>
                <p className="mt-2 text-3xl font-semibold text-white">{personalPoints}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Partner</p>
                <p className="mt-2 text-3xl font-semibold text-white">{partnerPoints}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">Shared</p>
                <p className="mt-2 text-3xl font-semibold text-white">{sharedPoints}</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Reward history</p>
            <div className="mt-5 space-y-3">
              {redemptions.length ? (
                redemptions.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    <p className="font-medium text-white">{entry.rewardId}</p>
                    <p className="mt-1">{entry.cost} points • {new Date(entry.redeemedOn).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No rewards redeemed yet.</p>
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">Partner catalog snapshot</p>
            <div className="mt-4 space-y-3">
              {partnerRewards.slice(0, 3).map((reward) => (
                <div key={reward.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-medium text-white">{reward.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{reward.cost} points</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
