"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FindBookingsFormProps {
  loading: boolean;
  onFind: (phone: string) => void;
}

// Phone entry form to find bookings when no client is saved in localStorage.
export function FindBookingsForm({ loading, onFind }: FindBookingsFormProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "");
    const clean = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
    if (clean.length !== 10) {
      return setError("Please enter a valid 10-digit phone number.");
    }
    onFind(clean);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-surface border border-white/10 max-w-md mx-auto flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-bold font-heading text-text">Find your bookings</h3>
        <p className="text-sm text-text-muted mt-1">Enter your 10-digit phone number to retrieve your scheduled sessions.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-text focus:outline-none focus:border-chartreuse text-sm"
        />
      </div>

      {error ? <p className="text-xs text-pink font-medium">{error}</p> : null}

      <Button type="submit" variant="primary" disabled={loading} className="w-full py-2.5">
        {loading ? "Searching..." : "Find My Bookings"}
      </Button>

      <p className="text-xs text-text-muted text-center mt-1">
        Demo mode: appointments are securely matched by phone number without passwords.
      </p>
    </form>
  );
}
