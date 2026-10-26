import "dotenv/config";
import { db } from "../src/lib/db";
import { testConcurrency } from "./concurrency";
import { testEdgeCases } from "./edge-cases";

// Cleans up test date records before and after running tests.
async function cleanTestRecords() {
  await db.appointment.deleteMany({
    where: {
      appointmentStart: {
        gte: new Date("2026-12-01T00:00:00.000Z"),
        lte: new Date("2026-12-01T23:59:59.999Z"),
      },
    },
  });
}

// Runs all Section 6 backend hardening and concurrency tests.
async function main() {
  const baseUrl = "http://localhost:3000";
  console.log("Cleaning up prior test records for 2026-12-01...");
  await cleanTestRecords();

  console.log("Running Section 6 Backend Hardening Tests against", baseUrl, "\n");
  const bookedId = await testConcurrency(baseUrl);
  await testEdgeCases(baseUrl, bookedId);

  await cleanTestRecords();
  console.log("\n🎉 ALL SECTION 6 HARDENING & CONCURRENCY TESTS PASSED!");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Hardening test failed:", err);
  process.exit(1);
});
