// Physics & layout constants
export const GAME = {
  maxBirds: 5,
  birdRadius: 20,
  maxDrag: 140,
  launchPower: 0.28,
  slingshotYRatio: 0.68,
  lettersYRatio: 0.27,
  letterHeight: 140,
  letterGap: 2,
  wordGap: 30,
  fontSize: 160,
  settleSpeed: 0.4,
  settleFrames: 80,
  hitRadius: 90,
} as const;

export const BIRD_STYLES = [
  { fill: "#3B82F6", glow: "rgba(59,130,246,0.6)", emoji: "\u{1F680}" },
  { fill: "#8B5CF6", glow: "rgba(139,92,246,0.6)", emoji: "\u{1F3A8}" },
  { fill: "#06B6D4", glow: "rgba(6,182,212,0.6)", emoji: "\u{1F4C8}" },
  { fill: "#EC4899", glow: "rgba(236,72,153,0.6)", emoji: "\u{1F4E3}" },
  { fill: "#10B981", glow: "rgba(16,185,129,0.6)", emoji: "\u{1F4A1}" },
] as const;

export const COLORS = {
  slingshot: "#4a3220",
  slingshotLight: "#7a5c3a",
  band: "#c9a84c",
  letter: "#ffffff",
  letterGlow: "rgba(139, 92, 246, 0.5)",
  letterActiveGlow: "rgba(239, 68, 68, 0.8)",
  subtitle: "rgba(136, 136, 160, 0.25)",
  trajectory: "rgba(255, 255, 255, 0.1)",
} as const;

// Debris shard colors (glass-like fragments)
export const DEBRIS_COLORS = [
  "rgba(139, 92, 246, 0.9)",  // purple
  "rgba(59, 130, 246, 0.9)",  // blue
  "rgba(255, 255, 255, 0.9)", // white
  "rgba(6, 182, 212, 0.8)",   // cyan
  "rgba(236, 72, 153, 0.8)",  // pink
] as const;

// Spark colors for enhanced particles
export const SPARK_COLORS = [
  "#FDE68A", // warm yellow
  "#FCA5A5", // soft red
  "#C4B5FD", // lavender
  "#67E8F9", // cyan
  "#FFFFFF", // white
] as const;
