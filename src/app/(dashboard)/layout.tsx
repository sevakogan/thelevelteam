import { AuthProvider } from "@/components/auth/AuthProvider";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { createSupabaseServer } from "@/lib/supabase-auth-server";
import type { Profile } from "@/lib/auth/types";

async function getServerProfile(): Promise<Profile | null> {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return (data as Profile) ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const serverProfile = await getServerProfile();

  return (
    <AuthProvider serverProfile={serverProfile}>
      <DashboardNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-5 mt-4 border-t border-separator">
        <p className="text-xs text-brand-muted text-center">
          Designed and implemented by{" "}
          <a
            href="https://thelevelteam.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            TheLevelTeam
          </a>
          {" "}·{" "}v1.0.0{" "}·{" "}Last updated March 8, 2026
        </p>
      </footer>
    </AuthProvider>
  );
}
