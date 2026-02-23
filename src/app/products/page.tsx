import Link from "next/link";
import Header from "@/components/ui/Header";

export const metadata = {
  title: "Products | TheLevelTeam",
  description: "Explore our products — KashFlow and more coming soon.",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-dark pt-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-3 text-center">
            Our Products
          </h1>
          <p className="text-brand-muted text-center mb-16 max-w-lg mx-auto">
            Tools we&apos;ve built to help businesses grow.
          </p>

          {/* KashFlow Card */}
          <a
            href="https://kashflow.thelevelteam.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-accent-blue/40 hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                <svg
                  className="w-6 h-6 text-accent-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-accent-blue transition-colors">
                  KashFlow
                </h2>
                <p className="text-xs text-brand-muted">
                  kashflow.thelevelteam.com
                </p>
              </div>
              <svg
                className="w-5 h-5 text-brand-muted ml-auto group-hover:text-accent-blue group-hover:translate-x-1 transition-all"
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
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              Financial management platform for businesses. Track revenue, manage expenses, and stay on top of your cash flow.
            </p>
          </a>

          {/* More Coming Soon */}
          <div className="max-w-xl mx-auto mt-8 rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-brand-muted text-sm">
              More products coming soon.
            </p>
          </div>

          {/* Back link */}
          <div className="text-center mt-12">
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
