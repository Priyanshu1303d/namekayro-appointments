"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardAppointments, updateAppointment } from "@/lib/client/api";
import { ClientAppointment } from "@/lib/client/types";
import { AppointmentStatusType } from "@/components/ui/Pill";

// Manages dashboard appointments with 30s auto-refresh, visibility polling, and optimistic updates.
export function useDashboardData(todayOnly: boolean, statusFilter: string) {
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getDashboardAppointments({ today: todayOnly || undefined, status: statusFilter || undefined });
      setAppointments(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [todayOnly, statusFilter]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    const onVisibility = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const changeStatus = async (id: string, newStatus: AppointmentStatusType) => {
    const prev = [...appointments];
    setAppointments((curr) => curr.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    try {
      await updateAppointment(id, { status: newStatus });
    } catch {
      setAppointments(prev);
      setError("Failed to update status. Reverted to previous value.");
    }
  };

  return { appointments, loading, error, reload: load, changeStatus, setError };
}
