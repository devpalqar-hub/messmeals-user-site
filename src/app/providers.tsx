"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

// Client-side provider tree — replaces the BrowserRouter+ToastProvider+AuthProvider
// nesting that used to live in src/main.tsx. Next.js's App Router replaces
// BrowserRouter entirely, so only the two Context providers remain here.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
