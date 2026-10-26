"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatAppointmentDate, formatSlotTime } from "@/lib/client/format";

interface BookingFormProps {
  selectedSlot: string;
  defaultName?: string;
  defaultPhone?: string;
  submitting: boolean;
  onSubmit: (name: string, phone: string) => void;
}

// Booking form collecting client name and Indian phone number.
export function BookingForm({ selectedSlot, defaultName = "", defaultPhone = "", submitting, onSubmit }: BookingFormProps) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    const digits = phone.replace(/\D/g, "");
    const cleanPhone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    if (cleanPhone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
    onSubmit(name.trim(), phone.trim());
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-text focus:outline-none focus:border-chartreuse text-sm";

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface border border-white/10 flex flex-col gap-4">
      <div className="p-3.5 rounded-xl bg-chartreuse/10 border border-chartreuse/20 text-xs sm:text-sm text-text">
        <span className="font-semibold text-chartreuse uppercase tracking-wider block mb-1">Session Summary</span>
        <span className="font-bold">{formatAppointmentDate(selectedSlot)}</span> at <span className="font-bold text-chartreuse">{formatSlotTime(selectedSlot)} (IST)</span>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">Your Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
      </div>
      {error ? <p className="text-xs text-pink font-medium">{error}</p> : null}
      <Button type="submit" variant="primary" disabled={submitting} className="w-full mt-2 py-3 text-base">
        {submitting ? "Securing your slot..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
