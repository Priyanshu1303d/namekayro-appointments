import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Namekayro Appointments — Holistic Wellness",
  description: "Seamless, login-free nutrition & wellness consultations.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} dark`}>
      <body className="bg-black text-text antialiased selection:bg-pink selection:text-black">
        {children}
      </body>
    </html>
  );
}
