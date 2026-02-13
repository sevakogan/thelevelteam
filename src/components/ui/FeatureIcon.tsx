interface FeatureIconProps {
  icon: string;
  color: string;
  size?: number;
}

export default function FeatureIcon({
  icon,
  color,
  size = 24,
}: FeatureIconProps) {
  const strokeProps = {
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  const icons: Record<string, React.ReactNode> = {
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...strokeProps} />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" {...strokeProps} />
        <polyline points="1 20 1 14 7 14" {...strokeProps} />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...strokeProps} />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" {...strokeProps} />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" {...strokeProps} />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" {...strokeProps} />
        <line x1="21" y1="21" x2="16.65" y2="16.65" {...strokeProps} />
      </>
    ),
    message: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...strokeProps} />
      </>
    ),
    device: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" {...strokeProps} />
        <line x1="12" y1="18" x2="12.01" y2="18" {...strokeProps} />
      </>
    ),
    chart: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" {...strokeProps} />
        <line x1="12" y1="20" x2="12" y2="4" {...strokeProps} />
        <line x1="6" y1="20" x2="6" y2="14" {...strokeProps} />
      </>
    ),
    analytics: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" {...strokeProps} />
        <line x1="12" y1="20" x2="12" y2="4" {...strokeProps} />
        <line x1="6" y1="20" x2="6" y2="14" {...strokeProps} />
        <polyline points="4 14 9 9 13 13 20 6" {...strokeProps} />
      </>
    ),
    trending: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...strokeProps} />
        <polyline points="17 6 23 6 23 12" {...strokeProps} />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" {...strokeProps} />
        <line x1="16" y1="2" x2="16" y2="6" {...strokeProps} />
        <line x1="8" y1="2" x2="8" y2="6" {...strokeProps} />
        <line x1="3" y1="10" x2="21" y2="10" {...strokeProps} />
      </>
    ),
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...strokeProps} />
        <polyline points="14 2 14 8 20 8" {...strokeProps} />
        <line x1="16" y1="13" x2="8" y2="13" {...strokeProps} />
        <line x1="16" y1="17" x2="8" y2="17" {...strokeProps} />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" {...strokeProps} />
        <rect x="14" y="3" width="7" height="7" {...strokeProps} />
        <rect x="14" y="14" width="7" height="7" {...strokeProps} />
        <rect x="3" y="14" width="7" height="7" {...strokeProps} />
      </>
    ),
    dollar: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" {...strokeProps} />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...strokeProps} />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...strokeProps} />
        <circle cx="9" cy="7" r="4" {...strokeProps} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" {...strokeProps} />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" {...strokeProps} />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...strokeProps} />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...strokeProps} />
      </>
    ),
    clipboard: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...strokeProps} />
        <rect x="8" y="2" width="8" height="4" rx="1" {...strokeProps} />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...strokeProps} />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...strokeProps} />
      </>
    ),
    video: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" {...strokeProps} />
        <rect x="1" y="5" width="15" height="14" rx="2" {...strokeProps} />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="10" {...strokeProps} />
        <circle cx="12" cy="12" r="6" {...strokeProps} />
        <circle cx="12" cy="12" r="2" {...strokeProps} />
      </>
    ),
    funnel: (
      <>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" {...strokeProps} />
      </>
    ),
  };

  // Default fallback: circle with plus
  const fallback = (
    <>
      <circle cx="12" cy="12" r="10" {...strokeProps} />
      <line x1="12" y1="8" x2="12" y2="16" {...strokeProps} />
      <line x1="8" y1="12" x2="16" y2="12" {...strokeProps} />
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[icon] || fallback}
    </svg>
  );
}
