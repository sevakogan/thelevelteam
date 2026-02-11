"use client";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bottom step */}
      <rect x="4" y="44" width="20" height="16" rx="2" fill="#2196F3" />
      {/* Middle step */}
      <rect x="20" y="28" width="20" height="16" rx="2" fill="#2196F3" />
      {/* Top step / arrow base */}
      <rect x="36" y="12" width="12" height="16" rx="2" fill="#2196F3" />
      {/* Arrow head */}
      <path
        d="M44 8L58 8L58 22"
        stroke="#2196F3"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 8L44 22"
        stroke="#2196F3"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
