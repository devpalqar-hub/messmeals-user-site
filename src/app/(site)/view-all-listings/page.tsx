import type { Metadata } from "next";
import { Suspense } from "react";
import ViewAllListingsClient from "./ViewAllListingsClient";

export const metadata: Metadata = {
  title: "Top Messes & Meal Plans | MessMeals",
  description:
    "Browse top-rated messes and homely food providers. Compare meal plans, menus, and prices to find the right meals on MessMeals.",
  alternates: { canonical: "/view-all-listings" },
  openGraph: {
    title: "Top Messes & Meal Plans | MessMeals",
    description:
      "Browse top-rated messes and homely food providers. Compare meal plans, menus, and prices to find the right meals on MessMeals.",
    images: ["/seo/og-listings.png"],
    url: "/view-all-listings",
  },
};

import { getAllMess } from "../../../services/messApi";

export default async function ViewAllListingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const initialFilters: any = {};
  
  if (resolvedParams.name) initialFilters.search = resolvedParams.name;
  if (resolvedParams.latitude) initialFilters.latitude = resolvedParams.latitude;
  if (resolvedParams.longitude) initialFilters.longitude = resolvedParams.longitude;
  if (resolvedParams.foodType) initialFilters.foodType = resolvedParams.foodType;
  if (resolvedParams.planType) initialFilters.planType = resolvedParams.planType;
  
  let initialData = [];
  let initialMeta = null;
  
  try {
    const res = await getAllMess(1, 6, initialFilters);
    initialData = Array.isArray(res) ? res : res?.data ?? [];
    initialMeta = Array.isArray(res) ? null : res?.meta ?? null;
  } catch (err) {
    console.error("Failed to fetch view-all-listings initial data", err);
  }

  return (
    <Suspense fallback={null}>
      <ViewAllListingsClient initialData={initialData} initialMeta={initialMeta} />
    </Suspense>
  );
}
