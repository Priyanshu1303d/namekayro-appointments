"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Book", href: "#book" },
  { label: "My Bookings", href: "#my-bookings" },
];

// Responsive navigation: slim desktop top-nav and floating mobile bottom-bar.
export function Navbar() {
  const [activeTab, setActiveTab] = useState("#home");

  return (
    <>
      {/* Desktop Top Navigation */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/5 px-8 py-4 items-center justify-between">
        <Link href="#home" className="text-xl font-bold font-heading text-text flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-pink shadow-sm shadow-pink/50" />
          <span>Kayro Wellness</span>
        </Link>
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveTab(item.href)}
              className={`text-base transition-colors ${activeTab === item.href ? "text-pink font-semibold" : "text-text-muted hover:text-chartreuse font-medium"}`}
            >
              {item.label}
            </a>
          ))}
          <Link href="/dashboard" className="text-sm font-medium text-text-muted hover:text-chartreuse transition-colors ml-4 border-l border-white/10 pl-6">
            Nutritionist Portal →
          </Link>
        </nav>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-surface/90 backdrop-blur-xl border border-white/10 rounded-full px-5 sm:px-7 py-2.5 sm:py-3 shadow-2xl flex items-center gap-5 sm:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveTab(item.href)}
              className={`text-sm font-semibold py-1 transition-colors ${activeTab === item.href ? "text-pink" : "text-text-muted hover:text-chartreuse"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
