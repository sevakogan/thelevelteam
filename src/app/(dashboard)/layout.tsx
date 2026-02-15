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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </AuthProvider>
  );
}
