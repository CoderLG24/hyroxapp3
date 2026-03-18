"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  detail: string;
}

export function ProgressRing({
  value,
  size = 108,
  stroke = 10,
  label,
  detail
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
        <text x="50%" y="48%" textAnchor="middle" fill="white" className="text-[20px] font-semibold">
          {Math.round(progress)}%
        </text>
        <text x="50%" y="62%" textAnchor="middle" fill="rgba(191, 219, 254, 0.75)" className="text-[8px] uppercase tracking-[0.24em]">
          Done
        </text>
      </svg>
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-sky-200/60">{label}</p>
        <p className="mt-1 text-sm text-slate-300">{detail}</p>
      </div>
    </div>
  );
}
