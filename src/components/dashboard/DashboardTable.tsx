"use client";

import { ClientAppointment } from "@/lib/client/types";
import { AppointmentRow } from "./AppointmentRow";
import { AppointmentCardItem } from "./AppointmentCardItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppointmentStatusType } from "@/components/ui/Pill";

interface DashboardTableProps {
  items: ClientAppointment[];
  loading: boolean;
  onStatusChange: (id: string, s: AppointmentStatusType) => void;
}

// Unified desktop table and mobile stacked card list with skeleton loading.
export function DashboardTable({ items, loading, onStatusChange }: DashboardTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 my-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl w-full" />)}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title="No appointments match" description="Adjust your filters or schedule a new consultation." />;
  }

  return (
    <div className="my-4">
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/5 bg-surface/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-text-muted bg-white/[0.02]">
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time (IST)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Confirmed</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((appt) => <AppointmentRow key={appt.id} item={appt} onStatusChange={onStatusChange} />)}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        {items.map((appt) => <AppointmentCardItem key={appt.id} item={appt} onStatusChange={onStatusChange} />)}
      </div>
    </div>
  );
}
