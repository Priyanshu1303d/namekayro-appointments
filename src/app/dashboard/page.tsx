"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryStrip } from "@/components/dashboard/SummaryStrip";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { AddAppointmentModal } from "@/components/dashboard/AddAppointmentModal";
import { useDashboardData } from "@/hooks/useDashboardData";

// Nutritionist Management Portal (/dashboard): calm, dense, auto-refreshing consultation overview.
export default function DashboardPage() {
  const [todayOnly, setTodayOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { appointments, loading, error, reload, changeStatus, setError } = useDashboardData(todayOnly, statusFilter);
  const visibleItems = showCancelled ? appointments : appointments.filter((a) => a.status !== "Cancelled");

  return (
    <div className="min-h-screen bg-black text-text p-4 sm:p-8 max-w-6xl mx-auto">
      <DashboardHeader onAddClick={() => setIsAddOpen(true)} onRefresh={reload} loading={loading} />
      <SummaryStrip appointments={appointments} />
      <DashboardFilters
        todayOnly={todayOnly}
        onToggleToday={setTodayOnly}
        statusFilter={statusFilter}
        onSelectStatus={setStatusFilter}
        showCancelled={showCancelled}
        onToggleCancelled={setShowCancelled}
      />
      {error && (
        <div className="my-3 p-3 rounded-xl bg-pink/10 border border-pink/20 text-xs text-pink flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-pink hover:text-white font-bold ml-2">✕</button>
        </div>
      )}
      <DashboardTable items={visibleItems} loading={loading} onStatusChange={changeStatus} />
      <AddAppointmentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={reload} />
    </div>
  );
}
