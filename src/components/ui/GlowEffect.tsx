"use client";

interface GlowEffectProps {
  color?: string;
  size?: string;
  position?: string;
}

export default function GlowEffect({
  color = "rgba(59, 130, 246, 0.15)",
  size = "600px",
  position = "top-right",
}: GlowEffectProps) {
  const positionClasses: Record<string, string> = {
    "top-right": "-top-[200px] -right-[200px]",
    "top-left": "-top-[200px] -left-[200px]",
    "bottom-right": "-bottom-[200px] -right-[200px]",
    "bottom-left": "-bottom-[200px] -left-[200px]",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`absolute ${positionClasses[position] || positionClasses["top-right"]} rounded-full blur-3xl animate-glow-pulse pointer-events-none`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
    />
  );
}
