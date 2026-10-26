import { startOfDay, endOfDay, addMinutes } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { TIMEZONE, OPENING_HOUR, CLOSING_HOUR, SLOT_MINUTES } from "./config";

// UTC start (00:00) and end (23:59:59) of the IST day that contains utcDate (defaults to now).
export function getISTDayBounds(utcDate: Date = new Date()): { start: Date; end: Date } {
  const inIST = toZonedTime(utcDate, TIMEZONE);
  return {
    start: fromZonedTime(startOfDay(inIST), TIMEZONE),
    end: fromZonedTime(endOfDay(inIST), TIMEZONE),
  };
}

// All slot start times (as UTC Dates) for the IST day that contains utcDate.
// Produces 18 slots: 09:00–17:30 IST in 30-min steps.
export function buildDaySlots(utcDate: Date): Date[] {
  const inIST = toZonedTime(utcDate, TIMEZONE);
  const dayStart = startOfDay(inIST);

  const slots: Date[] = [];
  for (let min = OPENING_HOUR * 60; min < CLOSING_HOUR * 60; min += SLOT_MINUTES) {
    slots.push(fromZonedTime(addMinutes(dayStart, min), TIMEZONE));
  }
  return slots;
}

// IST zoned Date → UTC. Use before saving to DB.
export function istToUTC(zonedIST: Date): Date {
  return fromZonedTime(zonedIST, TIMEZONE);
}

// UTC Date → IST zoned Date. getHours()/getMinutes() will reflect IST. Do NOT store in DB.
export function utcToIST(utcDate: Date): Date {
  return toZonedTime(utcDate, TIMEZONE);
}

// True if utcDate is on a valid 30-min slot boundary within business hours (IST).
export function isOnGrid(utcDate: Date): boolean {
  const inIST = toZonedTime(utcDate, TIMEZONE);
  const h = inIST.getHours();
  const m = inIST.getMinutes();

  if (inIST.getSeconds() !== 0 || inIST.getMilliseconds() !== 0) return false;
  if (m % SLOT_MINUTES !== 0) return false;

  const totalMin = h * 60 + m;
  return totalMin >= OPENING_HOUR * 60 && totalMin < CLOSING_HOUR * 60;
}

// Parses "YYYY-MM-DD" as midnight IST and returns it as a UTC Date.
export function parseISTDate(dateStr: string): Date {
  return fromZonedTime(`${dateStr} 00:00:00`, TIMEZONE);
}

// True if utcDate is already in the past.
export function isInPast(utcDate: Date): boolean {
  return utcDate < new Date();
}
