"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { PlanContextBar } from "@/components/plan/plan-context-bar";
import { PlanWeekCard } from "@/components/plan/plan-week-card";

export default function PlanPage() {
  const { workouts, currentDate } = useAppStore();
  const focusedWeekRef = useRef<HTMLDivElement | null>(null);
  const weeks = useMemo(
    () =>
      Array.from({ length: Math.ceil(workouts.length / 7) }, (_, index) =>
        workouts.slice(index * 7, index * 7 + 7)
      ),
    [workouts]
  );
  const focusedWeekIndex = Math.max(
    weeks.findIndex((week) => week.some((day) => day.date === currentDate)),
    0
  );
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([
    focusedWeekIndex,
    Math.max(focusedWeekIndex - 1, 0),
    Math.min(focusedWeekIndex + 1, Math.max(weeks.length - 1, 0))
  ]);

  useEffect(() => {
    setSelectedDate(currentDate);
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
  }, [currentDate, focusedWeekIndex, weeks.length]);

  const activeWeek = weeks[focusedWeekIndex] ?? [];

  function handleSelectDate(date: string) {
    const weekIndex = weeks.findIndex((week) => week.some((day) => day.date === date));

    if (weekIndex >= 0) {
      setExpandedWeeks((current) => Array.from(new Set([...current, weekIndex])));
    }

    setSelectedDate((current) => (current === date ? "" : date));
  }

  function handleJumpToCurrentWeek() {
    setSelectedDate(currentDate);
    setExpandedWeeks([
      focusedWeekIndex,
      Math.max(focusedWeekIndex - 1, 0),
      Math.min(focusedWeekIndex + 1, Math.max(weeks.length - 1, 0))
    ]);
    focusedWeekRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
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
          focusedDate={selectedDate}
          weekLabel={activeWeek.length ? `${activeWeek[0].date} to ${activeWeek.at(-1)?.date}` : "No week selected"}
          onJumpToCurrentWeek={handleJumpToCurrentWeek}
        />
        {weeks.map((week, index) => (
          <div key={`week-${index + 1}`} ref={index === focusedWeekIndex ? focusedWeekRef : undefined}>
            <PlanWeekCard
              week={week}
              weekIndex={index}
              isFocused={index === focusedWeekIndex}
              isNear={Math.abs(index - focusedWeekIndex) <= 1}
              isExpanded={expandedWeeks.includes(index)}
              selectedDate={selectedDate}
              onToggleWeek={() => toggleWeek(index)}
              onSelectDate={handleSelectDate}
            />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
