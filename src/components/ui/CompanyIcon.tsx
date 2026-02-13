interface CompanyIconProps {
  slug: string;
  colorPrimary: string;
  colorSecondary: string;
  size?: number;
}

export default function CompanyIcon({ slug, colorPrimary, colorSecondary, size = 40 }: CompanyIconProps) {
  switch (slug) {
    // CrownVault - Crown / watch icon
    case "crownvault":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill={`${colorPrimary}15`} />
          <path d="M12 26h16l2-10-4.5 4-5.5-7-5.5 7L10 16l2 10z" fill={colorPrimary} />
          <path d="M12 27h16v2a1 1 0 01-1 1H13a1 1 0 01-1-1v-2z" fill={colorSecondary} />
          <circle cx="20" cy="13" r="1.5" fill={colorSecondary} />
          <circle cx="10" cy="16" r="1.5" fill={colorPrimary} opacity="0.7" />
          <circle cx="30" cy="16" r="1.5" fill={colorPrimary} opacity="0.7" />
        </svg>
      );

    // RevenuFlow - Line chart with arrow (matches actual site logo)
    case "revenuflow":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rf-gradient" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#rf-gradient)" />
          <path d="M10 27.5L16.25 17.5L21.25 22.5L30 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 12.5H30V17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // WeCare Drive - Medical cross / vehicle icon
    case "wecare-drive":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill={`${colorPrimary}15`} />
          <rect x="17" y="10" width="6" height="16" rx="1" fill={colorPrimary} />
          <rect x="12" y="15" width="16" height="6" rx="1" fill={colorPrimary} />
          <path d="M11 30h18" stroke={colorSecondary} strokeWidth="2" strokeLinecap="round" />
          <circle cx="15" cy="30" r="2" fill={colorSecondary} />
          <circle cx="25" cy="30" r="2" fill={colorSecondary} />
        </svg>
      );

    // GeniusTestBoost - Graduation cap / brain icon
    case "geniustestboost":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill={`${colorPrimary}15`} />
          <path d="M20 12l-10 5 10 5 10-5-10-5z" fill={colorPrimary} />
          <path d="M13 19v6c0 0 3 4 7 4s7-4 7-4v-6" stroke={colorSecondary} strokeWidth="1.5" fill="none" />
          <path d="M30 17v8" stroke={colorPrimary} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="30" cy="26" r="1.5" fill={colorSecondary} />
        </svg>
      );

    // KarbonAgency - Hexagonal K icon
    case "karbonagency":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ka-gradient" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor={colorPrimary} />
              <stop offset="1" stopColor={colorSecondary} />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#ka-gradient)" />
          <path d="M15 12v16M15 20l8-8M15 20l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // Default - generic icon
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill={`${colorPrimary}15`} />
          <rect x="12" y="12" width="16" height="16" rx="3" stroke={colorPrimary} strokeWidth="2" />
          <path d="M17 20h6M20 17v6" stroke={colorSecondary} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
