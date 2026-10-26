import "dotenv/config";
import { db } from "../src/lib/db";

// Hand-normalised sample rows (times stored as UTC, dates DD/MM/YYYY, phones 10 digits).
const sampleAppointments = [
  // Raw: Riya Shah | 98200 11111 | 24/10/2026 | 10:00 | Booked
  // Clean: phone="9820011111", start=2026-10-24 10:00 IST -> 2026-10-24T04:30:00.000Z
  {
    clientName: "Riya Shah",
    phone: "9820011111",
    appointmentStart: new Date("2026-10-24T04:30:00.000Z"),
    status: "Booked" as const,
  },
  // Raw: Arjun Mehta | 98200 22222 | 2026-10-24 | 11:30am | Booked
  // Clean: phone="9820022222", start=2026-10-24 11:30 IST -> 2026-10-24T06:00:00.000Z
  {
    clientName: "Arjun Mehta",
    phone: "9820022222",
    appointmentStart: new Date("2026-10-24T06:00:00.000Z"),
    status: "Booked" as const,
  },
  // Raw: Riya Shah | 9820011111 | 25-10-2026 | 4 pm | Booked
  // Clean: phone="9820011111", start=2026-10-25 16:00 IST -> 2026-10-25T10:30:00.000Z
  {
    clientName: "Riya Shah",
    phone: "9820011111",
    appointmentStart: new Date("2026-10-25T10:30:00.000Z"),
    status: "Booked" as const,
  },
  // Raw: Meera Iyer | (none) | 23/10/2026 | 09:00 | Done
  // Clean: phone=null, start=2026-10-23 09:00 IST -> 2026-10-23T03:30:00.000Z
  {
    clientName: "Meera Iyer",
    phone: null,
    appointmentStart: new Date("2026-10-23T03:30:00.000Z"),
    status: "Done" as const,
  },
  // Raw: Kabir Rao | 98200 33333 | 22/10/2026 | 14:00 | No-show
  // Clean: phone="9820033333", start=2026-10-22 14:00 IST -> 2026-10-22T08:30:00.000Z
  {
    clientName: "Kabir Rao",
    phone: "9820033333",
    appointmentStart: new Date("2026-10-22T08:30:00.000Z"),
    status: "NoShow" as const,
  },
];

// Clears existing appointments and inserts clean sample data. Safe to run multiple times.
async function main() {
  await db.appointment.deleteMany();
  for (const item of sampleAppointments) {
    await db.appointment.create({ data: item });
  }
  const rows = await db.appointment.findMany({ orderBy: { appointmentStart: "asc" } });
  console.log("Seeded", rows.length, "appointments successfully:\n", JSON.stringify(rows, null, 2));
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
