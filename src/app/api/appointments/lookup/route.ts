import { NextRequest, NextResponse } from "next/server";
import { phoneLookupSchema } from "@/lib/validation";
import { lookupAppointmentsByPhone } from "@/lib/lookupAppointments";

// GET /api/appointments/lookup?phone=...
// Returns a client's appointments split into upcoming and past.
export async function GET(request: NextRequest) {
  const phoneParam = request.nextUrl.searchParams.get("phone");
  const parseResult = phoneLookupSchema.safeParse({ phone: phoneParam });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.issues[0]?.message || "phone query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const data = await lookupAppointmentsByPhone(parseResult.data.phone);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
