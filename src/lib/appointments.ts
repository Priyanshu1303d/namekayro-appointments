import { db } from "./db";
import { normalisePhone } from "./phone";
import { formatAppointment } from "./formatAppointment";
import { CreateAppointmentInput } from "./validation";

// Thrown when the slot is already taken by an active appointment.
export class SlotTakenError extends Error {
  constructor() {
    super("That slot was just taken, please pick another.");
    this.name = "SlotTakenError";
  }
}

// Creates an appointment with normalized phone.
// Catches database double-booking violations and throws SlotTakenError.
export async function createAppointment(input: CreateAppointmentInput) {
  const phone = input.phone && input.phone.trim().length > 0 ? normalisePhone(input.phone) : null;
  const appointmentStart = new Date(input.appointmentStart);

  try {
    const created = await db.appointment.create({
      data: {
        clientName: input.clientName,
        phone,
        appointmentStart,
        status: "Booked",
      },
    });
    return formatAppointment(created);
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error?.code === "P2002" || error?.code === "23505" || error?.message?.includes("unique")) {
      throw new SlotTakenError();
    }
    throw err;
  }
}
