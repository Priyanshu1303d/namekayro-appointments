import { NextRequest, NextResponse } from "next/server";
import { patchAppointment, NotFoundError } from "@/lib/patchAppointment";
import { SlotTakenError } from "@/lib/appointments";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/appointments/[id]
// Handles one action per request: status, reschedule, cancel, or confirm.
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const updated = await patchAppointment(id, body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const error = err as Error;
    return NextResponse.json({ error: error.message || "Failed to update appointment" }, { status: 400 });
  }
}
