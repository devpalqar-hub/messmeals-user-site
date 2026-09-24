import type { Metadata } from "next";

import Script from "next/script";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Utensils,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  Coffee,
  Leaf,
  CalendarDays,
  ListChecks,
  CheckCircle2,
  ChevronRight,
  Star,
} from "lucide-react";
import { getAllMess } from "../../../../services/messApi";
import type { MessListing } from "../../../../types/mess";
import styles from "./page.module.css";
import ErnMessGrid from "./ErnMessGrid";
import ErnFaqItem from "./ErnFaqItem";

// ─── Ernakulam (Kochi) centre coordinates ────────────────────────────────────
const ERN_LAT = "9.9312";
const ERN_LNG = "76.2673";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Messes in Ernakulam (Kochi) | Meal Plans & Menus | MessMeals",
  description:
    "Find messes and homely food in Ernakulam (Kochi). Explore meal plans, menus and food options on MessMeals and find meals that fit your routine.",
  alternates: { canonical: "/messes/ernakulam/" },
  openGraph: {
    title: "Messes in Ernakulam (Kochi) | MessMeals",
    description:
      "Explore messes, homely food, meal plans and menus across Ernakulam with MessMeals.",
    url: "/messes/ernakulam/",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const AREAS = [
  { name: "Kakkanad" },
  { name: "Edappally" },
  { name: "Aluva" },
  { name: "Tripunithura" },
  { name: "Kalamassery" },
  { name: "Maradu" },
  { name: "Palarivattom" },
  { name: "Vytilla" },
  { name: "Vyttila" },
  { name: "Fort Kochi" },
  { name: "Mattancherry" },
  { name: "Thrikkakara" },
];

const AUDIENCE_CARDS = [
  {
    icon: GraduationCap,
    label: "For Students",
    desc: "Find regular meal options while studying, living in a hostel or staying away from home in Kochi.",
  },
  {
    icon: Briefcase,
    label: "For Working Professionals",
    desc: "Explore convenient everyday food options that fit around work schedules across Ernakulam.",
  },
  {
    icon: Home,
    label: "For Hostel & PG Residents",
    desc: "Discover homely food options when cooking every day isn't practical.",
  },
  {
    icon: Coffee,
    label: "For Everyday Meals",
    desc: "Find regular food options without having to cook every meal yourself.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Check the location",
    desc: "Choose a mess that's practical for where you live, study or work.",
  },
  {
    n: 2,
    title: "Check the meals",
    desc: "Look at the available meal types and menus.",
  },
  {
    n: 3,
    title: "Compare plans",
    desc: "Compare daily or monthly plans when multiple options are available.",
  },
  {
    n: 4,
    title: "Check food preferences",
    desc: "Make sure the available food matches your preferences.",
  },
  {
    n: 5,
    title: "Review the details",
    desc: "Check the listing, contact information and other details provided by the mess.",
  },
  {
    n: 6,
    title: "Contact the mess when needed",
    desc: "Ask the provider about anything that isn't clear before choosing a plan.",
  },
];

const PLAN_CARDS = [
  {
    icon: CalendarDays,
    label: "Daily Plans",
    desc: "Explore options designed for individual meals or daily food requirements.",
  },
  {
    icon: Star,
    label: "Monthly Plans",
    desc: "Find recurring meal plans for people who need regular everyday food.",
  },
  {
    icon: ListChecks,
    label: "Meal Menus",
    desc: "Check what meals and food options are available before choosing.",
  },
];

const FAQS = [
  {
    q: "What is a mess?",
    a: "A mess is a food service that provides regular meals to customers, often through daily or recurring meal plans. The meals, pricing and plan structure can differ between providers.",
  },
  {
    q: "Where can I find messes in Ernakulam?",
    a: "MessMeals lists messes and food providers across different areas of Ernakulam, including areas such as Kakkanad, Edappally, Kalamassery, Aluva, Tripunithura, Vytilla and others.",
  },
  {
    q: "Are there vegetarian messes in Kochi?",
    a: "Yes. MessMeals includes listings that offer vegetarian food as well as providers offering both vegetarian and non-vegetarian options.",
  },
  {
    q: "Are there non-vegetarian messes in Ernakulam?",
    a: "Yes. Some current MessMeals listings include non-vegetarian options. Check each individual listing for the latest food information.",
  },
  {
    q: "Can I find monthly meal plans in Kochi?",
    a: "Some MessMeals listings provide recurring meal plans. Check each mess page for the current plans, pricing and meals included.",
  },
  {
    q: "Can I find mess food near Kakkanad and Infopark?",
    a: "MessMeals includes listings in and around the Kakkanad and Infopark area. Explore available options based on your location and food preference.",
  },
  {
    q: "Can students find regular food options in Ernakulam?",
    a: "Yes. Students can explore messes on MessMeals and compare available options based on location, food preference and meal plans.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ErnakulamPage() {
  let initialData: MessListing[] = [];

  try {
    const res = await getAllMess(1, 50, {
      latitude: ERN_LAT,
      longitude: ERN_LNG,
    });
    initialData = Array.isArray(res) ? res : res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch Ernakulam messes", err);
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
        name: "Ernakulam",
        item: "https://messmeals.com/messes/ernakulam/",
      },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Messes in Ernakulam (Kochi) | MessMeals",
    description:
      "Find messes and homely food in Ernakulam (Kochi). Explore meal plans, menus and food options on MessMeals.",
    url: "https://messmeals.com/messes/ernakulam/",
  };

  const itemListLd =
    initialData.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Messes in Ernakulam",
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
        id="json-ld-breadcrumb-ern"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="json-ld-collection-ern"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
      />
      {itemListLd && (
        <Script
          id="json-ld-itemlist-ern"
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
              <span>MESSMEALS · ERNAKULAM</span>
            </div>
            <h1 className={styles["hero-title"]}>
              Messes in{" "}
              <span>Ernakulam</span>{" "}
              <span className={styles["hero-title-alt"]}>(Kochi)</span>
            </h1>
            <p className={styles["hero-desc"]}>
              Looking for a mess in Ernakulam, commonly known as Kochi or
              Cochin? Discover messes and homely food options across the city,
              explore available meal plans and menus, and find everyday meals
              that fit your routine.
            </p>
            <p className={styles["hero-desc-sub"]}>
              Whether you&apos;re a student, working professional, hostel resident, or
              simply looking for regular home-style food, MessMeals helps you
              explore your options in one place.
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

        {/* ── 3. LISTINGS ── */}
        <section className={styles["listings-section"]} id="listings">
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Messes &amp; Homely Food Options in Kochi
            </h2>
            <p className={styles["section-desc"]}>
              Explore food providers currently listed on MessMeals across
              Ernakulam. Check each listing for available food options, meal
              plans, menus, location and contact details.
            </p>
          </div>

          <ErnMessGrid messes={initialData} />
        </section>

        {/* ── 4. AREAS ── */}
        <section className={styles["areas-section"]}>
          <div className={styles["section-container"]}>
            <div className={styles["section-label"]}>
              <span>EXPLORE BY AREA</span>
            </div>
            <h2 className={styles["section-title"]}>
              Find Messes Across Ernakulam
            </h2>
            <p className={styles["section-desc"]}>
              Ernakulam has messes and food providers across different
              residential, student and working areas. Explore available listings
              based on the part of the city that works best for your daily
              routine.
            </p>
          </div>
          <div className={styles["areas-grid"]}>
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/messes?latitude=${ERN_LAT}&longitude=${ERN_LNG}&name=${encodeURIComponent(area.name)}`}
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

        {/* ── 5. AUDIENCE ── */}
        <section className={styles["audience-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Find Everyday Food That Fits Your Routine
            </h2>
            <p className={styles["section-desc"]}>
              Different people look for different kinds of everyday meals.
              Explore available messes in Ernakulam and choose options based on
              your routine, food preferences and meal requirements.
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

        {/* ── 6. FOOD PREFERENCE ── */}
        <section className={styles["food-pref-section"]}>
          <div className={styles["food-pref-inner"]}>
            <div className={styles["food-pref-text"]}>
              <div className={styles["section-label"]}>
                <span>FOOD OPTIONS</span>
              </div>
              <h2 className={styles["section-title"]}>
                Vegetarian &amp; Non-Vegetarian Food Options
              </h2>
              <p className={styles["section-desc"]}>
                Food preferences are different for everyone. MessMeals includes
                listings with vegetarian, non-vegetarian and mixed food options,
                depending on what each provider offers. Check the individual mess
                listing for the latest information before choosing a plan.
              </p>
              <p className={styles["section-desc"]}>
                Available listings in Ernakulam include vegetarian-only options
                and listings offering both vegetarian and non-vegetarian food.
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
                <p>Messes offering vegetarian-only meal options.</p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-nonveg"]}`}
                >
                  <Utensils size={22} />
                </div>
                <h3>Non-Vegetarian</h3>
                <p>Messes with non-vegetarian food options available.</p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-mixed"]}`}
                >
                  <BookOpen size={22} />
                </div>
                <h3>Mixed</h3>
                <p>Providers offering both vegetarian and non-vegetarian.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. MEAL PLANS ── */}
        <section className={styles["plans-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Daily &amp; Monthly Meal Plans
            </h2>
            <p className={styles["section-desc"]}>
              Some people need a meal every day, while others prefer a recurring
              monthly plan. Depending on the mess, available plans may differ in
              meal types, pricing and duration.
            </p>
            <p className={styles["section-desc"]}>
              Explore individual listings on MessMeals to check the plans, prices
              and menus currently provided by each mess.
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

        {/* ── 8. HOW TO CHOOSE ── */}
        <section className={styles["choose-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              How to Choose a Mess in Kochi
            </h2>
            <p className={styles["section-desc"]}>
              Choosing a mess isn&apos;t only about price. The right option depends on
              your location, food preferences, meal requirements and daily
              routine.
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

        {/* ── 9. WHY MESSMEALS ── */}
        <section className={styles["why-section"]}>
          <div className={styles["why-inner"]}>
            <div className={styles["why-text"]}>
              <div className={styles["section-label"]}>
                <span>WHY MESSMEALS</span>
              </div>
              <h2 className={styles["section-title"]}>
                A Simpler Way to Find Everyday Meals
              </h2>
              <p className={styles["section-desc"]}>
                Finding regular food can be difficult when information about
                different messes is spread across different places. MessMeals
                brings mess listings, meal plans, menus and useful information
                together so you can explore your options in one place.
              </p>
              <Link href="#listings" className={styles["why-cta"]}>
                Explore Messes
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles["why-cards"]}>
              {[
                {
                  icon: MapPin,
                  label: "Discover",
                  desc: "Find messes and food providers based on where you need them.",
                },
                {
                  icon: ListChecks,
                  label: "Compare",
                  desc: "Explore available food options, meal plans and menus.",
                },
                {
                  icon: CheckCircle2,
                  label: "Choose",
                  desc: "Find an option that fits your routine and food preferences.",
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

        {/* ── 10. FAQ ── */}
        <section className={styles["faq-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Frequently Asked Questions About Messes in Ernakulam
            </h2>
          </div>
          <div className={styles["faq-list"]}>
            {FAQS.map((item, idx) => (
              <ErnFaqItem key={idx} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </section>


      </main>
    </>
  );
}
