import React from "react";

export type AppointmentStatusType = "Booked" | "Done" | "No-show" | "Cancelled";

export interface PillProps {
  status: AppointmentStatusType;
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<AppointmentStatusType, { dot: string; text: string; bg: string }> = {
  Booked: { dot: "bg-pink", text: "text-pink", bg: "bg-pink/10 border-pink/20" },
  Done: { dot: "bg-chartreuse", text: "text-chartreuse", bg: "bg-chartreuse/10 border-chartreuse/20" },
  "No-show": { dot: "bg-amber", text: "text-amber", bg: "bg-amber/10 border-amber/20" },
  Cancelled: { dot: "bg-grey", text: "text-grey", bg: "bg-grey/10 border-grey/20" },
};

// Renders an appointment status with both a colored indicator dot and text label.
export function Pill({ status, className = "", onClick }: PillProps) {
  const cfg = statusConfig[status] || statusConfig.Booked;
  const isClickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${isClickable ? "cursor-pointer hover:opacity-80 active:scale-95" : ""} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span>{status}</span>
    </span>
  );
}
