"use client";

import { useEffect, useMemo, useState } from "react";

import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { PlanContextBar } from "@/components/plan/plan-context-bar";
import { PlanWeekCard } from "@/components/plan/plan-week-card";

export default function PlanPage() {
  const { workouts, focusDate, setFocusDate } = useAppStore();
  const weeks = useMemo(
    () =>
      Array.from({ length: Math.ceil(workouts.length / 7) }, (_, index) =>
        workouts.slice(index * 7, index * 7 + 7)
      ),
    [workouts]
  );
  const focusedWeekIndex = Math.max(
    weeks.findIndex((week) => week.some((day) => day.date === focusDate)),
    0
  );
  const [selectedDate, setSelectedDate] = useState(focusDate);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([
    focusedWeekIndex,
    Math.max(focusedWeekIndex - 1, 0),
    Math.min(focusedWeekIndex + 1, Math.max(weeks.length - 1, 0))
  ]);

  useEffect(() => {
    setSelectedDate(focusDate);
    setExpandedWeeks((current) =>
      Array.from(
        new Set([
          ...current,
          focusedWeekIndex,
          Math.max(focusedWeekIndex - 1, 0),
          Math.min(focusedWeekIndex + 1, Math.max(weeks.length - 1, 0))
        ])
      )
    );
  }, [focusDate, focusedWeekIndex, weeks.length]);

  const activeWeek = weeks[focusedWeekIndex] ?? [];

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setFocusDate(date);

    const weekIndex = weeks.findIndex((week) => week.some((day) => day.date === date));

    if (weekIndex >= 0) {
      setExpandedWeeks((current) => Array.from(new Set([...current, weekIndex])));
    }
  }

  function handleJumpToCurrentWeek() {
    setSelectedDate(focusDate);
    setExpandedWeeks([
      focusedWeekIndex,
      Math.max(focusedWeekIndex - 1, 0),
      Math.min(focusedWeekIndex + 1, Math.max(weeks.length - 1, 0))
    ]);
  }

  function toggleWeek(index: number) {
    setExpandedWeeks((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index]
    );
  }

  return (
    <AppShell eyebrow="26-week calendar" title="Training plan">
      <div className="grid gap-5">
        <PlanContextBar
          focusedDate={focusDate}
          weekLabel={activeWeek.length ? `${activeWeek[0].date} to ${activeWeek.at(-1)?.date}` : "No week selected"}
          onJumpToCurrentWeek={handleJumpToCurrentWeek}
        />
        {weeks.map((week, index) => (
          <PlanWeekCard
            key={`week-${index + 1}`}
            week={week}
            weekIndex={index}
            isFocused={index === focusedWeekIndex}
            isNear={Math.abs(index - focusedWeekIndex) <= 1}
            isExpanded={expandedWeeks.includes(index)}
            selectedDate={selectedDate}
            onToggleWeek={() => toggleWeek(index)}
            onSelectDate={handleSelectDate}
          />
        ))}
      </div>
    </AppShell>
  );
}
