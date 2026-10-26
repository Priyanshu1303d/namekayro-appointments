"use client";

import { AppointmentStatusType } from "@/components/ui/Pill";

interface StatusControlProps {
  status: AppointmentStatusType;
  onChange: (newStatus: AppointmentStatusType) => void;
}

// Interactive status pill with dropdown selector for Booked, Done, and No-show.
export function StatusControl({ status, onChange }: StatusControlProps) {
  if (status === "Cancelled") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-grey/15 text-grey border border-grey/30">
        Cancelled
      </span>
    );
  }

  const styles = {
    Booked: "bg-pink/15 text-pink border-pink/30",
    Done: "bg-chartreuse/15 text-chartreuse border-chartreuse/30",
    "No-show": "bg-amber/15 text-amber border-amber/30",
  }[status];

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as AppointmentStatusType)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${styles}`}
    >
      <option value="Booked" className="bg-surface text-pink">Booked</option>
      <option value="Done" className="bg-surface text-chartreuse">Done</option>
      <option value="No-show" className="bg-surface text-amber">No-show</option>
    </select>
  );
}
