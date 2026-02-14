import { createClient } from "@supabase/supabase-js";
import type { Company } from "@/lib/types";

export const FALLBACK_COMPANIES: Company[] = [
  {
    id: "1",
    name: "CrownVault",
    slug: "crownvault",
    tagline:
      "Exclusive, invite-only marketplace for premium watch dealers. Verified dealers trading authenticated luxury timepieces.",
    description: "",
    image_url: "",
    live_url: "https://crownvault.vercel.app",
    color_primary: "#3B82F6",
    color_secondary: "#EC4899",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
    display_order: 1,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "RevenuFlow",
    slug: "revenuflow",
    tagline:
      "AI-powered revenue management for short-term rentals. Dynamic pricing, market analytics, and demand forecasting.",
    description: "",
    image_url: "",
    live_url: "https://revenuflow.vercel.app",
    color_primary: "#8B5CF6",
    color_secondary: "#06B6D4",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "AI/ML"],
    display_order: 2,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "WeCare Drive",
    slug: "wecare-drive",
    tagline:
      "HIPAA-compliant medical supply delivery platform. Encrypted data, audit logging, role-based access, and AI-powered operations.",
    description: "",
    image_url: "",
    live_url: "https://wecare-drive.vercel.app",
    color_primary: "#1E40AF",
    color_secondary: "#3B82F6",
    tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "NextAuth", "AWS S3", "OpenAI"],
    display_order: 3,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    name: "GeniusTestBoost",
    slug: "geniustestboost",
    tagline:
      "1-on-1 expert tutoring for SAT, ACT, and GRE standardized tests. Diagnostic testing, custom study plans, and live sessions.",
    description: "",
    image_url: "",
    live_url: "https://geniustestboost.vercel.app",
    color_primary: "#C9A84C",
    color_secondary: "#7C6CF0",
    tech_stack: ["Express.js", "Supabase", "Vanilla JS", "HTML/CSS"],
    display_order: 4,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    name: "Karbon Agency",
    slug: "karbonagency",
    tagline:
      "Meta & Instagram advertising built exclusively for sim racing businesses. Hyper-targeted campaigns that fill seats.",
    description: "",
    image_url: "",
    live_url: "https://karbonagency.com",
    color_primary: "#ef4444",
    color_secondary: "#f97316",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    display_order: 5,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getCompanies(): Promise<Company[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return FALLBACK_COMPANIES;

    const supabase = createClient(url, key, {
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("is_featured", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_COMPANIES;
    return data as Company[];
  } catch {
    return FALLBACK_COMPANIES;
  }
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const companies = await getCompanies();
  return companies.find((c) => c.slug === slug) || null;
}
