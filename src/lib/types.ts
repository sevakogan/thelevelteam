export interface Company {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image_url: string;
  live_url: string;
  color_primary: string;
  color_secondary: string;
  tech_stack: string[];
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectDetail {
  slug: string;
  headline: string;
  longDescription: string;
  features: ProjectFeature[];
  screenshots: ProjectScreenshot[];
  outcomes: string[];
  usesGHL: boolean;
  ghlDetails?: string;
  clientIndustry: string;
}
