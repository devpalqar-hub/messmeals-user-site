import type { ReactNode } from "react";

// Bare layout — no Navbar/Footer/MobileBottomNav.
// Replaces App.tsx's old `fullPagePaths` runtime check for
// /login, /booking/success, /booking/cancel.
export default function FullPageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
