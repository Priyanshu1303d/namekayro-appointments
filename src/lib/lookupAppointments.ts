import { db } from "./db";
import { normalisePhone } from "./phone";
import { formatAppointment } from "./formatAppointment";

// Looks up a client's bookings by phone and splits them into upcoming and past.
export async function lookupAppointmentsByPhone(rawPhone: string) {
  const cleanPhone = normalisePhone(rawPhone);
  if (cleanPhone.length !== 10) {
    throw new Error("phone must be a valid 10-digit number");
  }

  const rows = await db.appointment.findMany({
    where: { phone: cleanPhone },
    orderBy: { appointmentStart: "asc" },
  });

  const now = new Date();
  const upcoming: ReturnType<typeof formatAppointment>[] = [];
  const past: ReturnType<typeof formatAppointment>[] = [];

  for (const row of rows) {
    const formatted = formatAppointment(row);
    if (row.appointmentStart >= now) {
      upcoming.push(formatted);
    } else {
      past.push(formatted);
    }
  }

  return { upcoming, past };
}
