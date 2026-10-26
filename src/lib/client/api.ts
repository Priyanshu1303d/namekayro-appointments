import { ClientAppointment, SlotItem, CreateAppointmentPayload, PatchAppointmentPayload } from "./types";

// Helper to make client fetch requests and extract JSON or throw clear errors.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// GET /api/slots?date=YYYY-MM-DD
export async function getSlots(date: string): Promise<SlotItem[]> {
  const res = await request<{ slots: SlotItem[] }>(`/api/slots?date=${encodeURIComponent(date)}`);
  return res.slots;
}

// POST /api/appointments
export async function bookAppointment(payload: CreateAppointmentPayload): Promise<ClientAppointment> {
  return request<ClientAppointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// GET /api/appointments?today=true&status=...
export async function getDashboardAppointments(params?: { today?: boolean; status?: string }): Promise<ClientAppointment[]> {
  const query = new URLSearchParams();
  if (params?.today) query.set("today", "true");
  if (params?.status) query.set("status", params.status);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return request<ClientAppointment[]>(`/api/appointments${qs}`);
}

// GET /api/appointments/lookup?phone=...
export async function lookupClientBookings(phone: string): Promise<{ upcoming: ClientAppointment[]; past: ClientAppointment[] }> {
  return request<{ upcoming: ClientAppointment[]; past: ClientAppointment[] }>(
    `/api/appointments/lookup?phone=${encodeURIComponent(phone)}`
  );
}

// PATCH /api/appointments/[id]
export async function updateAppointment(id: string, payload: PatchAppointmentPayload): Promise<ClientAppointment> {
  return request<ClientAppointment>(`/api/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
