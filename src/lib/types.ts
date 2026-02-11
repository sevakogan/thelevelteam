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
