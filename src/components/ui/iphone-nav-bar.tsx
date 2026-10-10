"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Home, PlaySquare, Send, Search } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
  hasBadge?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "hero",
    label: "Home",
    href: "#hero",
    icon: (active) => (
      <Home
        size={21}
        className={active ? "text-white" : "text-white/45"}
        strokeWidth={active ? 2.5 : 1.8}
      />
    ),
  },
  {
    id: "gallery",
    label: "Works",
    href: "#gallery",
    icon: (active) => (
      <PlaySquare
        size={21}
        className={active ? "text-white fill-white/10" : "text-white/45"}
        strokeWidth={active ? 2.4 : 1.8}
      />
    ),
  },
  {
    id: "experience",
    label: "Story",
    href: "#experience",
    icon: (active) => (
      <Send
        size={20}
        className={`-rotate-12 ${active ? "text-white fill-white/15" : "text-white/45"}`}
        strokeWidth={active ? 2.4 : 1.8}
      />
    ),
  },
  {
    id: "tools",
    label: "Tools",
    href: "#tools",
    icon: (active) => (
      <Search
        size={21}
        className={active ? "text-white" : "text-white/45"}
        strokeWidth={active ? 2.5 : 1.8}
      />
    ),
  },
  {
    id: "portfolio",
    label: "Profile",
    href: "#portfolio",
    icon: (active) => (
      <div className="relative flex items-center justify-center">
        <div
          className={`w-[24px] h-[24px] rounded-full overflow-hidden transition-all duration-300 ${
            active
              ? "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
              : "ring-1 ring-white/25 opacity-60"
          }`}
        >
          <img
            src="/Zae.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    ),
  },
];

