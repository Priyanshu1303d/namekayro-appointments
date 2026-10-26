"use client";

import { ClientAppointment } from "@/lib/client/types";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { StatusControl } from "./StatusControl";
import { WhatsAppButton } from "./WhatsAppButton";
import { AppointmentStatusType } from "@/components/ui/Pill";

interface AppointmentRowProps {
  item: ClientAppointment;
  onStatusChange: (id: string, s: AppointmentStatusType) => void;
}

// Desktop table row representation of a client consultation.
export function AppointmentRow({ item, onStatusChange }: AppointmentRowProps) {
  const dateStr = formatAppointmentDate(item.appointmentStart);
  const timeStr = formatSlotTime(item.appointmentStart);

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-sm">
      <td className="py-3.5 px-4 font-semibold text-text">{item.clientName}</td>
      <td className="py-3.5 px-4 text-text-muted">{item.phone || <span className="text-xs text-amber italic">Add phone</span>}</td>
      <td className="py-3.5 px-4 text-text">{dateStr}</td>
      <td className="py-3.5 px-4 font-mono text-pink">{timeStr}</td>
      <td className="py-3.5 px-4"><StatusControl status={item.status} onChange={(s) => onStatusChange(item.id, s)} /></td>
      <td className="py-3.5 px-4">
        {item.isConfirmed ? (
          <span className="text-xs font-semibold text-chartreuse">✓ Confirmed</span>
        ) : item.status === "Booked" ? (
          <span className="text-xs font-semibold text-amber">Not confirmed</span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        )}
      </td>
      <td className="py-3.5 px-4">
        {!item.isConfirmed && item.status === "Booked" && (
          <WhatsAppButton phone={item.phone} clientName={item.clientName} dateStr={dateStr} timeStr={timeStr} />
        )}
      </td>
    </tr>
  );
}
