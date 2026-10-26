import { db } from "./db";
import { formatAppointment } from "./formatAppointment";
import { isOnGrid, isInPast } from "./time";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { SlotTakenError } from "./appointments";

export class NotFoundError extends Error {
  constructor(message = "Appointment not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

// Executes one PATCH action on an appointment (status, reschedule, cancel, confirm).
export async function patchAppointment(id: string, body: Record<string, unknown>) {
  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError();

  const isCancel = body.action === "cancel";
  const isConfirm = body.action === "confirm";
  const isStatus = Boolean(body.status) || body.action === "status";
  const isReschedule = Boolean(body.appointmentStart) || body.action === "reschedule";

  if ([isCancel, isConfirm, isStatus, isReschedule].filter(Boolean).length !== 1) {
    throw new Error("Request must specify exactly one action (status, reschedule, cancel, confirm)");
  }

  try {
    if (isCancel) {
      return formatAppointment(await db.appointment.update({ where: { id }, data: { status: "Cancelled" } }));
    }
    if (isConfirm) {
      return formatAppointment(await db.appointment.update({ where: { id }, data: { confirmedAt: new Date() } }));
    }
    if (isStatus) {
      const s = body.status === "No-show" ? "NoShow" : (body.status as string);
      if (!s || !(s in AppointmentStatus)) throw new Error("Invalid status");
      return formatAppointment(await db.appointment.update({ where: { id }, data: { status: s as AppointmentStatus } }));
    }
    const date = new Date(body.appointmentStart as string);
    if (isNaN(date.getTime())) throw new Error("Invalid ISO date");
    if (isInPast(date)) throw new Error("Cannot reschedule to a past slot");
    if (!isOnGrid(date)) throw new Error("Must be on 30-min grid between 09:00 and 17:30 IST");
    return formatAppointment(await db.appointment.update({ where: { id }, data: { appointmentStart: date } }));
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error?.code === "P2002" || error?.code === "23505" || error?.message?.includes("unique")) {
      throw new SlotTakenError();
    }
    throw err;
  }
}
