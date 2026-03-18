"use client";

import { motion } from "framer-motion";

import { Panel } from "@/components/ui/panel";
import { useAppStore } from "@/lib/store";
import type { Reward } from "@/lib/types";

export function RewardCard({
  reward,
  balance
}: {
  reward: Reward;
  balance: number;
}) {
  const { redeemReward } = useAppStore();
  const percent = Math.min((balance / reward.cost) * 100, 100);
  const canRedeem = balance >= reward.cost;

  return (
    <Panel className="overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">
            {reward.scope === "shared" ? "Shared reward" : "Personal reward"}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{reward.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{reward.cost} points</p>
        </div>
        <button
          type="button"
          onClick={() => redeemReward(reward)}
          disabled={!canRedeem}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${canRedeem ? "bg-white text-slate-950" : "bg-white/10 text-slate-500"}`}
        >
          Redeem
        </button>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-sm text-slate-400">
        {canRedeem ? "Unlocked now" : `${Math.max(reward.cost - balance, 0)} points to go`}
      </p>
    </Panel>
  );
}
