import type { Metadata } from "next";
// import { Suspense } from "react";
import { notFound } from "next/navigation";
// import BookPlanClient from "./BookPlanClient"; // hidden for now

// The original BookPlan page always used this exact static title/noindex
// regardless of the plan/mess being booked (never dynamic) — and this route
// is disallowed in robots.txt, so no server-side metadata fetch is added
// here (unlike /mess/[slug], which does have a genuinely per-mess title).
export const metadata: Metadata = {
  title: "Book a Meal Plan | MessMeals",
  robots: { index: false },
};

export default function BookPlanPage() {
  // BOOK PAGE TEMPORARILY HIDDEN — remove notFound() to re-enable
  notFound();

  /* ORIGINAL — uncomment when re-enabling booking:
  return (
    <Suspense fallback={null}>
      <BookPlanClient />
    </Suspense>
  );
  */
}
