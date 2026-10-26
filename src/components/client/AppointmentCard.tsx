"use client";

import { ClientAppointment } from "@/lib/client/types";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

interface AppointmentCardProps {
  appointment: ClientAppointment;
  isUpcoming?: boolean;
  onConfirm?: (id: string) => void;
  onReschedule?: (appt: ClientAppointment) => void;
  onCancel?: (appt: ClientAppointment) => void;
}

// Client booking list card with date, time, status, and action buttons.
export function AppointmentCard({ appointment, isUpcoming, onConfirm, onReschedule, onCancel }: AppointmentCardProps) {
  const isBooked = appointment.status === "Booked";

  return (
    <div className="p-5 rounded-2xl bg-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20">
      <div>
        <div className="flex items-center gap-2.5">
          <Pill status={appointment.status} />
          {appointment.isConfirmed && (
            <span className="text-[11px] font-semibold text-chartreuse bg-chartreuse/10 px-2 py-0.5 rounded-full border border-chartreuse/20">
              ✓ Confirmed
            </span>
          )}
        </div>
        <p className="mt-2 text-lg font-bold font-heading text-text">{formatAppointmentDate(appointment.appointmentStart)}</p>
        <p className="text-sm font-medium text-pink">{formatSlotTime(appointment.appointmentStart)} (IST)</p>
      </div>

      {isUpcoming && isBooked && (
        <div className="flex flex-wrap items-center gap-2 sm:self-center">
          {!appointment.isConfirmed && onConfirm && (
            <Button variant="outline" size="sm" onClick={() => onConfirm(appointment.id)}>
              Confirm I&apos;ll be there
            </Button>
          )}
          {onReschedule && (
            <Button variant="ghost" size="sm" onClick={() => onReschedule(appointment)}>
              Reschedule
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={() => onCancel(appointment)} className="text-text-muted hover:text-pink">
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
