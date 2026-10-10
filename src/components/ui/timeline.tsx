// Built using Hyperiux Vault & Adapted for Zae Labs
"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export type JourneyItem = {
  id: string;
  year: string;
  month: string;
  content: string;
};

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  topItems?: JourneyItem[];
  bottomItems?: JourneyItem[];
  duration?: number;
  scrollDuration?: number;
};

const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "2023-june",
    year: "2023",
    month: "June",
    content: "Robotics D'Astha (SMAN 28): Led robotics club & engineered Line Follower Robot",
  },
  {
    id: "2023-october",
    year: "2023",
    month: "October",
    content: "D'Astha Research Team (SMAN 28): Applied analytics & scientific research",
  },
  {
    id: "2024-august",
    year: "2024",
    month: "August",
    content: "IPB University: Entered Computer Science, AI Systems & Engineering",
  },
  {
    id: "2026-march",
    year: "2026",
    month: "March",
    content: "Zae Labs: Engineering practical AI workflows, prompt systems & web builds",
  },
];

const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "2023-may",
    year: "2023",
    month: "May",
    content: "Student Integrity Movement: School campaigns and transparent governance",
  },
  {
    id: "2024-september",
    year: "2024",
    month: "September",
    content: "IT TODAY (IPB University): Staging and division coordination for national tech contest",
  },
  {
    id: "2025-november",
    year: "2025",
    month: "November",
    content: "LPK Tepi Sawah (IPB CS Volunteer): Teaching computing foundations to community youth",
  },
];

