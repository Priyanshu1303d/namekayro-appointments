import { db } from "./db";
import { getISTDayBounds } from "./time";
import { formatAppointment } from "./formatAppointment";
import { AppointmentStatus } from "@/generated/prisma/enums";

export interface AppointmentFilters {
  today?: boolean;
  status?: string;
}

// Lists appointments for the dashboard, sorted by time ascending.
// Supports optional filters: today=true (IST day) and status (e.g. Booked, Done, No-show).
export async function listAppointments(filters: AppointmentFilters = {}) {
  const where: { appointmentStart?: { gte: Date; lte: Date }; status?: AppointmentStatus } = {};

  if (filters.today) {
    const { start, end } = getISTDayBounds();
    where.appointmentStart = { gte: start, lte: end };
  }

  if (filters.status) {
    const statusKey = filters.status === "No-show" ? "NoShow" : filters.status;
    if (statusKey in AppointmentStatus) {
      where.status = statusKey as AppointmentStatus;
    }
  }

  const rows = await db.appointment.findMany({
    where,
    orderBy: { appointmentStart: "asc" },
  });

  return rows.map(formatAppointment);
}
