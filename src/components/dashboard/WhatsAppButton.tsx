"use client";

interface WhatsAppButtonProps {
  phone: string | null;
  clientName: string;
  dateStr: string;
  timeStr: string;
}

// Generates a prefilled WhatsApp reminder link (wa.me) for unconfirmed upcoming sessions.
export function WhatsAppButton({ phone, clientName, dateStr, timeStr }: WhatsAppButtonProps) {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  const firstName = clientName.split(" ")[0];
  const msg = `Hi ${firstName}, gentle reminder from Kayro Wellness regarding your consultation on ${dateStr} at ${timeStr} (IST). Looking forward to seeing you!`;
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
    >
      <span>💬 Remind</span>
    </a>
  );
}