export default function Timeline({
  title = "Growth Storyline",
  periodLabel = "2023 — 2026",
  textColor = "#ffffff",
  mutedTextColor = "rgba(255, 255, 255, 0.65)",
  activeColor = "#e8702a",
  backgroundColor = "#000000",
  imageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Modern technology and engineering workspace",
  topItems = defaultTopJourneyData,
  bottomItems = defaultBottomJourneyData,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);

  // Memoize sorted chronological items so reference doesn't change on re-render
  const chronologicalItems = useMemo(() => {
    return [...topItems, ...bottomItems].sort((a, b) => {
      const yearDiff = Number(a.year) - Number(b.year);
      if (yearDiff !== 0) return yearDiff;
      const aM = monthOrder[a.month] || 0;
      const bM = monthOrder[b.month] || 0;
      return aM - bM;
    });
  }, [topItems, bottomItems]);

  useGSAP(() => {
    const section = sectionRef.current;
    const slider = wholeSliderRef.current;
    if (!section || !slider) return;

    const getScrollDistance = () => {
      const extraPad = window.innerWidth < 600 ? 60 : 140;
      return Math.max(slider.scrollWidth - window.innerWidth + extraPad, 800);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Geser ke samping secara horizontal saat di-scroll
    tl.to(
      slider,
      {
        x: () => -getScrollDistance(),
        ease: "none",
      },
      0
    );

    // 2. Animate central progress line
    tl.fromTo(
      ".timeline-progress-line",
      { width: "0%" },
      {
        width: "100%",
        ease: "none",
      },
      0
    );

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 800);

    // Touch swipe support on mobile: swiping left/right directly advances/rewinds the timeline
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalSwipe = false;

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalSwipe = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const dx = touchStartX - e.touches[0].clientX;
      const dy = touchStartY - e.touches[0].clientY;

      if (!isHorizontalSwipe && Math.abs(dx) > Math.abs(dy) + 6 && Math.abs(dx) > 10) {
        isHorizontalSwipe = true;
      }

      if (isHorizontalSwipe) {
        window.scrollBy(0, dx * 0.9);
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        if (e.cancelable) e.preventDefault();
      }
    };

    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
    };
  }, { dependencies: [], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full h-screen relative z-20 overflow-hidden flex flex-col justify-center"
      style={{ backgroundColor: backgroundColor || "#000000", color: textColor }}
    >
      {/* Horizontal Slider Track */}
      <div
        ref={wholeSliderRef}
        className="flex items-center h-[500px] max-[600px]:h-[430px] pl-[5vw] pr-[15vw] w-max shrink-0"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      >
          {/* ── Anchor Hero Card ── */}
          <div className="w-[280px] max-[600px]:w-[220px] h-[360px] max-[600px]:h-[300px] shrink-0 rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl mr-[4vw] bg-zinc-950">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 max-[600px]:bottom-3.5 max-[600px]:left-3.5 max-[600px]:right-3.5">
              <span
                className="text-[11px] max-[600px]:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(232, 112, 42, 0.2)", color: activeColor }}
              >
                Experience Storyline
              </span>
              <h3 className="text-xl max-[600px]:text-base font-bold text-white mt-2 leading-tight">
                {title}
              </h3>
              <p className="text-xs max-[600px]:text-[11px] text-zinc-400 mt-1">
                {periodLabel} • Scroll down to follow
              </p>
            </div>
          </div>

          {/* ── Timeline Track with Central Orange Line ── */}
          <div className="relative h-[460px] max-[600px]:h-[400px] flex items-center shrink-0">
            {/* The Central Line that runs through exact 50% vertical center */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-800/80 pointer-events-none z-0">
              {/* Glowing active line that fills on scroll */}
              <div
                className="timeline-progress-line h-full rounded-full"
                style={{
                  backgroundColor: activeColor,
                  boxShadow: "0 0 10px #e8702a, 0 0 4px #e8702a",
                  width: "0%",
                  willChange: "width",
                }}
              />
            </div>

            {/* Sequence of alternating milestones */}
            <div className="flex items-center gap-[4vw] max-[600px]:gap-[5vw] relative z-10">
              {chronologicalItems.map((item, index) => {
                // Alternating layout: index 0 (May) = bottom, index 1 (June) = top, index 2 (Oct) = bottom, index 3 (Aug) = top...
                const isTop = index % 2 === 1;
                const [itemTitle, itemDesc] = item.content.includes(":")
                  ? item.content.split(":", 2)
                  : [item.content, ""];

                return (
                  <div
                    key={item.id}
                    className="relative w-[270px] max-[600px]:w-[220px] h-[420px] max-[600px]:h-[360px] shrink-0 flex items-center justify-center"
                  >
                    {/* Node Dot: Centered directly on top of the central orange line */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 max-[600px]:w-3 max-[600px]:h-3 rounded-full z-20 ring-4 ring-black"
                      style={{
                        backgroundColor: activeColor,
                        boxShadow: "0 0 10px #e8702a",
                      }}
                    />

                    {/* Connecting Stem: Exactly links the central dot to the card with ZERO gap */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-[1.5px] z-10"
                      style={{
                        backgroundColor: activeColor,
                        boxShadow: "0 0 6px rgba(232, 112, 42, 0.7)",
                        height: "40px",
                        ...(isTop ? { bottom: "50%" } : { top: "50%" }),
                      }}
                    />

                    {/* Milestone Card (Always visible, clean and high-contrast) */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-full z-15"
                      style={{
                        ...(isTop
                          ? { bottom: "calc(50% + 40px)" }
                          : { top: "calc(50% + 40px)" }),
                      }}
                    >
                      <div className="p-4 max-[600px]:p-3 rounded-2xl bg-zinc-950/95 border border-white/12 shadow-xl backdrop-blur-md hover:border-orange-500/40 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-[11px] max-[600px]:text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "rgba(232, 112, 42, 0.16)",
                              color: activeColor,
                            }}
                          >
                            {item.year} {item.month}
                          </span>
                        </div>
                        <h4 className="text-[13px] max-[600px]:text-[12px] font-bold leading-snug text-white">
                          {itemTitle}
                        </h4>
                        {itemDesc && (
                          <p
                            className="text-[11.5px] max-[600px]:text-[10.5px] leading-relaxed mt-1"
                            style={{ color: mutedTextColor }}
                          >
                            {itemDesc.trim()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Final Destination: Next Chapter Card ── */}
              <div className="relative w-[270px] max-[600px]:w-[220px] shrink-0 ml-[2vw] flex items-center justify-center">
                <div className="p-5 max-[600px]:p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 via-zinc-900 to-black border border-orange-500/40 shadow-2xl text-center w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Next Chapter
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Active & Expanding
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    Scaling practical AI workflows, prompt systems & full-stack web builds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
