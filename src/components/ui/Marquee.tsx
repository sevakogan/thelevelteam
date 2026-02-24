"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  readonly children: ReactNode;
  readonly speed?: number;
  readonly className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  className = "",
}: MarqueeProps) {
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className="animate-marquee inline-flex w-max items-center gap-8"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {/* Original + duplicate for seamless loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
