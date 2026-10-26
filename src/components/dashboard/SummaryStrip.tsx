"use client";

import { ClientAppointment } from "@/lib/client/types";

interface SummaryStripProps {
  appointments: ClientAppointment[];
}

// Compact metrics summary strip for today's sessions, confirmation status, and no-shows.
export function SummaryStrip({ appointments }: SummaryStripProps) {
  const confirmed = appointments.filter((a) => a.isConfirmed).length;
  const unconfirmed = appointments.filter((a) => a.status === "Booked" && !a.isConfirmed).length;
  const noShows = appointments.filter((a) => a.status === "No-show").length;

  const card = (label: string, value: React.ReactNode, sub: string) => (
    <div className="p-4 rounded-2xl bg-surface border border-white/5 flex flex-col justify-between">
      <span className="text-xs uppercase tracking-wider text-text-muted font-semibold">{label}</span>
      <div className="mt-2 text-2xl font-bold font-heading text-text">{value}</div>
      <span className="text-xs text-text-muted mt-1">{sub}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
      {card("Appointments Listed", appointments.length, "Total in current view")}
      {card(
        "Attendance Status",
        <span className="flex items-center gap-2">
          <span className="text-chartreuse">{confirmed}</span>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-pink">{unconfirmed}</span>
        </span>,
        `${confirmed} confirmed • ${unconfirmed} pending`
      )}
      {card("No-Shows", <span className="text-amber">{noShows}</span>, "Requires follow-up")}
    </div>
  );
}
