import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Coffee, Leaf, CalendarDays, ListChecks, CheckCircle2, ChevronRight, Star, GraduationCap } from "lucide-react";
import { MapPin, Utensils, Home } from "../../../../components/ui/SvgIcon/SvgIcon";
import { getAllMess } from "../../../../services/messApi";
import type { MessListing } from "../../../../types/mess";
import FaqItem from "../../../../components/ui/FaqItem/FaqItem";
import CityMessGrid from "../../../../components/ui/CityMessGrid/CityMessGrid";
import styles from "./page.module.css";

// ─── Thiruvananthapuram centre coordinates ────────────────────────────────────
const TVM_LAT = "8.5241";
const TVM_LNG = "76.9366";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Messes in Trivandrum | Homely Food & Meal Plans | MessMeals",
  description:
    "Find messes in Trivandrum (Thiruvananthapuram) on MessMeals. Explore homely food options, available menus, and daily or monthly meal plans.",
  alternates: {
    canonical: "https://messmeals.com/messes/thiruvananthapuram/",
  },
  openGraph: {
    title: "Messes in Trivandrum | Homely Food & Meal Plans | MessMeals",
    description:
      "Explore messes in Thiruvananthapuram, browse available menus, and check daily or monthly meal plans on MessMeals.",
    url: "https://messmeals.com/messes/thiruvananthapuram/",
    type: "website",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const AREAS = [
  { name: "Karamana" },
  { name: "Maruthankuzhi" },
  { name: "Muttathara" },
  { name: "Nalanchira" },
  { name: "Paruthippara" },
  { name: "Chekkalamukku" },
  { name: "Kulathoor" },
  { name: "Uliyazhathura" },
  { name: "Kazhakkoottam" },
  { name: "Poojapura" },
  { name: "Sasthamangalam" },
  { name: "Palayam" },
];

const AUDIENCE_CARDS = [
  {
    icon: GraduationCap,
    label: "For Students",
    desc: "Explore nearby messes for everyday meals while studying or living away from home.",
  },
  {
    icon: Briefcase,
    label: "For Working Professionals",
    desc: "Find meal options that work around your office hours and daily schedule.",
  },
  {
    icon: Home,
    label: "For Hostel & PG Residents",
    desc: "Browse local food providers when cooking every day is not practical.",
  },
  {
    icon: Coffee,
    label: "For Everyday Meals",
    desc: "Explore everyday meal options that can make your routine easier.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Check the location",
    desc: "Look for a mess near your home, hostel, college, or workplace, and confirm the address.",
  },
  {
    n: 2,
    title: "Check the meals",
    desc: "Review the menu and food categories shown on the listing.",
  },
  {
    n: 3,
    title: "Compare plans",
    desc: "Compare the plan duration and listed price when those details are available.",
  },
  {
    n: 4,
    title: "Check food preferences",
    desc: "Check whether the provider offers vegetarian, non-vegetarian, or mixed food options.",
  },
  {
    n: 5,
    title: "Review the details",
    desc: "Review the address, contact details, menu, and any available plan information.",
  },
  {
    n: 6,
    title: "Contact the mess when needed",
    desc: "Contact the mess to confirm current availability, timings, prices, and plan terms.",
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
    a: "A mess is a food service that provides meals to customers, often on a daily or recurring plan. Menus, meal timings, pricing, and plan terms vary between providers.",
  },
  {
    q: "Where can I find messes in Thiruvananthapuram?",
    a: "Browse the listings on this page to explore messes in Thiruvananthapuram. Localities featured include Karamana, Kazhakkoottam, Poojapura, Muttathara, Palayam, and other areas. Open each listing to check its location and current details.",
  },
  {
    q: "Are there vegetarian messes in Trivandrum?",
    a: "Some listings are marked as vegetarian, while others offer non-vegetarian or mixed food options. Check each listing or contact the provider to confirm the current menu.",
  },
  {
    q: "Are there non-vegetarian messes in Trivandrum?",
    a: "Some messes list non-vegetarian food options. Review the food category on the individual listing and confirm the current menu directly with the provider.",
  },
  {
    q: "Can I find monthly meal plans in Trivandrum?",
    a: "Some providers may offer daily or recurring meal plans. Check each mess listing for available details, and contact the provider to confirm current pricing, meals, and availability.",
  },
  {
    q: "Can I find mess food near Technopark?",
    a: "Start by browsing mess listings in Kazhakkoottam and nearby localities. Check each provider’s address to see whether it is convenient for Technopark, and confirm current availability directly with the mess.",
  },
  {
    q: "Can students find regular food options in Trivandrum?",
    a: "Yes. Students can browse available messes and review location, food preferences, menus, and any meal-plan details shown on each listing. Confirm availability and pricing with the provider before choosing.",
  },
];

// ─── Page data and structured data ───────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ThiruvananthapuramPage() {
  let initialData: MessListing[] = [];
  try {
    const res = await getAllMess(1, 50, {
      latitude: TVM_LAT,
      longitude: TVM_LNG,
    });
    initialData = Array.isArray(res) ? res : res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch Thiruvananthapuram messes", err);
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
        name: "Thiruvananthapuram",
        item: "https://messmeals.com/messes/thiruvananthapuram/",
      },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Messes in Thiruvananthapuram (Trivandrum) | MessMeals",
    description:
      "Browse messes in Thiruvananthapuram (Trivandrum), explore menus and food options, and check available meal plans on MessMeals.",
    url: "https://messmeals.com/messes/thiruvananthapuram/",
  };

  const itemListLd =
    initialData.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Messes in Thiruvananthapuram",
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
        id="json-ld-breadcrumb-tvm"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="json-ld-collection-tvm"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
      />
      {itemListLd && (
        <Script
          id="json-ld-itemlist-tvm"
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
              <span>FIND A MESS · THIRUVANANTHAPURAM</span>
            </div>
            <h1 className={styles["hero-title"]}>
              Messes in{" "}
              <span>Thiruvananthapuram</span>{" "}
              <span className={styles["hero-title-alt"]}>(Trivandrum)</span>
            </h1>
            <p className={styles["hero-desc"]}>
              Looking for a mess in Thiruvananthapuram (Trivandrum)? Browse local messes and homely food providers, explore available menus and meal plans, and find everyday food options that suit your location and routine.
            </p>
            <p className={styles["hero-desc-sub"]}>
              Whether you're a student, a working professional, or a hostel or PG resident, MessMeals helps you explore local food options in one place. Open a listing to check its location, food categories, menus, and contact details.
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
              Find a Mess in Thiruvananthapuram (Trivandrum)
            </h2>
            <p className={styles["section-desc"]}>
              Browse mess listings across Thiruvananthapuram. Open a listing to review its address, food options, menu, available plan details, and contact information. Details can vary by provider, so confirm availability directly before choosing.
            </p>
          </div>
          <CityMessGrid messes={initialData} defaultCity="Thiruvananthapuram" />
        </section>

        {/* ── 4. AREAS ── */}
        <section className={styles["areas-section"]}>
          <div className={styles["section-container"]}>
            <div className={styles["section-label"]}>
              <span>EXPLORE BY AREA</span>
            </div>
            <h2 className={styles["section-title"]}>
              Explore Messes by Area in Thiruvananthapuram
            </h2>
            <p className={styles["section-desc"]}>
              Use these locality shortcuts to look for food providers near your home, hostel, college, or workplace. Open each listing to confirm the exact address and check whether the location suits your daily routine.
            </p>
          </div>
          <div className={styles["areas-grid"]}>
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/messes?latitude=${TVM_LAT}&longitude=${TVM_LNG}&name=${encodeURIComponent(area.name)}`}
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
              Find Homely Food in Trivandrum for Your Daily Routine
            </h2>
            <p className={styles["section-desc"]}>
              From students and hostel residents to working professionals, everyone needs convenient everyday food. Browse available messes in Thiruvananthapuram and explore options based on your location, food preferences, and meal requirements.
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
                Vegetarian and Non-Vegetarian Messes in Trivandrum
              </h2>
              <p className={styles["section-desc"]}>
                Prefer vegetarian meals, non-vegetarian dishes, or a provider that serves both? Review the food category on each mess listing before you decide. Options vary by provider, so check the individual listing or contact the mess to confirm what is currently available.
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
                <p>Explore listings marked as vegetarian.</p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-nonveg"]}`}
                >
                  <Utensils size={22} />
                </div>
                <h3>Non-Vegetarian</h3>
                <p>Find providers that list non-vegetarian food options.</p>
              </div>
              <div className={styles["food-pref-card"]}>
                <div
                  className={`${styles["food-pref-card-icon"]} ${styles["food-pref-mixed"]}`}
                >
                  <BookOpen size={22} />
                </div>
                <h3>Mixed</h3>
                <p>Check messes that offer both vegetarian and non-vegetarian food.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. MEAL PLANS ── */}
        <section className={styles["plans-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Daily and Monthly Mess Meal Plans in Trivandrum
            </h2>
            <p className={styles["section-desc"]}>
              Looking for food for today or a recurring monthly arrangement? Available plans, meal types, pricing, and duration differ by provider. Check each listing for current details and contact the mess if plan information or prices are not shown.
            </p>
            <p className={styles["section-desc"]}>
              Open a mess listing to review its available menus and plan information. Confirm current prices, timings, and availability directly with the provider before subscribing.
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
              How to Choose the Right Mess in Thiruvananthapuram
            </h2>
            <p className={styles["section-desc"]}>
              Choosing a mess is about more than price. Look for a location that suits your routine, food you enjoy, and a plan that matches how often you need meals. Review the listing and contact the provider if any details are unclear.
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
                Find Mess Food in Thiruvananthapuram with MessMeals
              </h2>
              <p className={styles["section-desc"]}>
                Finding everyday food can take time when locations, menus, and contact details are scattered across different places. MessMeals brings local mess listings together so you can explore available food options, review the information provided, and contact a mess before deciding.
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
                  desc: "Browse local listings and check each provider’s location.",
                },
                {
                  icon: ListChecks,
                  label: "Compare",
                  desc: "Review the menus and plan details that each mess shares.",
                },
                {
                  icon: CheckCircle2,
                  label: "Choose",
                  desc: "Choose a provider that suits your location and food preferences.",
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
              Frequently Asked Questions About Messes in Thiruvananthapuram
            </h2>
          </div>
          <div className={styles["faq-list"]}>
            {FAQS.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
