"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Panel } from "@/components/ui/panel";

export function PointsChart({
  data,
  title
}: {
  data: Array<{ date: string; points: number }>;
  title: string;
}) {
  return (
    <Panel className="p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">{title}</p>
      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="points-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18 }} />
            <Area type="monotone" dataKey="points" stroke="#38bdf8" fill="url(#points-fill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
