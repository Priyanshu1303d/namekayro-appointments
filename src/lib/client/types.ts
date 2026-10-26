import type { AppointmentStatusType } from "@/components/ui/Pill";

export interface ClientAppointment {
  id: string;
  clientName: string;
  phone: string | null;
  appointmentStart: string;
  status: AppointmentStatusType;
  confirmedAt: string | null;
  reminderSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  isConfirmed: boolean;
}

export interface SlotItem {
  start: string;
  available: boolean;
}

export interface CreateAppointmentPayload {
  clientName: string;
  phone?: string;
  appointmentStart: string;
  source: "client" | "nutritionist";
}

export type PatchAppointmentPayload =
  | { action: "confirm" }
  | { action: "cancel" }
  | { status: AppointmentStatusType }
  | { action: "reschedule"; appointmentStart: string };
