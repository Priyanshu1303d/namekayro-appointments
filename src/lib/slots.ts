import { db } from "./db";
import { parseISTDate, getISTDayBounds, buildDaySlots, isInPast } from "./time";

export interface SlotAvailability {
  start: string;
  available: boolean;
}

// Returns all 18 slots for an IST date with available true/false.
// Taken slots and past slots are marked unavailable.
export async function getSlotsForDate(dateStr: string): Promise<SlotAvailability[]> {
  const dayDate = parseISTDate(dateStr);
  const { start, end } = getISTDayBounds(dayDate);

  const bookedAppointments = await db.appointment.findMany({
    where: {
      appointmentStart: { gte: start, lte: end },
      status: { not: "Cancelled" },
    },
    select: { appointmentStart: true },
  });

  const bookedSet = new Set(bookedAppointments.map((a) => a.appointmentStart.getTime()));
  const allSlots = buildDaySlots(dayDate);

  return allSlots.map((slot) => ({
    start: slot.toISOString(),
    available: !bookedSet.has(slot.getTime()) && !isInPast(slot),
  }));
}