export interface IPhoneNavBarProps {
  items?: NavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function IPhoneNavBar({
  items = DEFAULT_NAV_ITEMS,
  activeId: controlledActiveId,
  onSelect,
  className = "",
}: IPhoneNavBarProps) {
  const [internalActive, setInternalActive] = useState("hero");
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActive;

  const [isDragging, setIsDragging] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  // ── Continuous Molten Liquid Physics Engine ──
  const activeIndex = Math.max(
    0,
    items.findIndex((it) => it.id === activeId)
  );

  const targetPos = useMotionValue(activeIndex);
  // Viscous fluid spring for melted liquid feel
  const springPos = useSpring(targetPos, {
    stiffness: 260,
    damping: 20,
    mass: 0.72,
  });

  // Velocity-driven fluid stretch & squash (Mercury droplet physics)
  const velocity = useVelocity(springPos);
  const scaleX = useTransform(velocity, [-25, 0, 25], [1.32, 1, 1.32]);
  const scaleY = useTransform(velocity, [-25, 0, 25], [0.82, 1, 0.82]);
  const skewX = useTransform(velocity, [-25, 0, 25], [-10, 0, 10]);

  // Direct GPU translation: translates by exactly (slotIndex * 100%)
  const bubbleTranslateX = useTransform(springPos, (val) => `${val * 100}%`);

  // Sync targetPos when activeId changes externally (scroll/mount)
  useEffect(() => {
    if (!isDragging && activeIndex >= 0) {
      targetPos.set(activeIndex);
    }
  }, [activeIndex, isDragging, targetPos]);

  // Auto-track current section based on window scroll position (when idle)
  useEffect(() => {
    if (controlledActiveId !== undefined) return;

    const handleScroll = () => {
      if (isClickingRef.current || isDragging) return;

      const scrollPos = window.scrollY + window.innerHeight * 0.38;

      if (window.scrollY < 120) {
        setInternalActive(items[0].id);
        return;
      }

      const sectionEntries = items
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          const target = el.parentElement?.classList?.contains("pin-spacer")
            ? el.parentElement
            : el;
          const rect = target.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return { id: item.id, top };
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null)
        .sort((a, b) => a.top - b.top);

      if (sectionEntries.length === 0) return;

      let currentActiveId = sectionEntries[0].id;
      for (const entry of sectionEntries) {
        if (scrollPos >= entry.top) {
          currentActiveId = entry.id;
        }
      }

      setInternalActive(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controlledActiveId, isDragging, items]);

  const scrollToSection = (id: string) => {
    isClickingRef.current = true;
    if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickingRef.current = false;
    }, 1100);

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const scrollTarget = targetEl.parentElement?.classList?.contains("pin-spacer")
        ? targetEl.parentElement
        : targetEl;
      const rect = scrollTarget.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY;
      window.scrollTo({ top: Math.max(0, targetTop - 20), behavior: "smooth" });
    }
  };

  // Convert pointer clientX directly to continuous floating position
  const getFloatPosFromClientX = (clientX: number): number => {
    if (!dockRef.current) return 0;
    const rect = dockRef.current.getBoundingClientRect();
    const pad = 5;
    const innerWidth = rect.width - pad * 2;
    if (innerWidth <= 0) return 0;
    const innerX = clientX - rect.left - pad;
    const relX = Math.max(0, Math.min(1, innerX / innerWidth));
    return Math.max(0, Math.min(items.length - 1, relX * items.length - 0.5));
  };

  // ── Drag / Swipe Handlers (Seamless Molten Liquid Flow) ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    isClickingRef.current = true;

    const floatPos = getFloatPosFromClientX(e.clientX);
    targetPos.set(floatPos);

    const nearestIndex = Math.min(items.length - 1, Math.max(0, Math.round(floatPos)));
    const targetItem = items[nearestIndex];
    if (targetItem) {
      setInternalActive(targetItem.id);
      onSelect?.(targetItem.id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const floatPos = getFloatPosFromClientX(e.clientX);
    targetPos.set(floatPos);

    const nearestIndex = Math.min(items.length - 1, Math.max(0, Math.round(floatPos)));
    const targetItem = items[nearestIndex];
    if (targetItem && targetItem.id !== activeId) {
      setInternalActive(targetItem.id);
      onSelect?.(targetItem.id);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    setIsDragging(false);

    // Snap fluidly onto the nearest discrete icon center
    const floatPos = getFloatPosFromClientX(e.clientX);
    const finalIndex = Math.min(items.length - 1, Math.max(0, Math.round(floatPos)));
    targetPos.set(finalIndex);

    const finalItem = items[finalIndex];
    if (finalItem) {
      setInternalActive(finalItem.id);
      onSelect?.(finalItem.id);
      scrollToSection(finalItem.id);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    setIsDragging(false);

    const currentFloat = targetPos.get();
    const finalIndex = Math.min(items.length - 1, Math.max(0, Math.round(currentFloat)));
    targetPos.set(finalIndex);
  };

  const handleClickItem = (index: number, item: NavItem) => {
    targetPos.set(index);
    setInternalActive(item.id);
    onSelect?.(item.id);
    scrollToSection(item.id);
  };

  const slotPercent = 100 / items.length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`block md:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto ${className}`}
      style={{
        width: "min(90vw, 340px)",
        willChange: "transform",
      }}
    >
      {/* ── Outer iPhone Liquid Glass Oval Dock ── */}
      <div
        ref={dockRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative flex items-center w-full h-[56px] p-[5px] rounded-full cursor-pointer select-none overflow-hidden"
        style={{
          touchAction: "none",
          backgroundColor: "rgba(22, 22, 28, 0.55)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: [
            "inset 0 1px 1px rgba(255, 255, 255, 0.22)",
            "inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
            "0 18px 40px rgba(0, 0, 0, 0.55)",
            "0 2px 8px rgba(0, 0, 0, 0.3)",
          ].join(", "),
        }}
      >
        {/* Specular fluid light sheen (curved gloss rim) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.1) 100%)",
          }}
        />

        {/* ── INNER TRACK: Concentric & unified coordinate system for droplet and icons ── */}
        <div className="relative flex items-center w-full h-full">
          {/* ── SINGLE CONTINUOUS MOLTEN LIQUID DROPLET (Zero step jumping, concentric full capsule) ── */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 z-0 pointer-events-none flex items-center justify-center"
            style={{
              width: `${slotPercent}%`,
              x: bubbleTranslateX,
              scaleX,
              scaleY,
              skewX,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {/* Liquid Droplet Body with Luminous Optical Transparency */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.16) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.40)",
                boxShadow: [
                  "inset 0 1.5px 2px rgba(255, 255, 255, 0.70)",
                  "inset 0 -1px 1.5px rgba(255, 255, 255, 0.20)",
                  "0 4px 16px rgba(0, 0, 0, 0.22)",
                  "0 0 16px rgba(255, 255, 255, 0.12)",
                ].join(", "),
                backdropFilter: "blur(16px) saturate(170%)",
                WebkitBackdropFilter: "blur(16px) saturate(170%)",
              }}
            >
              {/* Top liquid surface tension meniscus reflection */}
              <div
                className="absolute top-0 left-[15%] right-[15%] h-[1.5px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95) 50%, transparent)",
                }}
              />

              {/* Internal caustic core glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 50% at 50% 25%, rgba(255, 255, 255, 0.26) 0%, transparent 75%)",
                }}
              />

              {/* Bottom liquid meniscus rim */}
              <div
                className="absolute bottom-0 left-[22%] right-[22%] h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.38) 50%, transparent)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Nav Items on Top of the Liquid Stream ── */}
          {items.map((item, index) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(index, item)}
                className="relative flex items-center justify-center flex-1 h-full select-none cursor-pointer z-10"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Icon Container with Fluid Buoyancy Float */}
                <motion.div
                  className="relative flex items-center justify-center pointer-events-none"
                  animate={{
                    scale: isActive ? (isDragging ? 1.14 : 1.06) : 1,
                    y: 0,
                    opacity: isActive ? 1 : 0.62,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    mass: 0.6,
                  }}
                >
                  {item.icon(isActive)}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default IPhoneNavBar;
