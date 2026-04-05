"use client";

interface SkylineSVGProps {
  progress: number;
}

export default function SkylineSVG({ progress }: SkylineSVGProps) {
  // Window glow intensity based on time of day (brighter at night)
  const windowOpacity = progress > 0.3 && progress < 0.8 ? 0.8 : 0.3;

  return (
    <svg
      viewBox="0 0 1200 300"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* Building silhouettes */}
      <g fill="#1a1a2e">
        {/* Far left - short wide */}
        <rect x="20" y="200" width="70" height="100" />
        {/* Tall slim */}
        <rect x="100" y="100" width="45" height="200" />
        {/* Medium */}
        <rect x="155" y="150" width="60" height="150" />
        {/* Tall with antenna */}
        <rect x="230" y="60" width="50" height="240" />
        <rect x="251" y="40" width="8" height="20" />
        {/* Wide office block */}
        <rect x="295" y="130" width="80" height="170" />
        {/* Tallest tower */}
        <rect x="390" y="30" width="55" height="270" />
        <rect x="412" y="10" width="10" height="20" />
        {/* Medium cluster */}
        <rect x="460" y="140" width="50" height="160" />
        <rect x="520" y="110" width="65" height="190" />
        {/* Iconic tower shape */}
        <rect x="600" y="50" width="40" height="250" />
        <polygon points="610,50 620,20 630,50" />
        {/* Right side buildings */}
        <rect x="660" y="160" width="55" height="140" />
        <rect x="730" y="90" width="50" height="210" />
        <rect x="795" y="140" width="70" height="160" />
        {/* Far right */}
        <rect x="880" y="120" width="45" height="180" />
        <rect x="940" y="170" width="60" height="130" />
        <rect x="1015" y="100" width="50" height="200" />
        <rect x="1080" y="160" width="70" height="140" />
      </g>

      {/* Window dots */}
      <g style={{ opacity: windowOpacity, transition: "opacity 1s ease" }}>
        {/* Building at x=100 */}
        <circle cx="115" cy="130" r="1.5" fill="#ff3b7f" />
        <circle cx="130" cy="150" r="1.5" fill="#00d4ff" />
        <circle cx="115" cy="180" r="1.5" fill="#ffcc00" />
        <circle cx="130" cy="200" r="1.5" fill="#ff3b7f" />

        {/* Building at x=230 */}
        <circle cx="245" cy="90" r="1.5" fill="#00d4ff" />
        <circle cx="260" cy="110" r="1.5" fill="#ff3b7f" />
        <circle cx="245" cy="140" r="1.5" fill="#ffcc00" />
        <circle cx="260" cy="170" r="1.5" fill="#00d4ff" />
        <circle cx="245" cy="200" r="1.5" fill="#ff3b7f" />

        {/* Building at x=390 (tallest) */}
        <circle cx="410" cy="60" r="1.5" fill="#ff3b7f" />
        <circle cx="425" cy="80" r="1.5" fill="#00d4ff" />
        <circle cx="410" cy="110" r="1.5" fill="#ffcc00" />
        <circle cx="425" cy="140" r="1.5" fill="#ff3b7f" />
        <circle cx="410" cy="170" r="1.5" fill="#00d4ff" />
        <circle cx="425" cy="200" r="1.5" fill="#ffcc00" />

        {/* Building at x=520 */}
        <circle cx="540" cy="140" r="1.5" fill="#ff3b7f" />
        <circle cx="555" cy="160" r="1.5" fill="#00d4ff" />
        <circle cx="540" cy="190" r="1.5" fill="#ffcc00" />

        {/* Building at x=600 (iconic) */}
        <circle cx="615" cy="80" r="1.5" fill="#00d4ff" />
        <circle cx="625" cy="110" r="1.5" fill="#ff3b7f" />
        <circle cx="615" cy="150" r="1.5" fill="#ffcc00" />
        <circle cx="625" cy="190" r="1.5" fill="#00d4ff" />

        {/* Building at x=730 */}
        <circle cx="745" cy="120" r="1.5" fill="#ff3b7f" />
        <circle cx="760" cy="150" r="1.5" fill="#00d4ff" />
        <circle cx="745" cy="180" r="1.5" fill="#ffcc00" />

        {/* Building at x=1015 */}
        <circle cx="1030" cy="130" r="1.5" fill="#00d4ff" />
        <circle cx="1045" cy="160" r="1.5" fill="#ff3b7f" />
        <circle cx="1030" cy="200" r="1.5" fill="#ffcc00" />
      </g>
    </svg>
  );
}
