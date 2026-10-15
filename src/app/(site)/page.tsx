import type { Metadata } from "next";
import HeroSection from "../../sections/HeroSection/HeroSection";
import PopularPlans from "../../sections/PopularPlans/PopularPlans";
import FeaturedMesses from "../../sections/FeaturedMesses/FeaturedMesses";
import VerifiedMesses from "../../sections/VerifiedMesses/VerifiedMesses";
// import Testimonials from "../../sections/Testimonials/Testimonials";
import PartnerSection from "../../sections/PartnerSection/PartnerSection";
import OwnAMess from "../../sections/OwnAMess/OwnAMess";
import WhyMessMeals from "../../sections/WhyMessMeals/WhyMessMeals";
import HowItWorks from "../../sections/HowItWorks/HowItWorks";
import FAQSection from "../../sections/FAQSection/FAQSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find a Mess Near You | Meal Plans & Homely Food | MessMeals",
  description:
    "Search nearby messes on MessMeals. Compare menus, daily and monthly meal plans, food options and prices to find meals that fit your routine.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Find a Mess Near You | Meal Plans & Homely Food | MessMeals",
    description:
      "Search nearby messes on MessMeals. Compare menus, daily and monthly meal plans, food options and prices to find meals that fit your routine.",
    images: ["/seo/og-home.png"],
    url: "/",
  },
};

import { getAllMess } from "../../services/messApi";
import { getPopularPlans } from "../../services/popularPlansApi";

export default async function Home() {
  let featuredMesses: any[] = [];
  let verifiedMesses: any[] = [];
  let popularPlans: any[] = [];

  try {
    const [fRes, vRes, pRes] = await Promise.all([
      getAllMess(1, 8, { featured: "true" }),
      getAllMess(1, 8, { isVerified: "true" }),
      getPopularPlans(1, 25),
    ]);

    featuredMesses = Array.isArray(fRes) ? fRes : fRes?.data ?? [];
    verifiedMesses = Array.isArray(vRes) ? vRes : vRes?.data ?? [];
    popularPlans = Array.isArray(pRes) ? pRes : pRes?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch initial home data", error);
  }

  return (
    <>
      <HeroSection />
      <PopularPlans initialData={popularPlans} />
      <FeaturedMesses initialData={featuredMesses} />
      <VerifiedMesses initialData={verifiedMesses} />
      <HowItWorks />
      <WhyMessMeals />
      {/* <Testimonials /> */}
      <FAQSection />
      <PartnerSection />
      <OwnAMess />
    </>
  );
}
