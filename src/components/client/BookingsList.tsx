"use client";

import { useState } from "react";
import { AppointmentCard } from "./AppointmentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClientAppointment } from "@/lib/client/types";

interface BookingsListProps {
  upcoming: ClientAppointment[];
  past: ClientAppointment[];
  onConfirm: (id: string) => void;
  onReschedule: (appt: ClientAppointment) => void;
  onCancel: (appt: ClientAppointment) => void;
}

// Tabs and item list rendering for upcoming and past bookings.
export function BookingsList({ upcoming, past, onConfirm, onReschedule, onCancel }: BookingsListProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const list = tab === "upcoming" ? upcoming : past;
  const tabBtn = (t: "upcoming" | "past", count: number, label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`pb-2 text-sm font-semibold transition-colors cursor-pointer ${
        tab === t ? "text-pink border-b-2 border-pink hover:text-chartreuse hover:border-chartreuse -mb-[9px]" : "text-text-muted hover:text-chartreuse"
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6 border-b border-white/10 pb-2">
        {tabBtn("upcoming", upcoming.length, "Upcoming")}
        {tabBtn("past", past.length, "Past")}
      </div>
      {list.length === 0 ? (
        <EmptyState
          title={tab === "upcoming" ? "No upcoming appointments" : "No past sessions found"}
          description="Appointments scheduled with your phone number will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <AppointmentCard key={item.id} appointment={item} isUpcoming={tab === "upcoming"} onConfirm={onConfirm} onReschedule={onReschedule} onCancel={onCancel} />
          ))}
        </div>
      )}
      <p className="text-xs text-text-muted text-center pt-2">
        💡 Bookings are found by your 10-digit phone number (demo mode with no login).
      </p>
    </div>
  );
}
