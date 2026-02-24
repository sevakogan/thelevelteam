"use client";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-brand-dark" />

      {/* Aurora blob 1 — blue */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          top: "-10%",
          left: "10%",
          animation: "aurora-shift 20s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 2 — purple */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          top: "20%",
          right: "5%",
          animation: "aurora-drift 25s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 3 — cyan */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
          bottom: "10%",
          left: "30%",
          animation: "aurora-shift 30s ease-in-out infinite reverse",
        }}
      />

      {/* Mesh overlay for texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
