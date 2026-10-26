"use client";

import { useState, useEffect, useCallback } from "react";
import { getSavedClient, saveClient, clearSavedClient, SavedClient } from "@/lib/client/storage";
import { lookupClientBookings, updateAppointment } from "@/lib/client/api";
import { ClientAppointment } from "@/lib/client/types";

// Hook managing saved client identity and bookings lookup.
export function useClientBookings() {
  const [client, setClient] = useState<SavedClient | null>(null);
  const [upcoming, setUpcoming] = useState<ClientAppointment[]>([]);
  const [past, setPast] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      const data = await lookupClientBookings(phone);
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
    } catch {
      setUpcoming([]);
      setPast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = getSavedClient();
    if (saved) { setClient(saved); loadBookings(saved.phone); }
  }, [loadBookings]);

  const confirmAppointment = async (id: string) => {
    await updateAppointment(id, { action: "confirm" });
    if (client) loadBookings(client.phone);
  };

  const findClient = async (phone: string) => {
    setLoading(true);
    try {
      const data = await lookupClientBookings(phone);
      const all = [...(data.upcoming || []), ...(data.past || [])];
      const newClient = { name: all[0]?.clientName || "Client", phone };
      saveClient(newClient);
      setClient(newClient);
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => { clearSavedClient(); setClient(null); setUpcoming([]); setPast([]); };

  return { client, setClient, upcoming, past, loading, loadBookings, confirmAppointment, findClient, clear };
}
