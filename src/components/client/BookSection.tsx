"use client";

import { useState } from "react";
import { SlotPicker } from "./SlotPicker";
import { BookingForm } from "./BookingForm";
import { BookingSuccess } from "./BookingSuccess";
import { bookAppointment } from "@/lib/client/api";
import { saveClient } from "@/lib/client/storage";
import { ClientAppointment } from "@/lib/client/types";

interface BookSectionProps {
  defaultName?: string;
  defaultPhone?: string;
  onBookingSuccess?: (appointment: ClientAppointment) => void;
}

// Complete Book section with full-viewport height and reusable SlotPicker.
export function BookSection({ defaultName, defaultPhone, onBookingSuccess }: BookSectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmedAppt, setConfirmedAppt] = useState<ClientAppointment | null>(null);

  const handleBooking = async (name: string, phone: string) => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const appt = await bookAppointment({ clientName: name, phone, appointmentStart: selectedSlot, source: "client" });
      saveClient({ name, phone });
      setConfirmedAppt(appt);
      onBookingSuccess?.(appt);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="min-h-screen flex flex-col justify-center py-24 border-t border-white/5">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-chartreuse">Step-by-step</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text mt-2">Book a consultation</h2>
        <p className="text-text-muted mt-2 text-base">Select a date and time that fits your schedule. No account required.</p>
      </div>
      {confirmedAppt ? (
        <BookingSuccess appointment={confirmedAppt} onReset={() => { setSelectedSlot(null); setConfirmedAppt(null); }} />
      ) : (
        <div className="flex flex-col gap-6">
          <SlotPicker selectedSlot={selectedSlot} onSelectSlot={(slot) => { setSelectedSlot(slot); setApiError(null); }} />
          {apiError && <p className="text-sm text-pink bg-pink/10 p-3.5 rounded-xl border border-pink/20 font-medium">{apiError}</p>}
          {selectedSlot && <BookingForm selectedSlot={selectedSlot} defaultName={defaultName} defaultPhone={defaultPhone} submitting={submitting} onSubmit={handleBooking} />}
        </div>
      )}
    </section>
  );
}
