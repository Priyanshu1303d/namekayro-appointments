"use client";

import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { ClientAppointment } from "@/lib/client/types";

interface NextAppointmentCardProps {
  cardRef?: React.RefObject<HTMLDivElement | null>;
  appointment?: ClientAppointment | null;
  onConfirm?: (id: string) => void;
}

// Next upcoming appointment card with interactive hover card effects.
export function NextAppointmentCard({ cardRef, appointment, onConfirm }: NextAppointmentCardProps) {
  const hoverClass = "group relative rounded-3xl border bg-surface/90 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1";

  if (!appointment) {
    return (
      <div ref={cardRef} className={`${hoverClass} border-white/10 hover:border-chartreuse/50 hover:shadow-2xl hover:shadow-chartreuse/10`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-chartreuse">Next Session</p>
          <span className="text-xs text-text-muted">30 min consultation</span>
        </div>
        <h3 className="mt-3 text-2xl font-bold font-heading text-text">No upcoming consultations booked</h3>
        <p className="mt-2 text-base text-text-muted">Take the first step toward lasting wellness. Pick a slot that fits your day.</p>
        <a href="#book" className="mt-6 inline-block"><Button variant="primary">Book your first session</Button></a>
      </div>
    );
  }

  return (
    <div ref={cardRef} className={`${hoverClass} border-chartreuse/30 hover:border-chartreuse/60 hover:shadow-2xl hover:shadow-chartreuse/20`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-chartreuse">Next Appointment</span>
        <Pill status={appointment.status} />
      </div>
      <div className="mt-4">
        <p className="text-3xl sm:text-4xl font-extrabold font-heading text-text">{formatSlotTime(appointment.appointmentStart)} (IST)</p>
        <p className="text-base text-text-muted mt-1">{formatAppointmentDate(appointment.appointmentStart)}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!appointment.isConfirmed && onConfirm && (
          <Button variant="primary" onClick={() => onConfirm(appointment.id)} className="text-base py-2.5 px-5">
            Confirm I&apos;ll be there
          </Button>
        )}
        <a href="#my-bookings" className="text-sm text-text-muted hover:text-text underline transition-colors">Reschedule</a>
        <a href="#my-bookings" className="text-sm text-text-muted hover:text-chartreuse transition-colors">Cancel</a>
      </div>
    </div>
  );
}
