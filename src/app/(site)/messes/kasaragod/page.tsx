import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Coffee,
  Leaf,
  CalendarDays,
  ListChecks,
  CheckCircle2,
  ChevronRight,
  Star,
  GraduationCap,
} from "lucide-react";
import {
  MapPin,
  Utensils,
  Home,
} from "../../../../components/ui/SvgIcon/SvgIcon";
import { getAllMess } from "../../../../services/messApi";
import type { MessListing } from "../../../../types/mess";
import FaqItem from "../../../../components/ui/FaqItem/FaqItem";
import CityMessGrid from "../../../../components/ui/CityMessGrid/CityMessGrid";
import styles from "./page.module.css";

// ─── Kasaragod (Kasargod) centre coordinates ──────────────────────────────────
const KSD_LAT = "12.4984";
const KSD_LNG = "74.9896";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Messes in Kasaragod | Homely Food & Meal Plans | MessMeals",
  description:
    "Find messes in Kasaragod on MessMeals. Explore homely food options, available menus, and daily or monthly meal plans from local providers.",
  alternates: {
    canonical: "https://messmeals.com/messes/kasaragod/",
  },
  openGraph: {
    title: "Messes in Kasaragod | Homely Food & Meal Plans | MessMeals",
    description:
      "Explore messes in Kasaragod, browse available menus, and check daily or monthly meal plans on MessMeals.",
    url: "https://messmeals.com/messes/kasaragod/",
    type: "website",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const AREAS = [
  { name: "Kasaragod Town" },
  { name: "Vidyanagar" },
  { name: "Thalangara" },
  { name: "Nellikunnu" },
  { name: "Chandragiri" },
  { name: "Chengala" },
  { name: "Kumbla" },
  { name: "Mogral Puthur" },
  { name: "Cherkala" },
  { name: "Madhur" },
  { name: "Bovikanam" },
  { name: "Adkathbail" },
];

const AUDIENCE_CARDS = [
  {
    icon: GraduationCap,
    label: "For Students",
    desc: "Living in a hostel or staying away from home for your studies? Explore nearby messes and review the available meal options that fit your college schedule and daily routine.",
  },
  {
    icon: Briefcase,
    label: "For Working Professionals",
    desc: "Busy workdays can make planning meals difficult. Explore messes near your home or workplace and check their menus and meal plans to find convenient everyday food options.",
  },
  {
    icon: Home,
    label: "For Hostel & PG Residents",
    desc: "Looking for regular meals without having to cook every day? Discover homely food options in Kasaragod and review the details of each provider before choosing.",
  },
  {
    icon: Coffee,
    label: "For Everyday Meals",
    desc: "Whether you need lunch, dinner or regular meals throughout the week, explore the listings available on MessMeals and find options that suit your routine.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Check the Location",
    desc: "Look for a mess that's convenient for where you live, study or work. Check the address and consider how easily you can reach the provider.",
  },
  {
    n: 2,
    title: "Review the Menu",
    desc: "Look through the available food options and make sure they match your preferences and meal requirements.",
  },
  {
    n: 3,
    title: "Compare Available Plans",
    desc: "Check the daily or monthly plans offered by each provider. Compare the price, duration and meals included wherever the information is available.",
  },
  {
    n: 4,
    title: "Consider Your Food Preferences",
    desc: "Check whether the provider offers vegetarian, non-vegetarian or mixed food options that suit your needs.",
  },
  {
    n: 5,
    title: "Read the Listing Details",
    desc: "Review the provider's address, contact information, menus and other available details before making a decision.",
  },
  {
    n: 6,
    title: "Contact the Provider Before Choosing",
    desc: "If you have questions about meal timings, plan availability, pricing or food options, contact the provider to clarify the details before committing to a plan.",
  },
];

const PLAN_CARDS = [
  {
    icon: CalendarDays,
    label: "Daily Plans",
    desc: "Looking for food for the day? Explore available options and check which providers offer individual meals or daily plans.",
  },
  {
    icon: Star,
    label: "Monthly Plans",
    desc: "Prefer a regular meal arrangement? Look for messes offering recurring monthly plans and confirm the pricing, duration and meals included with the provider.",
  },
  {
    icon: ListChecks,
    label: "Meal Menus",
    desc: "Check the menus and meal options listed by each mess to understand what's available before choosing a plan.",
  },
];

const FAQS = [
  {
    q: "Where can I find messes in Kasaragod?",
    a: "You can explore the mess listings on MessMeals to discover food providers in Kasaragod. Check each listing for its location, menu, meal plans, pricing and contact details.",
  },
  {
    q: "Is Kasaragod also called Kasargod?",
    a: "Yes. Both Kasaragod and Kasargod are used to refer to this part of Kerala. You may encounter either spelling when searching for messes and everyday food options.",
  },
  {
    q: "Can I find vegetarian messes in Kasaragod?",
    a: "Check the available MessMeals listings for providers offering vegetarian food. Review each provider's current menu to confirm which meals are available.",
  },
  {
    q: "Can I find non-vegetarian mess food in Kasargod?",
    a: "Explore the available listings and check which providers offer non-vegetarian meals. Food choices can vary by provider, so review the latest menu details before choosing.",
  },
  {
    q: "Are monthly meal plans available in Kasaragod?",
    a: "Meal plan availability depends on each provider. Explore the current listings on MessMeals and contact the mess to confirm whether monthly plans are offered, along with their prices, duration and inclusions.",
  },
  {
    q: "How can I find a mess near my location in Kasaragod?",
    a: "Start by exploring listings in the areas that are convenient for you. Check the address and distance of each provider, and confirm the location before choosing a meal plan.",
  },
  {
    q: "How do I choose the right mess in Kasaragod?",
    a: "Consider the location, menu, food preferences, meal timings, pricing and available plans. Review the listing details on MessMeals and contact the provider if you need clarification before making your choice.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function KasaragodPage() {
  let initialData: MessListing[] = [];
  try {
    const res = await getAllMess(1, 50, {
      latitude: KSD_LAT,
      longitude: KSD_LNG,
    });
    initialData = Array.isArray(res) ? res : res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch Kasaragod messes", err);
  }

  // ── Structured Data ───────────────────────────────────────────────────────
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://messmeals.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Messes",
        item: "https://messmeals.com/messes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Kasaragod",
        item: "https://messmeals.com/messes/kasaragod/",
      },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Messes in Kasaragod (Kasargod) | MessMeals",
    description:
      "Explore messes, homely food, available menus and meal plans in Kasaragod with MessMeals.",
    url: "https://messmeals.com/messes/kasaragod/",
  };

  const itemListLd =
    initialData.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Messes in Kasaragod",
          itemListElement: initialData.map((mess, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: mess.messName,
            url: `https://messmeals.com/mess/${mess.slug}`,
          })),
        }
      : null;

  return (
    <>
      {/* ── Structured Data ── */}
      <Script
        id="json-ld-breadcrumb-ksd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="json-ld-collection-ksd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
      />
      {itemListLd && (
        <Script
          id="json-ld-itemlist-ksd"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      <main className={styles.page}>
        {/* ── 1. HERO ── */}
        <section className={styles.hero}>
          <div className={styles["hero-inner"]}>
            <div className={styles["hero-label"]}>
              <MapPin size={13} />
              <span>MESSMEALS · KASARAGOD</span>
            </div>
            <h1 className={styles["hero-title"]}>
              Messes in{" "}
              <span>Kasaragod</span>{" "}
              <span className={styles["hero-title-alt"]}>(Kasargod)</span>
            </h1>
            <p className={styles["hero-desc"]}>
              Looking for a mess in Kasaragod? Whether you're searching for everyday meals, homely food or a convenient meal plan, MessMeals helps you explore available messes and food providers in and around the area.
            </p>
            <p className={styles["hero-desc-sub"]}>
              Whether you're a student living away from home, a working professional with a busy schedule, or someone looking for regular home-style meals, you can browse local listings, check available menus and explore meal plans that fit your daily routine.
            </p>
            <div className={styles["hero-ctas"]}>
              <a href="#listings" className={styles["hero-cta-primary"]}>
                Explore Messes
                <ArrowRight size={16} />
              </a>
              <a href="#listings" className={styles["hero-cta-secondary"]}>
                Find a Meal Plan
              </a>
            </div>
          </div>
        </section>

        {/* ── 2. LISTINGS ── */}
        <section className={styles["listings-section"]} id="listings">
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Messes &amp; Homely Food Options in Kasaragod
            </h2>
            <p className={styles["section-desc"]}>
              Looking for everyday meals in Kasargod? Explore the messes and food providers listed on MessMeals to find options that suit your daily needs.
            </p>
            <p className={styles["section-desc"]}>
              Check individual listings for available menus, vegetarian and non-vegetarian food options, meal plans, pricing, locations and contact details. Whether you're looking for a convenient lunch or a plan for regular meals, review the available information before choosing a provider.
            </p>
          </div>
          <CityMessGrid messes={initialData} defaultCity="Kasaragod" />
        </section>

        {/* ── 3. AREAS ── */}
        <section className={styles["areas-section"]}>
          <div className={styles["section-container"]}>
            <div className={styles["section-label"]}>
              <span>EXPLORE BY AREA</span>
            </div>
            <h2 className={styles["section-title"]}>
              Find Messes Across Kasaragod
            </h2>
            <p className={styles["section-desc"]}>
              Finding a mess near your home, college or workplace can make everyday life a little easier. Start with the areas that are convenient for you and explore the mess listings available nearby.
            </p>
            <p className={styles["section-desc"]}>
              From Kasaragod town and surrounding residential areas to other nearby locations, check the listed addresses and available food options to find a provider that fits your routine.
            </p>
          </div>
          <div className={styles["areas-grid"]}>
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/messes?latitude=${KSD_LAT}&longitude=${KSD_LNG}&name=${encodeURIComponent(area.name)}`}
                className={styles["area-card"]}
              >
                <MapPin size={15} className={styles["area-card-icon"]} />
                <span className={styles["area-card-name"]}>{area.name}</span>
                <ChevronRight
                  size={14}
                  className={styles["area-card-arrow"]}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. AUDIENCE ── */}
        <section className={styles["audience-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Find Everyday Food That Fits Your Routine
            </h2>
            <p className={styles["section-desc"]}>
              Everyone has different food needs. Students may want convenient meals close to their college or hostel, working professionals may need options that fit around their workday, and people living away from family may prefer the familiarity of home-style food.
            </p>
            <p className={styles["section-desc"]}>
              MessMeals helps you explore the food providers listed in Kasaragod and review their available options based on your location, food preferences and meal requirements.
            </p>
          </div>
          <div className={styles["audience-grid"]}>
            {AUDIENCE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={styles["audience-card"]}>
                  <div className={styles["audience-card-icon"]}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles["audience-card-title"]}>{card.label}</h3>
                  <p className={styles["audience-card-desc"]}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. FOOD PREFERENCE ── */}
        <section className={styles["food-pref-section"]}>
          <div className={styles["food-pref-inner"]}>
            <div className={styles["food-pref-text"]}>
              <div className={styles["section-label"]}>
                <span>FOOD OPTIONS</span>
              </div>
              <h2 className={styles["section-title"]}>
                Explore Vegetarian &amp; Non-Vegetarian Mess Food in Kasaragod
              </h2>
              <p className={styles["section-desc"]}>
                Everyone has their own food preferences. Some people prefer vegetarian meals, while others look for non-vegetarian dishes or a mix of both.
              </p>
              <p className={styles["section-desc"]}>
                When exploring messes in Kasaragod, check the food options and menus listed by each provider. Since meal choices can differ from one mess to another, review the latest listing details or contact the provider if you need more information.
              </p>

              <Link href="#listings" className={styles["food-pref-cta"]}>
                Explore Food Options
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className={styles["food-pref-cards"]}>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-veg"]}`}
                >
                  <Leaf size={22} />
                </div>
                <h3>Vegetarian</h3>
                <p>
                  Explore listings that offer vegetarian meals and check the available menu before selecting a mess.
                </p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-nonveg"]}`}
                >
                  <Utensils size={22} />
                </div>
                <h3>Non-Vegetarian</h3>
                <p>
                  Looking for non-vegetarian food? Review the available listings to find providers that offer suitable meal options.
                </p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-mixed"]}`}
                >
                  <BookOpen size={22} />
                </div>
                <h3>Mixed Food Options</h3>
                <p>
                  Prefer both vegetarian and non-vegetarian meals? Check each provider's menu to understand the food choices available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. MEAL PLANS ── */}
        <section className={styles["plans-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Find Daily &amp; Monthly Meal Plans in Kasaragod
            </h2>
            <p className={styles["section-desc"]}>
              Your meal requirements depend on your schedule, budget and everyday routine. You may need individual meals on certain days, or you may prefer a recurring plan that covers your regular food requirements.
            </p>
            <p className={styles["section-desc"]}>
              Explore the mess listings on MessMeals to check the meal plans currently offered by each provider. Compare the available pricing, plan duration, menus and meals included before making a decision.
            </p>
          </div>
          <div className={styles["plans-grid"]}>
            {PLAN_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={styles["plan-card"]}>
                  <div className={styles["plan-card-icon"]}>
                    <Icon size={22} />
                  </div>
                  <h3 className={styles["plan-card-title"]}>{card.label}</h3>
                  <p className={styles["plan-card-desc"]}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. HOW TO CHOOSE ── */}
        <section className={styles["choose-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              How to Choose the Right Mess in Kasaragod
            </h2>
            <p className={styles["section-desc"]}>
              Choosing a mess involves more than finding a place nearby. You'll also want to consider the type of food, meal timings, pricing and whether the available plans suit your everyday routine.
            </p>
            <p className={styles["section-desc"]}>
              Here are a few things to check when choosing a mess in Kasargod.
            </p>
          </div>
          <div className={styles["steps-grid"]}>
            {STEPS.map((step, idx) => (
              <div key={step.n} className={styles["step-card"]}>
                <div className={styles["step-num"]}>
                  <CheckCircle2 size={15} />
                  <span>{step.n}</span>
                </div>
                <div className={styles["step-content"]}>
                  <h3 className={styles["step-title"]}>{step.title}</h3>
                  <p className={styles["step-desc"]}>{step.desc}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={styles["step-connector"]} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. WHY MESSMEALS ── */}
        <section className={styles["why-section"]}>
          <div className={styles["why-inner"]}>
            <div className={styles["why-text"]}>
              <div className={styles["section-label"]}>
                <span>WHY MESSMEALS</span>
              </div>
              <h2 className={styles["section-title"]}>
                A Simpler Way to Find Everyday Meals in Kasaragod
              </h2>
              <p className={styles["section-desc"]}>
                Finding regular food can take time when details about different messes are scattered across multiple sources. You may need to compare locations, look through menus and contact providers before finding the right option.
              </p>
              <p className={styles["section-desc"]}>
                MessMeals brings mess listings and useful food-related information together, helping you explore available options in Kasaragod in one place.
              </p>
              <Link href="#listings" className={styles["why-cta"]}>
                Explore Messes in Kasaragod
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles["why-cards"]}>
              {[
                {
                  icon: MapPin,
                  label: "Discover",
                  desc: "Explore listed messes and food providers in areas that are convenient for your daily routine.",
                },
                {
                  icon: ListChecks,
                  label: "Compare",
                  desc: "Review the available menus, meal plans, food preferences and pricing details to understand your options.",
                },
                {
                  icon: CheckCircle2,
                  label: "Choose",
                  desc: "Find a provider that suits your location, food preferences and everyday meal requirements.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={styles["why-card"]}>
                    <div className={styles["why-card-icon"]}>
                      <Icon size={20} />
                    </div>
                    <h3 className={styles["why-card-title"]}>{item.label}</h3>
                    <p className={styles["why-card-desc"]}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 9. FAQ ── */}
        <section className={styles["faq-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Frequently Asked Questions About Messes in Kasaragod
            </h2>
          </div>
          <div className={styles["faq-list"]}>
            {FAQS.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </section>

        {/* ── 10. FINAL CALL TO ACTION ── */}
        <section className={styles["final-cta-section"]}>
          <div className={styles["final-cta-inner"]}>
            <h2 className={styles["section-title"]}>
              Find Your Everyday Meals in Kasaragod
            </h2>
            <p className={styles["section-desc"]}>
              Finding regular food should fit naturally into your day. Whether you're studying, working or living away from home, MessMeals helps you explore messes and homely food options in Kasaragod.
            </p>
            <p className={styles["section-desc"]}>
              Browse the available listings, review menus and meal plans, and find a food provider that suits your location and routine.
            </p>
            <Link
              href="#listings"
              className={styles["why-cta"]}
              style={{ marginTop: 14 }}
            >
              Explore Messes in Kasaragod
              <ArrowRight size={16} />
            </Link>
            <span className={styles["final-cta-tagline"]}>
              MessMeals — Find homely food closer to you.
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
