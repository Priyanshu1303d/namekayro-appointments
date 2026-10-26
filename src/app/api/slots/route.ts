import { NextRequest, NextResponse } from "next/server";
import { slotsQuerySchema } from "@/lib/validation";
import { getSlotsForDate } from "@/lib/slots";

// GET /api/slots?date=YYYY-MM-DD
// Returns all slots for that IST date with availability status.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parseResult = slotsQuerySchema.safeParse({
    date: searchParams.get("date"),
  });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.issues[0]?.message || "Invalid date query parameter" },
      { status: 400 }
    );
  }

  try {
    const slots = await getSlotsForDate(parseResult.data.date);
    return NextResponse.json({ date: parseResult.data.date, slots });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
