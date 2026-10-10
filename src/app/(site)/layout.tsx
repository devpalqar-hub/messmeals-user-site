import { Suspense } from "react";
import type { ReactNode } from "react";
import Navbar from "../../components/shared/Navbar/Navbar";
import Footer from "../../components/shared/Footer/Footer";
import MobileBottomNav from "../../components/shared/Navbar/MobileBottomNav";

// Navbar + Footer + MobileBottomNav chrome — replaces App.tsx's default
// (non-full-page, non-no-footer) branch.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* MobileBottomNav reads useSearchParams(); Suspense is required so the
          static pages in this group (privacy/terms/about/partner) can still
          prerender. */}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
