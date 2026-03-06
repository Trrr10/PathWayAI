/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark,    setDark]    = useState(() => localStorage.getItem("pathwayai-dark") === "true");

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("[AppContext] getSession →", session?.user?.email ?? "no session", error ?? "");
      if (session?.user) loadProfile(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AppContext] onAuthStateChange →", event, session?.user?.email ?? "no user");
      if (session?.user) loadProfile(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (authUser) => {
    console.log("[AppContext] loadProfile → fetching for", authUser.id);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      console.log("[AppContext] loadProfile result →", data, error);

      if (data && !error) {
        setUser(data);
      } else {
        // Fallback to auth metadata (handles RLS block or missing profile row)
        const fallback = {
          id:       authUser.id,
          email:    authUser.email,
          name:     authUser.user_metadata?.name     || authUser.email?.split("@")[0],
          role:     authUser.user_metadata?.role     || "student",
          language: authUser.user_metadata?.language || null,
          school:   authUser.user_metadata?.school   || null,
          subject:  authUser.user_metadata?.subject  || null,
          upi:      authUser.user_metadata?.upi      || null,
        };
        console.log("[AppContext] loadProfile fallback →", fallback);
        setUser(fallback);
      }
    } catch (err) {
      console.error("[AppContext] loadProfile threw →", err);
      setUser({
        id:    authUser.id,
        email: authUser.email,
        role:  authUser.user_metadata?.role || "student",
      });
    }
  };

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem("pathwayai-dark", String(!d));
      return !d;
    });
  };

  const signup = async (email, password, userData) => {
    console.log("[AppContext] signup →", email, userData.role);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name:     userData.name,
          role:     userData.role,
          language: userData.language || null,
          school:   userData.school   || null,
          subject:  userData.subject  || null,
          upi:      userData.upi      || null,
        },
      },
    });
    console.log("[AppContext] signUp result →", data, error);
    if (error) throw error;
    return data;
  };

  const login = async (email, password) => {
    console.log("[AppContext] login →", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("[AppContext] login result →", data, error);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, loading, dark, toggleDark, login, logout, signup }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}