"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/auth/types";
import { isAdminRole } from "@/lib/auth/types";

interface AuthContextType {
  readonly user: User | null;
  readonly profile: Profile | null;
  readonly session: Session | null;
  readonly isLoading: boolean;
  readonly isAdmin: boolean;
  readonly signOut: () => Promise<void>;
  readonly refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
  readonly serverProfile?: Profile | null;
}

export function AuthProvider({ children, serverProfile }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(serverProfile ?? null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[AuthProvider] fetchProfile error:", error.message);
    }
    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Sign out from Supabase failed — redirect to login anyway
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    window.location.href = "/login";
  }

  const isAdmin = profile ? isAdminRole(profile.role) : false;

  const value = useMemo(
    () => ({ user, profile, session, isLoading, isAdmin, signOut, refreshProfile }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profile, session, isLoading, isAdmin, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
