// Formats appointment database rows for API output.
// Ensures NoShow maps to "No-show" and computes the boolean isConfirmed field.
export function formatAppointment<T extends { status: string; confirmedAt: Date | null }>(apt: T) {
  return {
    ...apt,
    status: apt.status === "NoShow" ? "No-show" : apt.status,
    isConfirmed: apt.confirmedAt !== null,
  };
}
