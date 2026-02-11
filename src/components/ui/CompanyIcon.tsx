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

    // RevenuFlow - Chart / analytics icon
    case "revenuflow":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill={`${colorPrimary}15`} />
          <rect x="10" y="22" width="4" height="8" rx="1" fill={colorSecondary} />
          <rect x="16" y="18" width="4" height="12" rx="1" fill={colorPrimary} opacity="0.7" />
          <rect x="22" y="14" width="4" height="16" rx="1" fill={colorPrimary} />
          <rect x="28" y="10" width="4" height="20" rx="1" fill={colorSecondary} />
          <path d="M10 20l6-4 6-2 6-4" stroke={colorPrimary} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
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
