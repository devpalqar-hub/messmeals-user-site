import { Suspense } from "react";
import type { ReactNode } from "react";
import Navbar from "../../components/shared/Navbar/Navbar";
import MobileBottomNav from "../../components/shared/Navbar/MobileBottomNav";

// Navbar + MobileBottomNav, no Footer — replaces App.tsx's old
// `noFooterPaths = ["/profile"]` branch.
export default function SiteNoFooterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
