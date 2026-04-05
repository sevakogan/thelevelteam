"use client";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-brand-dark" />

      {/* Aurora blob 1 — Miami pink */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-25 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #FF3B6F 0%, transparent 70%)",
          top: "-15%",
          left: "5%",
          animation: "aurora-shift 18s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 2 — purple */}
      <div
        className="absolute w-[550px] h-[550px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #AF52DE 0%, transparent 70%)",
          top: "25%",
          right: "0%",
          animation: "aurora-drift 22s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 3 — baby blue */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #89D4F5 0%, transparent 70%)",
          bottom: "5%",
          left: "25%",
          animation: "aurora-shift 26s ease-in-out infinite reverse",
        }}
      />

      {/* Aurora blob 4 — neon red accent */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #FF2D55 0%, transparent 70%)",
          top: "50%",
          left: "60%",
          animation: "aurora-drift 30s ease-in-out infinite reverse",
        }}
      />

      {/* Mesh overlay for texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(255,59,111,0.08) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(175,82,222,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(137,212,245,0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
