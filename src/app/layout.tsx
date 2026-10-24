import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Namekayro Appointments",
  description: "Appointment booking for wellness practice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
