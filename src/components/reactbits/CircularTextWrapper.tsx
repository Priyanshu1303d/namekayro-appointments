"use client";

import React from "react";
import CircularTextOriginal from "./CircularText";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CircularText = CircularTextOriginal as React.ComponentType<any>;

export interface CircularTextWrapperProps {
  className?: string;
  size?: number;
  text?: string;
}

// Wrapper for React Bits CircularText with an interactive scroll-to-top center arrow.
export function CircularTextWrapper({
  className = "",
  size = 130,
  text = "BOOK*SHOW UP*FEEL GOOD*",
}: CircularTextWrapperProps) {
  return (
    <a
      href="#home"
      aria-label="Scroll to top of hero section"
      className={`group relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      <CircularText
        text={text}
        color="#FF2DAB"
        size={size}
        fontSize={12}
        fontWeight={700}
        spinDuration={24}
        onHover="slowDown"
        hoverTilt={10}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-pink group-hover:text-chartreuse group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,45,171,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(212,255,63,0.7)]"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </div>
    </a>
  );
}
