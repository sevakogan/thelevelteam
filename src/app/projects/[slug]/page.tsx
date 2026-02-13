import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import ProjectHero from "@/components/sections/ProjectHero";
import ProjectScreenshots from "@/components/sections/ProjectScreenshots";
import ProjectFeatures from "@/components/sections/ProjectFeatures";
import ProjectOutcomes from "@/components/sections/ProjectOutcomes";
import ProjectCTA from "@/components/sections/ProjectCTA";
import GHLBadge from "@/components/ui/GHLBadge";
import { getCompanyBySlug } from "@/lib/companies";
import { projectContent } from "@/lib/projectContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(projectContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = projectContent[slug];
  if (!detail) return {};

  const company = await getCompanyBySlug(slug);
  const name = company?.name || detail.slug;

  return {
    title: `${name} | TheLevelTeam`,
    description: company?.tagline || detail.headline,
    openGraph: {
      title: `${name} — ${detail.headline}`,
      description: company?.tagline || detail.longDescription.slice(0, 160),
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = projectContent[slug];
  if (!detail) notFound();

  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />
      <ProjectHero company={company} detail={detail} />

      {detail.usesGHL && detail.ghlDetails && (
        <GHLBadge
          details={detail.ghlDetails}
          colorPrimary={company.color_primary}
          colorSecondary={company.color_secondary}
        />
      )}

      <ProjectScreenshots
        screenshots={detail.screenshots}
        colorPrimary={company.color_primary}
        colorSecondary={company.color_secondary}
      />

      <ProjectFeatures
        features={detail.features}
        colorPrimary={company.color_primary}
        colorSecondary={company.color_secondary}
      />

      <ProjectOutcomes
        outcomes={detail.outcomes}
        colorPrimary={company.color_primary}
      />

      <ProjectCTA company={company} />
    </main>
  );
}
