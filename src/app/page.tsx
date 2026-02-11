import Header from "@/components/ui/Header";
import HeroSection from "@/components/sections/HeroSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import { createClient } from "@supabase/supabase-js";
import type { Company } from "@/lib/types";

const FALLBACK_COMPANIES: Company[] = [
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
      "Medical supply driver logistics platform. Calendar-based delivery tracking, expense management, and reporting.",
    description: "",
    image_url: "",
    live_url: "https://wecare-drive.vercel.app",
    color_primary: "#1E40AF",
    color_secondary: "#3B82F6",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "NextAuth", "Google APIs"],
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
];

async function getCompanies(): Promise<Company[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return FALLBACK_COMPANIES;

    const supabase = createClient(url, key);
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

export default async function Home() {
  const companies = await getCompanies();

  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />
      <HeroSection />
      <PortfolioSection companies={companies} />
      <AboutSection />
      <CTASection />
    </main>
  );
}
