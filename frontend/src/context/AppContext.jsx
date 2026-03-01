/**
 * AppContext.jsx
 * Global state: current user (role, name, email) + dark mode
 * Place this at: src/context/AppContext.jsx
 */

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Dark mode ──
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("pathwayai-dark");
    return stored !== null ? stored === "true" : true; // default dark
  });

  const toggleDark = () => {
    setDark((d) => {
      localStorage.setItem("pathwayai-dark", String(!d));
      return !d;
    });
  };

  // ── User ──
  // Shape: { name, email, role: "student"|"teacher"|"mentor" } | null
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("pathwayai-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const u = { ...userData };
    setUser(u);
    localStorage.setItem("pathwayai-user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pathwayai-user");
  };

  // Sync dark class on <html> for Tailwind dark mode (optional)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppContext.Provider value={{ dark, toggleDark, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook — use this everywhere instead of useState for dark/user
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}