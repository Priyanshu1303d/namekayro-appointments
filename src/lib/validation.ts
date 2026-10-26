import { z } from "zod";
import { normalisePhone } from "./phone";
import { isOnGrid, isInPast } from "./time";

// Validates "YYYY-MM-DD" query param for slot lookup.
export const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
});

// Validates phone query param for client appointment lookup.
export const phoneLookupSchema = z.object({
  phone: z.string().min(1, "phone query parameter is required"),
});

// Checks client phone requirement and slot start time validity.
function refineAppointment(
  data: { source: string; phone?: string; appointmentStart: string },
  ctx: z.RefinementCtx
) {
  if (data.source === "client" && (!data.phone || data.phone.trim().length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "phone is required for client bookings" });
  }
  if (data.phone && normalisePhone(data.phone).length !== 10) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "phone must be a valid 10-digit number" });
  }
  const date = new Date(data.appointmentStart);
  if (isNaN(date.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["appointmentStart"], message: "appointmentStart must be a valid ISO date" });
  } else if (isInPast(date)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["appointmentStart"], message: "Cannot book slots in the past" });
  } else if (!isOnGrid(date)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["appointmentStart"], message: "appointmentStart must be on a 30-min slot between 09:00 and 17:30 IST" });
  }
}

// Validates appointment booking payload.
export const createAppointmentSchema = z
  .object({
    clientName: z.string().trim().min(1, "clientName is required"),
    phone: z.string().optional(),
    appointmentStart: z.string().min(1, "appointmentStart is required"),
    source: z.enum(["client", "nutritionist"]).default("client"),
  })
  .superRefine(refineAppointment);

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
