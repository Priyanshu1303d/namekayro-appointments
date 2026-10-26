"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SlotPicker } from "@/components/client/SlotPicker";
import { Button } from "@/components/ui/Button";
import { bookAppointment } from "@/lib/client/api";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Nutritionist modal to manually add an appointment with optional phone and reusable SlotPicker.
export function AddAppointmentModal({ isOpen, onClose, onSuccess }: AddAppointmentModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter client name.");
    if (!slot) return setError("Please select an available slot.");
    setSubmitting(true);
    setError(null);
    try {
      await bookAppointment({ clientName: name.trim(), phone: phone.trim() || undefined, appointmentStart: slot, source: "nutritionist" });
      onSuccess(); onClose(); setName(""); setPhone(""); setSlot(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add appointment");
    } finally { setSubmitting(false); }
  };

  const inp = "w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-text text-sm focus:outline-none focus:border-pink";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Client Appointment">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-1">Client Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maya Verma" className={inp} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-1">Phone Number (Optional)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inp} />
        </div>
        <SlotPicker selectedSlot={slot} onSelectSlot={(s) => { setSlot(s); setError(null); }} />
        {error && <p className="text-xs text-pink bg-pink/10 p-2.5 rounded-xl border border-pink/20">{error}</p>}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={submitting || !slot}>{submitting ? "Booking..." : "Schedule Appointment"}</Button>
        </div>
      </form>
    </Modal>
  );
}
