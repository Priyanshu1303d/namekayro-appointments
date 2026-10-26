"use client";

import { useRef } from "react";
import { HeroSection } from "./HeroSection";
import { NextAppointmentCard } from "./NextAppointmentCard";
import { LaserFlowWrapper } from "@/components/reactbits/LaserFlowWrapper";
import { ClientAppointment } from "@/lib/client/types";

interface HomeSectionProps {
  clientName?: string | null;
  nextAppointment?: ClientAppointment | null;
  onConfirmAppointment?: (id: string) => void;
}

// Hero section is full-screen left-aligned; the schedule laser card is centered below.
export function HomeSection({ clientName, nextAppointment, onConfirmAppointment }: HomeSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <section id="home" className="relative w-full flex flex-col pb-16">
      {/* Hero: full height, left-aligned with minimized padding */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <HeroSection clientName={clientName} />
      </div>

      {/* Schedule preview: expansive viewport height, centered */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 mt-6">
        <div
          id="schedule-preview"
          className="relative min-h-[85vh] rounded-3xl border border-white/10 bg-black/60 p-6 md:p-12 overflow-hidden flex flex-col justify-end"
        >
          <LaserFlowWrapper surfaceRef={cardRef} beamPosition={0.5} />
          <div className="relative z-10 max-w-xl mx-auto w-full">
            <NextAppointmentCard cardRef={cardRef} appointment={nextAppointment} onConfirm={onConfirmAppointment} />
          </div>
        </div>
      </div>
    </section>
  );
}
