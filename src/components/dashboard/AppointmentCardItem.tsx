"use client";

import { ClientAppointment } from "@/lib/client/types";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { StatusControl } from "./StatusControl";
import { WhatsAppButton } from "./WhatsAppButton";
import { AppointmentStatusType } from "@/components/ui/Pill";

interface AppointmentCardItemProps {
  item: ClientAppointment;
  onStatusChange: (id: string, s: AppointmentStatusType) => void;
}

// Mobile responsive card layout for a nutritionist appointment item.
export function AppointmentCardItem({ item, onStatusChange }: AppointmentCardItemProps) {
  const dateStr = formatAppointmentDate(item.appointmentStart);
  const timeStr = formatSlotTime(item.appointmentStart);

  return (
    <div className="p-4 rounded-2xl bg-surface border border-white/5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-bold font-heading text-text text-base">{item.clientName}</h4>
          <p className="text-xs text-text-muted mt-0.5">{item.phone || <span className="text-amber italic">Add phone</span>}</p>
        </div>
        <StatusControl status={item.status} onChange={(s) => onStatusChange(item.id, s)} />
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
        <div>
          <span className="text-text font-medium">{dateStr}</span>
          <span className="text-pink font-mono ml-2">{timeStr}</span>
        </div>
        <div>
          {item.isConfirmed ? (
            <span className="text-chartreuse font-semibold">✓ Confirmed</span>
          ) : item.status === "Booked" ? (
            <span className="text-amber font-semibold">Not confirmed</span>
          ) : null}
        </div>
      </div>

      {!item.isConfirmed && item.status === "Booked" && item.phone && (
        <div className="pt-1">
          <WhatsAppButton phone={item.phone} clientName={item.clientName} dateStr={dateStr} timeStr={timeStr} />
        </div>
      )}
    </div>
  );
}
