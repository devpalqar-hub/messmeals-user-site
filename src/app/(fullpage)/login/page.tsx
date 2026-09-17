import type { Metadata } from "next";
// import { Suspense } from "react";
import { notFound } from "next/navigation";
// import LoginClient from "./LoginClient"; // hidden for now

export const metadata: Metadata = {
  title: "Login | MessMeals",
  robots: { index: false },
};

export default function LoginPage() {
  // LOGIN PAGE TEMPORARILY HIDDEN — remove notFound() to re-enable
  notFound();

  /* ORIGINAL — uncomment when re-enabling login:
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
  */
}
