// Client-side IST formatting helpers using native Intl.DateTimeFormat.

export interface DayOption {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // "Wed"
  dayNum: string;  // "28"
  monthName: string; // "Oct"
  isToday: boolean;
}

// Format UTC ISO to "10:30 AM" in Asia/Kolkata timezone.
export function formatSlotTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// Format UTC ISO to "Wednesday, 28 Oct 2026" in Asia/Kolkata timezone.
export function formatAppointmentDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Generate the next 14 calendar days in IST.
export function getNext14Days(): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();

  // Get current date parts in Asia/Kolkata
  const istFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
  const baseIstStr = istFormatter.format(now);
  const baseDate = new Date(`${baseIstStr}T00:00:00+05:30`);

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = istFormatter.format(d);
    const dayName = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short" }).format(d);
    const dayNum = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric" }).format(d);
    const monthName = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", month: "short" }).format(d);

    days.push({ dateStr, dayName, dayNum, monthName, isToday: i === 0 });
  }

  return days;
}
