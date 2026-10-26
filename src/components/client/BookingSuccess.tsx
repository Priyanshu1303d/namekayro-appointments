"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { ClientAppointment } from "@/lib/client/types";

interface BookingSuccessProps {
  appointment: ClientAppointment;
  onReset: () => void;
}

// Celebration confirmation card animated with GSAP entrance.
export function BookingSuccess({ appointment, onReset }: BookingSuccessProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.from(cardRef.current, { scale: 0.85, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="p-8 rounded-3xl bg-surface border border-chartreuse/40 shadow-2xl flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-full bg-chartreuse/20 text-chartreuse flex items-center justify-center text-2xl font-bold border border-chartreuse/50">
        ✓
      </div>
      <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-chartreuse">Appointment Confirmed!</span>
      <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold font-heading text-text">We look forward to seeing you, {appointment.clientName.split(" ")[0]}.</h3>
      <p className="mt-2 text-sm text-text-muted">A confirmation has been saved to your schedule.</p>

      <div className="mt-6 w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-left">
        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Session Details</p>
        <p className="mt-1 text-lg font-bold font-heading text-text">{formatAppointmentDate(appointment.appointmentStart)}</p>
        <p className="text-base text-pink font-semibold mt-0.5">{formatSlotTime(appointment.appointmentStart)} (IST)</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center w-full">
        <a href="#my-bookings" className="w-full sm:w-auto">
          <Button variant="primary">View My Bookings</Button>
        </a>
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
          Book Another
        </Button>
      </div>
    </div>
  );
}
