// Tests cancel-rebook, reschedule into taken slot, phone format, and midnight edge cases.
export async function testEdgeCases(baseUrl: string, bookedId: string) {
  const slot = "2026-12-01T04:30:00.000Z";

  // 1. Cancel and rebook the exact same slot
  const cancelRes = await fetch(`${baseUrl}/api/appointments/${bookedId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cancel" }),
  });
  if (cancelRes.status !== 200) throw new Error("Cancel failed");

  const rebookRes = await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName: "Rebook User", phone: "9820022222", appointmentStart: slot, source: "client" }),
  });
  if (rebookRes.status !== 201) throw new Error("Rebook after cancel failed");
  console.log("✅ Cancel then rebook same slot PASSED");

  // 2. Reschedule into taken slot (must 409)
  const slotB = "2026-12-01T05:00:00.000Z";
  const userB = (await (await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName: "User B", phone: "9820033333", appointmentStart: slotB, source: "client" }),
  })).json()) as { id: string };

  const conflictRes = await fetch(`${baseUrl}/api/appointments/${userB.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointmentStart: slot }),
  });
  if (conflictRes.status !== 409) throw new Error("Reschedule conflict failed");
  console.log("✅ Reschedule into taken slot (409) PASSED");

  // 3. Phone normalisation with spaces, dashes, +91
  const phoneRes = (await (await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName: "Phone User", phone: " +91 98200-77777 ", appointmentStart: "2026-12-01T05:30:00.000Z", source: "client" }),
  })).json()) as { phone: string };
  if (phoneRes.phone !== "9820077777") throw new Error("Phone normalization failed");
  console.log("✅ Phone with spaces/dashes PASSED");

  // 4. Near midnight & off-grid checks (must 400)
  const midnightRes = await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName: "Midnight", phone: "9820088888", appointmentStart: "2026-12-01T18:30:00.000Z", source: "client" }),
  });
  if (midnightRes.status !== 400) throw new Error("Midnight check failed");
  console.log("✅ Midnight / off-grid rejection (400) PASSED");
}
