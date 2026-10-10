"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

const WORKS: WorksWheelItem[] = [
  {
    title: "Prismatic Rift",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    href: "#prismatic-rift",
  },
  {
    title: "Ember Clouds",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80",
    href: "#ember-clouds",
  },
  {
    title: "Neon Portal",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    href: "#neon-portal",
  },
  {
    title: "Red Ribbon",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    href: "#red-ribbon",
  },
  {
    title: "Celestial",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    href: "#celestial",
  },
  {
    title: "Uplight",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    href: "#uplight",
  },
  {
    title: "Indigo Marble",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    href: "#indigo-marble",
  },
  {
    title: "Launch Window",
    image: "https://images.unsplash.com/photo-1517976487507-5b3b4b445f1b?auto=format&fit=crop&w=800&q=80",
    href: "#launch-window",
  },
  {
    title: "Cosmic Wave",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    href: "#cosmic-wave",
  },
];

export default function WorksWheelDemo() {
  return (
    <div className="bg-background text-foreground w-full h-screen">
      <WorksWheel items={WORKS} label="Works '26" action="View" />
    </div>
  );
}
