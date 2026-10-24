// Normalises any phone input to a clean 10-digit string.
// Strips spaces, dashes, "+", removes leading "91" or "0" if number is over 10 digits.
export function normalisePhone(raw: string): string {
  let digits = raw.replace(/[\s\-+]/g, "");

  if (digits.length > 10 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  if (digits.length > 10 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}
