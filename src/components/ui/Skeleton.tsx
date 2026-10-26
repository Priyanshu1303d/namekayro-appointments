import React from "react";

export interface SkeletonProps {
  className?: string;
}

// Gentle pulsing skeleton placeholder for loading states.
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl bg-white/5 border border-white/5 ${className}`}
    />
  );
}
