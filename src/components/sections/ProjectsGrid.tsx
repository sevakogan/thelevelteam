"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";

type ViewMode = "grid" | "list";

export default function ProjectsGrid({
  companies,
}: {
  readonly companies: readonly Company[];
}) {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <>
      {/* View toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "grid"
                ? "bg-white/10 text-white"
                : "text-brand-muted hover:text-white"
            }`}
            aria-label="Grid view"
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
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "list"
                ? "bg-white/10 text-white"
                : "text-brand-muted hover:text-white"
            }`}
            aria-label="List view"
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
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <GridView companies={companies} />
      ) : (
        <ListView companies={companies} />
      )}
    </>
  );
}

function GridView({
  companies,
}: {
  readonly companies: readonly Company[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <div
          key={company.id}
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col"
        >
          <div
            className="h-1 w-12 rounded-full mb-4"
            style={{
              background: `linear-gradient(to right, ${company.color_primary}, ${company.color_secondary})`,
            }}
          />

          <h2 className="text-lg font-semibold text-white mb-1.5 group-hover:text-accent-blue transition-colors">
            {company.name}
          </h2>

          <p className="text-sm text-brand-muted leading-relaxed mb-4 flex-1">
            {company.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {company.tech_stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-brand-muted"
              >
                {tech}
              </span>
            ))}
            {company.tech_stack.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-brand-muted">
                +{company.tech_stack.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/projects/${company.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:text-white transition-colors"
            >
              View Details
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {company.live_url && (
              <a
                href={company.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-white transition-colors ml-auto"
              >
                Live Site
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({
  companies,
}: {
  readonly companies: readonly Company[];
}) {
  return (
    <div className="space-y-3">
      {companies.map((company) => (
        <div
          key={company.id}
          className="group flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 hover:border-white/20 hover:bg-white/[0.06] transition-all"
        >
          {/* Color dot */}
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: company.color_primary }}
          />

          {/* Name */}
          <h2 className="text-sm font-semibold text-white w-40 shrink-0 group-hover:text-accent-blue transition-colors">
            {company.name}
          </h2>

          {/* Tagline */}
          <p className="text-xs text-brand-muted leading-relaxed flex-1 hidden md:block">
            {company.tagline}
          </p>

          {/* Tech stack */}
          <div className="hidden lg:flex flex-wrap gap-1.5 shrink-0">
            {company.tech_stack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-brand-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            <Link
              href={`/projects/${company.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-white transition-colors"
            >
              Details
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {company.live_url && (
              <a
                href={company.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-white transition-colors"
              >
                Live
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
