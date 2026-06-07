"use client";

import React, { useRef, MouseEvent } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.08)",
  borderColor = "rgba(139, 92, 246, 0.25)",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-xl overflow-hidden glass-card group/spotlight ${className}`}
      {...props}
    >
      {/* Background Spotlight Layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor}, transparent 80%)`,
        }}
      />
      
      {/* Border Spotlight Layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          padding: "1px",
          background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${borderColor}, transparent 80%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card Content wrapper to force stacking on top of spotlight background */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
