const BASE = "http://127.0.0.1:3000";

interface CheckResult {
  step: string;
  passed: boolean;
  details: string;
}

const results: CheckResult[] = [];

async function main() {
  console.log("Starting Section 7B End-to-End API Checks against " + BASE);

  // 1. Cleanup any leftover test appointment from previous runs
  const initial = await fetch(`${BASE}/api/appointments`).then((r) => r.json());
  for (const a of initial) {
    if (a.clientName.includes("E2E Test") || a.clientName.includes("WalkIn")) {
      await fetch(`${BASE}/api/appointments/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
    }
  }

  // Flow A: Book as client and verify in dashboard
  const slotA = "2026-11-15T04:30:00.000Z"; // 10:00 AM IST
  const resA = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: "E2E Test Client",
      phone: "+91 99999 88888",
      appointmentStart: slotA,
      source: "client",
    }),
  });
  const bookA = await resA.json();
  const allApptsA = await fetch(`${BASE}/api/appointments`).then((r) => r.json());
  const foundA = allApptsA.find((a: any) => a.id === bookA.id);
  results.push({
    step: "Flow A: Client Book & Dashboard presence",
    passed: resA.status === 201 && Boolean(foundA) && foundA.phone === "9999988888",
    details: `Status ${resA.status}, found in list: ${Boolean(foundA)}`,
  });

  // Flow B: Nutritionist adds appointment with no phone
  const slotB = "2026-11-15T05:00:00.000Z"; // 10:30 AM IST
  const resB = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: "WalkIn Client",
      appointmentStart: slotB,
      source: "nutritionist",
    }),
  });
  const bookB = await resB.json();
  results.push({
    step: "Flow B: Nutritionist booking with optional/no phone",
    passed: resB.status === 201 && bookB.phone === null,
    details: `Status ${resB.status}, phone is ${bookB.phone}`,
  });

  // Flow C: Change status to Done and No-show
  const patchDone = await fetch(`${BASE}/api/appointments/${bookA.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Done" }),
  }).then((r) => r.json());

  const patchNoShow = await fetch(`${BASE}/api/appointments/${bookA.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "No-show" }),
  }).then((r) => r.json());

  results.push({
    step: "Flow C: Change status to Done and No-show",
    passed: patchDone.status === "Done" && patchNoShow.status === "No-show",
    details: `Status transitions verified: Done -> No-show`,
  });

  // Flow D: Reschedule into taken slot -> 409
  // Put bookA back to Booked
  await fetch(`${BASE}/api/appointments/${bookA.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Booked" }),
  });
  const resD = await fetch(`${BASE}/api/appointments/${bookB.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reschedule", appointmentStart: slotA }),
  });
  results.push({
    step: "Flow D: Reschedule into taken slot returns 409",
    passed: resD.status === 409,
    details: `HTTP status ${resD.status} (expected 409 Conflict)`,
  });

  // Flow E: Cancel appointment, verify slot is freed, then rebook
  const resCancel = await fetch(`${BASE}/api/appointments/${bookA.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cancel" }),
  });
  const slotsDate = await fetch(`${BASE}/api/slots?date=2026-11-15`).then((r) => r.json());
  const freedSlot = slotsDate.slots.find((s: any) => s.start === slotA);

  const resRebook = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: "Rebooked Client",
      phone: "+91 91111 22222",
      appointmentStart: slotA,
      source: "client",
    }),
  });
  results.push({
    step: "Flow E: Cancel frees slot & rebook succeeds",
    passed: resCancel.status === 200 && freedSlot?.available === true && resRebook.status === 201,
    details: `Cancel: ${resCancel.status}, Slot available: ${freedSlot?.available}, Rebook: ${resRebook.status}`,
  });

  // Flow F: Verify 5 seeded sample rows
  const allAppts = await fetch(`${BASE}/api/appointments`).then((r) => r.json());
  const riya1 = allAppts.find((a: any) => a.clientName.toLowerCase().includes("riya") && a.appointmentStart === "2026-10-24T04:30:00.000Z");
  const riya2 = allAppts.find((a: any) => a.clientName.toLowerCase().includes("riya") && a.appointmentStart === "2026-10-25T10:30:00.000Z");
  const arjun = allAppts.find((a: any) => a.clientName.toLowerCase().includes("arjun") && a.appointmentStart === "2026-10-24T06:00:00.000Z");
  const meera = allAppts.find((a: any) => a.clientName.toLowerCase().includes("meera") && a.phone === null);
  const kabir = allAppts.find((a: any) => a.clientName.toLowerCase().includes("kabir") && a.appointmentStart === "2026-10-22T08:30:00.000Z");

  const seededFound = Boolean(riya1 && riya2 && arjun && meera && kabir);
  results.push({
    step: "Flow F: 5 Seeded sample rows in IST",
    passed: seededFound,
    details: `Riya1: ${Boolean(riya1)}, Riya2: ${Boolean(riya2)}, Arjun: ${Boolean(arjun)}, Meera: ${Boolean(meera)}, Kabir: ${Boolean(kabir)}`,
  });

  // Clean up rebooked appointment
  const rebookedData = await resRebook.json();
  if (rebookedData.id) {
    await fetch(`${BASE}/api/appointments/${rebookedData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
  }
  if (bookB.id) {
    await fetch(`${BASE}/api/appointments/${bookB.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
  }

  console.log("\n=================== TEST RESULTS ===================");
  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${icon} | ${r.step} - ${r.details}`);
    if (!r.passed) allPassed = false;
  }
  console.log("====================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
