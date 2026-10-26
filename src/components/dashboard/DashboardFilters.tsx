"use client";

interface DashboardFiltersProps {
  todayOnly: boolean;
  onToggleToday: (today: boolean) => void;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  showCancelled: boolean;
  onToggleCancelled: (show: boolean) => void;
}

// Filtering controls: All/Today toggle, Status select, and Show Cancelled toggle.
export function DashboardFilters(props: DashboardFiltersProps) {
  const { todayOnly, onToggleToday, statusFilter, onSelectStatus, showCancelled, onToggleCancelled } = props;
  const btn = (active: boolean, onClick: () => void, text: string) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
        active ? "bg-pink text-black hover:bg-chartreuse" : "bg-surface text-text-muted hover:text-chartreuse hover:bg-white/5"
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 bg-surface/50 p-4 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2">
        {btn(!todayOnly, () => onToggleToday(false), "All Dates")}
        {btn(todayOnly, () => onToggleToday(true), "Today Only")}
      </div>
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => onSelectStatus(e.target.value)}
          className="bg-surface border border-white/10 text-text text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-chartreuse cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Booked">Booked</option>
          <option value="Done">Done</option>
          <option value="No-show">No-show</option>
        </select>
        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none">
          <input type="checkbox" checked={showCancelled} onChange={(e) => onToggleCancelled(e.target.checked)} className="rounded border-white/20 text-pink accent-pink cursor-pointer" />
          <span>Show cancelled</span>
        </label>
      </div>
    </div>
  );
}
