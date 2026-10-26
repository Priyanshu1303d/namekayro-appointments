"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
  onAddClick: () => void;
  onRefresh: () => void;
  loading: boolean;
}

// Clean navigation header with Add Appointment trigger and link back to client view.
export function DashboardHeader({ onAddClick, onRefresh, loading }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
      <div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-text-muted hover:text-pink transition-colors">
            ← Client View
          </Link>
          <span className="text-xs text-white/20">•</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink">Management Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text mt-1">Consultation Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "↻ Refresh"}
        </Button>
        <Button variant="primary" size="sm" onClick={onAddClick}>
          + Add Appointment
        </Button>
      </div>
    </header>
  );
}
