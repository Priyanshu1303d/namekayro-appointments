"use client";

import React, { useEffect, useState } from "react";
import LaserFlowOriginal from "./LaserFlow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LaserFlow = LaserFlowOriginal as React.ComponentType<any>;

export interface LaserFlowWrapperProps {
  surfaceRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  beamPosition?: number;
}

// Wrapper for React Bits LaserFlow with wellness design tokens.
// Calm pink beam (#FF2DAB), moderate intensity and fog, adaptive DPR on mobile for 60fps.
export function LaserFlowWrapper({ surfaceRef, className = "", beamPosition = 0.5 }: LaserFlowWrapperProps) {
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    if (window.innerWidth < 480) {
      setDpr(0.85);
    } else if (window.innerWidth < 768) {
      setDpr(1.0);
    }
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <LaserFlow
        surfaceRef={surfaceRef}
        color="#FF2DAB"
        beamPosition={beamPosition}
        intensity={1.0}
        fog={0.15}
        flare={1.2}
        spread={1.2}
        spill={0.8}
        dust={1.2}
        dpr={dpr}
      />
    </div>
  );
}
