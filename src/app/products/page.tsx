import Link from "next/link";
import Header from "@/components/ui/Header";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import { getCompanies } from "@/lib/companies";

export const metadata = {
  title: "Projects | TheLevelTeam",
  description:
    "Explore all projects built by TheLevelTeam — web apps, platforms, and marketing sites.",
};

export default async function ProductsPage() {
  const companies = await getCompanies();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-dark pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center">
            Our Projects
          </h1>
          <p className="text-brand-muted text-center mb-16 max-w-lg mx-auto">
            Every project we&apos;ve built — click to explore details or visit
            the live site.
          </p>

          <ProjectsGrid companies={companies} />

          {/* Back link */}
          <div className="text-center mt-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent-blue hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
