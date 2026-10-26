// Fires 5 simultaneous bookings for the exact same slot.
// Verifies that exactly ONE succeeds (201) and four get 409.
export async function testConcurrency(baseUrl: string): Promise<string> {
  const slot = "2026-12-01T04:30:00.000Z";
  const requests = Array.from({ length: 5 }, (_, i) =>
    fetch(`${baseUrl}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: `Concurrent User ${i + 1}`,
        phone: `98200 1111${i}`,
        appointmentStart: slot,
        source: "client",
      }),
    })
  );

  const responses = await Promise.all(requests);
  const statusCodes = responses.map((r) => r.status);
  const count201 = statusCodes.filter((s) => s === 201).length;
  const count409 = statusCodes.filter((s) => s === 409).length;

  console.log("Concurrency Status Codes:", statusCodes);
  if (count201 === 1 && count409 === 4) {
    console.log("✅ Concurrency test PASSED: Exactly 1 succeeded (201) and 4 rejected (409).");
    const winner = (await responses.find((r) => r.status === 201)!.json()) as { id: string };
    return winner.id;
  }
  throw new Error(`Expected 1x201 and 4x409, got ${count201}x201 and ${count409}x409`);
}
