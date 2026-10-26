"use client";

import { SlotItem } from "@/lib/client/types";
import { formatSlotTime } from "@/lib/client/format";
import { Skeleton } from "@/components/ui/Skeleton";

interface SlotGridProps {
  slots: SlotItem[];
  loading: boolean;
  selectedSlot: string | null;
  onSelectSlot: (slotIso: string) => void;
}

// 30-minute slot grid for a selected date (18 slots total: 09:00 - 17:30 IST).
export function SlotGrid({ slots, loading, selectedSlot, onSelectSlot }: SlotGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.start;
        const timeLabel = formatSlotTime(slot.start);

        return (
          <button
            key={slot.start}
            type="button"
            disabled={!slot.available}
            onClick={() => slot.available && onSelectSlot(slot.start)}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium border transition-all text-center ${
              !slot.available
                ? "bg-black/30 border-white/5 text-text-muted/30 line-through cursor-not-allowed"
                : isSelected
                ? "bg-pink text-black font-semibold border-pink shadow-md shadow-pink/30 hover:bg-chartreuse hover:border-chartreuse scale-105"
                : "bg-surface border-white/10 text-text hover:border-chartreuse/50 hover:bg-surface/80"
            }`}
          >
            {timeLabel}
          </button>
        );
      })}
    </div>
  );
}
