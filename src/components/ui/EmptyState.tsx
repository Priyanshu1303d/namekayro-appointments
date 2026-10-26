import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

// Friendly empty-state container with calm microcopy and optional action button.
export function EmptyState({ title, description, icon, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-surface border border-white/5 ${className}`}>
      {icon && <div className="mb-4 text-3xl text-pink">{icon}</div>}
      <h4 className="text-lg font-bold font-heading text-text mb-2">{title}</h4>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
