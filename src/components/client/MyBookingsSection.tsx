"use client";

import { useState } from "react";
import { BookingsList } from "./BookingsList";
import { FindBookingsForm } from "./FindBookingsForm";
import { RescheduleModal } from "./RescheduleModal";
import { CancelModal } from "./CancelModal";
import { ClientAppointment } from "@/lib/client/types";
import { SavedClient } from "@/lib/client/storage";

interface MyBookingsSectionProps {
  client: SavedClient | null;
  upcoming: ClientAppointment[];
  past: ClientAppointment[];
  loading: boolean;
  onFindClient: (phone: string) => void;
  onClearClient: () => void;
  onConfirmAppointment: (id: string) => void;
  onAppointmentUpdated: (updated: ClientAppointment) => void;
}

// My Bookings section with full-viewport height and appointment modals.
export function MyBookingsSection(props: MyBookingsSectionProps) {
  const { client, upcoming, past, loading, onFindClient, onClearClient, onConfirmAppointment, onAppointmentUpdated } = props;
  const [rescheduling, setRescheduling] = useState<ClientAppointment | null>(null);
  const [cancelling, setCancelling] = useState<ClientAppointment | null>(null);

  return (
    <section id="my-bookings" className="min-h-screen flex flex-col justify-center py-24 border-t border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-chartreuse">Client Schedule</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text mt-2">My bookings</h2>
        </div>
        {client && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-muted">{client.name} ({client.phone})</span>
            <button onClick={onClearClient} className="text-chartreuse hover:underline font-medium text-xs cursor-pointer">
              Not you? Switch
            </button>
          </div>
        )}
      </div>

      {!client ? (
        <FindBookingsForm loading={loading} onFind={onFindClient} />
      ) : (
        <BookingsList upcoming={upcoming} past={past} onConfirm={onConfirmAppointment} onReschedule={setRescheduling} onCancel={setCancelling} />
      )}

      <RescheduleModal appointment={rescheduling} onClose={() => setRescheduling(null)} onSuccess={onAppointmentUpdated} />
      <CancelModal appointment={cancelling} onClose={() => setCancelling(null)} onSuccess={onAppointmentUpdated} />
    </section>
  );
}
