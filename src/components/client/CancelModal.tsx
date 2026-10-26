"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { updateAppointment } from "@/lib/client/api";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";
import { ClientAppointment } from "@/lib/client/types";

interface CancelModalProps {
  appointment: ClientAppointment | null;
  onClose: () => void;
  onSuccess: (updated: ClientAppointment) => void;
}

// Confirmation dialog to safely cancel an upcoming appointment.
export function CancelModal({ appointment, onClose, onSuccess }: CancelModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!appointment) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateAppointment(appointment.id, { action: "cancel" });
      onSuccess(res);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={Boolean(appointment)} onClose={onClose} title="Cancel Appointment">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">Are you sure you want to cancel your consultation on:</p>
        {appointment && (
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
            <p className="text-base font-bold font-heading text-text">{formatAppointmentDate(appointment.appointmentStart)}</p>
            <p className="text-sm font-semibold text-pink mt-0.5">{formatSlotTime(appointment.appointmentStart)} (IST)</p>
          </div>
        )}
        <p className="text-xs text-text-muted">This slot will be released for other clients to book.</p>
        {error && <p className="text-xs text-pink">{error}</p>}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Keep Session</Button>
          <Button variant="outline" onClick={handleCancel} disabled={submitting} className="border-pink/40 text-pink hover:bg-pink/10">
            {submitting ? "Cancelling..." : "Yes, Cancel Session"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
