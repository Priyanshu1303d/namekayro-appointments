"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
  clientName?: string | null;
}

// Full-screen, full-width left-aligned hero section with text on left and capsule image on right.
export function HeroSection({ clientName }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.from(".hero-anim", { opacity: 0, y: 24, duration: 0.8, stagger: 0.1, ease: "power2.out" });
    gsap.to(".hero-capsule", { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full min-h-[100dvh] pt-24 pb-16 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
      <div className="w-full flex-1 flex flex-col items-start text-left pl-0">
        <div className="hero-anim inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink/30 bg-pink/10 text-pink text-xs font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
          <span>Holistic Nutrition & Wellness Practice</span>
        </div>
        <h1 className="hero-anim mt-5 text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-text tracking-tight leading-[1.1] max-w-4xl">
          {clientName ? `Welcome back, ${clientName.split(" ")[0]}.` : <>Nourish your body, <span className="text-pink">gently &amp;</span> <span className="text-chartreuse">sustainably</span>.</>}
        </h1>
        <p className="hero-anim mt-5 text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl">
          One-on-one nutrition consultations designed around your lifestyle. No calorie counting or guilt — just realistic balance, mindful eating, and lasting vitality.
        </p>
        <div className="hero-anim mt-8 flex flex-wrap items-center gap-4">
          <a href="#book"><Button variant="primary" size="lg">Book a Consultation</Button></a>
          <a href="#schedule-preview"><Button variant="outline" size="lg">View Next Session ↓</Button></a>
        </div>
      </div>

      <div className="hero-anim hero-capsule shrink-0 self-center w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl flex justify-center items-center lg:-translate-x-8 xl:-translate-x-12">
        <Image
          src="/capsule.png"
          alt="Kayro Wellness Capsule"
          width={800}
          height={670}
          priority
          className="w-full h-auto max-h-[500px] sm:max-h-[560px] object-contain drop-shadow-[0_20px_45px_rgba(255,45,171,0.22)] select-none"
        />
      </div>
    </div>
  );
}
