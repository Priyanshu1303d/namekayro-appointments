"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SlotPicker } from "./SlotPicker";
import { Button } from "@/components/ui/Button";
import { updateAppointment } from "@/lib/client/api";
import { ClientAppointment } from "@/lib/client/types";

interface RescheduleModalProps {
  appointment: ClientAppointment | null;
  onClose: () => void;
  onSuccess: (updated: ClientAppointment) => void;
}

// Reschedule dialog reusing SlotPicker with 409 conflict handling.
export function RescheduleModal({ appointment, onClose, onSuccess }: RescheduleModalProps) {
  const [newSlot, setNewSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReschedule = async () => {
    if (!appointment || !newSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateAppointment(appointment.id, { action: "reschedule", appointmentStart: newSlot });
      onSuccess(res);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reschedule";
      setError(msg.includes("taken") || msg.includes("409") ? "This slot was just booked by someone else. Please select another time." : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={Boolean(appointment)} onClose={onClose} title="Reschedule Session">
      <div className="flex flex-col gap-5">
        <SlotPicker selectedSlot={newSlot} onSelectSlot={(slot) => { setNewSlot(slot); setError(null); }} />
        {error ? <p className="text-xs text-pink bg-pink/10 p-3 rounded-xl border border-pink/20 font-medium">{error}</p> : null}
        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleReschedule} disabled={!newSlot || submitting}>
            {submitting ? "Saving..." : "Confirm New Time"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
