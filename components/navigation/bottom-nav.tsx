"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Gift, Home, LineChart, Settings2, Target } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/today", label: "Today", icon: Target },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings2 }
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[26px] border border-white/10 bg-slate-950/75 px-2 py-2 shadow-glass backdrop-blur-xl lg:left-6 lg:right-auto lg:top-6 lg:bottom-6 lg:w-24">
      <div className="grid grid-cols-6 gap-1 lg:grid-cols-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[11px] text-slate-400 transition",
                active && "bg-white/10 text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
