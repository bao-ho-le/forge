import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { mapAuthError } from "../lib/authErrors";

type AuthResult = { error: string | null };

type Profile = {
  full_name: string | null;
};

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: (idToken: string, nonce?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateFullName: (fullName: string) => Promise<AuthResult>;
  updateEmail: (newEmail: string) => Promise<AuthResult>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  updateFullName: async () => ({ error: null }),
  updateEmail: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    if (!error) setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
    } else {
      setProfile(null);
    }
  }, [session?.user?.id, fetchProfile]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return { error: error ? mapAuthError(error) : null };
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? mapAuthError(error) : null };
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string, nonce?: string) => {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
      nonce,
    });
    return { error: error ? mapAuthError(error) : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateFullName = useCallback(
    async (fullName: string) => {
      if (!session?.user?.id) {
        return { error: mapAuthError({ message: "not authenticated" }) };
      }
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", session.user.id);
      if (error) return { error: mapAuthError(error) };
      setProfile((prev) => ({ ...prev, full_name: fullName }));
      return { error: null };
    },
    [session?.user?.id],
  );

  const updateEmail = useCallback(async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    return { error: error ? mapAuthError(error) : null };
  }, []);

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const email = session?.user?.email;
      if (!email) {
        return { error: mapAuthError({ message: "not authenticated" }) };
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) return { error: mapAuthError(signInError) };

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error: error ? mapAuthError(error) : null };
    },
    [session?.user?.email],
  );

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) await fetchProfile(session.user.id);
  }, [session?.user?.id, fetchProfile]);

  const value = useMemo(
    () => ({
      session,
      profile,
      isLoading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateFullName,
      updateEmail,
      updatePassword,
      refreshProfile,
    }),
    [
      session,
      profile,
      isLoading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateFullName,
      updateEmail,
      updatePassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
