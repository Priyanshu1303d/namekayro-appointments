import { NextRequest, NextResponse } from "next/server";
import { createAppointmentSchema } from "@/lib/validation";
import { createAppointment, SlotTakenError } from "@/lib/appointments";
import { listAppointments } from "@/lib/listAppointments";

// GET /api/appointments
// Lists dashboard appointments with optional ?today=true and ?status= filters.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const today = searchParams.get("today") === "true";
  const status = searchParams.get("status") || undefined;

  try {
    const data = await listAppointments({ today, status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// POST /api/appointments
// Creates an appointment, rejecting double-bookings with a 409 status.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = createAppointmentSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  try {
    const appointment = await createAppointment(parseResult.data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
