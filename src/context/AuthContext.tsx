"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";


const STORAGE_KEY = "mm_auth_user";

export type AuthUser = {
  token: string;
  role: string;
  name: string;
  phone: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  // True once the localStorage-backed auth state has been read on the client.
  // Next.js pre-renders this provider on the server (where localStorage does
  // not exist), so `user` starts out `null` there; guard any auth-gated
  // redirect/UI decision with `isHydrated` first to avoid a false
  // "not logged in" flash for already-authenticated users.
  isHydrated: boolean;
  login: (user: AuthUser) => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // One-time synchronous read of localStorage to hydrate auth state on the
    // client (see the `isHydrated` doc comment above for why this can't run
    // during render). This is a deliberate one-shot hydration read, not an
    // external-store subscription, so the "set state in effect" concern the
    // lint rule targets does not apply here.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(raw ? (JSON.parse(raw) as AuthUser) : null);
    } catch {
      setUser(null);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user, isHydrated]);

  const login = (u: AuthUser) => setUser(u);
  const updateProfile = (patch: Partial<AuthUser>) =>
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isHydrated, login, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
