"use client";

import { useState, useEffect } from "react";
import { DateStrip } from "./DateStrip";
import { SlotGrid } from "./SlotGrid";
import { getNext14Days } from "@/lib/client/format";
import { getSlots } from "@/lib/client/api";
import { SlotItem } from "@/lib/client/types";

interface SlotPickerProps {
  selectedSlot: string | null;
  onSelectSlot: (slotIso: string) => void;
  initialDate?: string;
}

// Reusable date & slot picker for booking, rescheduling, and nutritionist modal.
export function SlotPicker({ selectedSlot, onSelectSlot, initialDate }: SlotPickerProps) {
  const days = getNext14Days();
  const [selectedDate, setSelectedDate] = useState(initialDate || days[0].dateStr);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSlots(selectedDate)
      .then((res) => {
        if (!cancelled) setSlots(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load slots");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2.5">1. Pick a date</p>
        <DateStrip days={days} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2.5">2. Pick an available time (IST)</p>
        {error ? <p className="text-sm text-pink bg-pink/10 p-3 rounded-xl border border-pink/20">{error}</p> : null}
        <SlotGrid slots={slots} loading={loading} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
      </div>
    </div>
  );
}
