"use client";

import { DayOption } from "@/lib/client/format";

interface DateStripProps {
  days: DayOption[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

// 14-day horizontal scrollable date strip in Asia/Kolkata timezone.
export function DateStrip({ days, selectedDate, onSelectDate }: DateStripProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
      {days.map((d) => {
        const isSelected = d.dateStr === selectedDate;
        return (
          <button
            key={d.dateStr}
            type="button"
            onClick={() => onSelectDate(d.dateStr)}
            className={`snap-start shrink-0 min-w-[70px] py-3 px-2 rounded-2xl border text-center transition-all ${
              isSelected
                ? "bg-pink text-black font-semibold border-pink shadow-lg shadow-pink/20 hover:bg-chartreuse hover:border-chartreuse scale-105"
                : "bg-surface border-white/10 text-text hover:border-chartreuse/50 hover:bg-surface/80"
            }`}
          >
            <span className={`block text-[11px] uppercase tracking-wider ${isSelected ? "text-black/80 font-bold" : "text-text-muted"}`}>
              {d.isToday ? "Today" : d.dayName}
            </span>
            <span className="block text-xl font-bold font-heading mt-1">{d.dayNum}</span>
            <span className={`block text-[11px] ${isSelected ? "text-black/80 font-medium" : "text-text-muted"}`}>{d.monthName}</span>
          </button>
        );
      })}
    </div>
  );
}
