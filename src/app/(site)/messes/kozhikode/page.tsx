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

// ─── Kozhikode (Calicut) centre coordinates ───────────────────────────────────
const CLT_LAT = "11.2588";
const CLT_LNG = "75.7804";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Messes in Kozhikode | Homely Food & Meal Plans | MessMeals",
  description:
    "Find messes in Kozhikode on MessMeals. Explore homely food options, available menus, and daily or monthly meal plans from local providers.",
  alternates: {
    canonical: "https://messmeals.com/messes/kozhikode/",
  },
  openGraph: {
    title: "Messes in Kozhikode | Homely Food & Meal Plans | MessMeals",
    description:
      "Explore messes in Kozhikode (Calicut), browse available menus, and check daily or monthly meal plans on MessMeals.",
    url: "https://messmeals.com/messes/kozhikode/",
    type: "website",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const AREAS = [
  { name: "Nadakkavu" },
  { name: "Mavoor Road" },
  { name: "Thondayad" },
  { name: "Kottooli" },
  { name: "Palayam" },
  { name: "West Hill" },
  { name: "East Hill" },
  { name: "Chevayur" },
  { name: "Medical College" },
  { name: "Malaparamba" },
  { name: "Kallai" },
  { name: "Beypore" },
];

const AUDIENCE_CARDS = [
  {
    icon: GraduationCap,
    label: "For Students",
    desc: "Find everyday food options while studying, staying in a hostel or living away from home. Explore nearby messes and check the meal plans available for your routine.",
  },
  {
    icon: Briefcase,
    label: "For Working Professionals",
    desc: "Make everyday meals easier to plan around a busy work schedule. Explore food providers near your home or workplace and check their menus and meal options.",
  },
  {
    icon: Home,
    label: "For Hostel & PG Residents",
    desc: "Looking for food without having to cook every day? Discover homely food options in Kozhikode and compare available meal plans before choosing a provider.",
  },
  {
    icon: Coffee,
    label: "For Everyday Meals",
    desc: "Whether you need lunch, dinner or regular meals throughout the week, explore local mess listings and check which options suit your everyday needs.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Check the Location",
    desc: "Look for a mess that's convenient for where you live, study or work. Consider your regular travel route and how easily you can access the food provider.",
  },
  {
    n: 2,
    title: "Review the Menu",
    desc: "Check the available meals and food preferences. Make sure the options match what you normally like to eat.",
  },
  {
    n: 3,
    title: "Compare Available Plans",
    desc: "Review the daily or monthly plans offered by different providers. Compare the duration, meals included and listed prices.",
  },
  {
    n: 4,
    title: "Consider Your Food Preferences",
    desc: "Check whether the mess offers vegetarian, non-vegetarian or mixed food options according to your needs.",
  },
  {
    n: 5,
    title: "Read the Listing Details",
    desc: "Review the address, contact information, menu and other available details. Check the latest information instead of relying on assumptions.",
  },
  {
    n: 6,
    title: "Contact the Provider Before Choosing",
    desc: "If something is unclear, ask about meal timings, plan inclusions, pricing or availability before committing to a plan.",
  },
];

const PLAN_CARDS = [
  {
    icon: CalendarDays,
    label: "Daily Plans",
    desc: "Explore available options when you're looking for individual meals or food for a particular day.",
  },
  {
    icon: Star,
    label: "Monthly Plans",
    desc: "Check for recurring meal plans that suit your everyday routine and help you plan your regular food requirements.",
  },
  {
    icon: ListChecks,
    label: "Meal Menus",
    desc: "Review the menus and meal options listed by each mess so you know what to expect before contacting the provider.",
  },
];

const FAQS = [
  {
    q: "Where can I find messes in Kozhikode?",
    a: "You can explore mess listings on MessMeals to find food providers in Kozhikode (Calicut). Check each listing for its location, available menus, meal plans, pricing and contact details.",
  },
  {
    q: "Is Kozhikode the same as Calicut?",
    a: "Yes. Kozhikode is also widely known as Calicut. People may use either name when searching for messes, homely food and everyday meal options in the city.",
  },
  {
    q: "Can I find vegetarian messes in Kozhikode?",
    a: "You can review MessMeals listings for vegetarian food options. Check each provider's current menu and listing details to confirm which meals are available.",
  },
  {
    q: "Can I find non-vegetarian mess food in Calicut?",
    a: "Explore the available mess listings and check which providers offer non-vegetarian meals. Menus and food choices may vary between providers, so review the latest details before choosing.",
  },
  {
    q: "Are monthly meal plans available in Kozhikode?",
    a: "Some mess providers may offer recurring meal plans. Explore the current listings on MessMeals and contact the provider to confirm the available plans, prices, duration and meals included.",
  },
  {
    q: "Can I find mess food near Kozhikode Medical College?",
    a: "Start by exploring listings and searching for options around the Medical College area. Check the location shown on each listing and confirm its current availability and meal details with the provider.",
  },
  {
    q: "How do I choose the right mess in Calicut?",
    a: "Consider the location, menu, food preferences, meal timings, price and plan duration. Compare the available details on MessMeals and contact the provider if you need clarification before selecting a meal plan.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function KozhikodePage() {
  let initialData: MessListing[] = [];
  try {
    const res = await getAllMess(1, 50, {
      latitude: CLT_LAT,
      longitude: CLT_LNG,
    });
    initialData = Array.isArray(res) ? res : res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch Kozhikode messes", err);
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
        name: "Kozhikode",
        item: "https://messmeals.com/messes/kozhikode/",
      },
    ],
  };

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Messes in Kozhikode (Calicut) | MessMeals",
    description:
      "Explore messes, homely food, available menus and meal plans across Kozhikode with MessMeals.",
    url: "https://messmeals.com/messes/kozhikode/",
  };

  const itemListLd =
    initialData.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Messes in Kozhikode",
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
        id="json-ld-breadcrumb-clt"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="json-ld-collection-clt"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
      />
      {itemListLd && (
        <Script
          id="json-ld-itemlist-clt"
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
              <span>MESSMEALS · KOZHIKODE</span>
            </div>
            <h1 className={styles["hero-title"]}>
              Messes in{" "}
              <span>Kozhikode</span>{" "}
              <span className={styles["hero-title-alt"]}>(Calicut)</span>
            </h1>
            <p className={styles["hero-desc"]}>
              Looking for a mess in Kozhikode? Whether you call it Kozhikode or Calicut, finding a convenient place for everyday meals shouldn't have to be difficult. MessMeals helps you explore local messes, discover homely food options, check available menus and compare meal plans that fit your daily routine.
            </p>
            <p className={styles["hero-desc-sub"]}>
              Whether you're a student living away from home, a working professional with a busy schedule, or someone looking for regular home-style meals, explore food options in and around Kozhikode in one place.
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
              Messes &amp; Homely Food Options in Kozhikode
            </h2>
            <p className={styles["section-desc"]}>
              Looking for everyday meals in Calicut? Explore messes and food providers listed on MessMeals. Check individual listings for available menus, vegetarian and non-vegetarian options, meal plans, pricing, locations and contact details.
            </p>
            <p className={styles["section-desc"]}>
              From finding a convenient lunch option to exploring a monthly meal plan, compare the available details and choose a mess that suits your routine.
            </p>
          </div>
          <CityMessGrid messes={initialData} defaultCity="Kozhikode" />
        </section>

        {/* ── 3. AREAS ── */}
        <section className={styles["areas-section"]}>
          <div className={styles["section-container"]}>
            <div className={styles["section-label"]}>
              <span>EXPLORE BY AREA</span>
            </div>
            <h2 className={styles["section-title"]}>
              Find Messes Across Kozhikode
            </h2>
            <p className={styles["section-desc"]}>
              Finding a mess close to home, college or work can make your daily routine easier. Explore local areas across Kozhikode and check the available listings to find food options that are convenient for you.
            </p>
            <p className={styles["section-desc"]}>
              Whether you're around the city centre, a residential neighbourhood or the Medical College area, start with the locations that work best for your everyday travel.
            </p>
          </div>
          <div className={styles["areas-grid"]}>
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/messes?latitude=${CLT_LAT}&longitude=${CLT_LNG}&name=${encodeURIComponent(area.name)}`}
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
              Everyone has different food needs. Students may need regular meals near their college or hostel, working professionals may prefer convenient lunch and dinner options, and people living away from family may simply want a dependable place for everyday food.
            </p>
            <p className={styles["section-desc"]}>
              Explore messes in Kozhikode based on your location, food preferences and meal requirements.
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
                Explore Vegetarian &amp; Non-Vegetarian Mess Food in Calicut
              </h2>
              <p className={styles["section-desc"]}>
                Food preferences matter when choosing a regular mess. Some people prefer vegetarian meals, while others look for non-vegetarian dishes or a mix of both.
              </p>
              <p className={styles["section-desc"]}>
                MessMeals helps you explore food providers and review the options described in their listings. Check each mess's current menu and food details before deciding on a meal plan.
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
                  Explore messes that list vegetarian meal options and check the available menus before choosing.
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
                  Look for food providers offering non-vegetarian meals and review their current food options and plans.
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
                  Prefer a mix of vegetarian and non-vegetarian food? Review individual listings to understand which meal choices each provider offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. MEAL PLANS ── */}
        <section className={styles["plans-section"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["section-title"]}>
              Find Daily &amp; Monthly Meal Plans in Kozhikode
            </h2>
            <p className={styles["section-desc"]}>
              Your food routine may change depending on your schedule, budget and meal requirements. Some people need individual meals, while others prefer a recurring plan for regular lunch, dinner or multiple meals throughout the day.
            </p>
            <p className={styles["section-desc"]}>
              Explore available mess listings on MessMeals and check the plan duration, pricing, menus and meals included. Since every provider may offer different options, review the details of each plan before making a decision.
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
              How to Choose the Right Mess in Kozhikode
            </h2>
            <p className={styles["section-desc"]}>
              Choosing a mess isn't only about finding the nearest place. You'll also want to consider the menu, meal timings, pricing and whether the available plans fit your routine.
            </p>
            <p className={styles["section-desc"]}>
              Here are a few things to check before choosing a mess in Calicut.
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
                A Simpler Way to Find Everyday Meals in Kozhikode
              </h2>
              <p className={styles["section-desc"]}>
                Finding regular food can take time when details about different messes are scattered across multiple sources. You may need to compare locations, check menus, understand meal plans and contact providers before deciding.
              </p>
              <p className={styles["section-desc"]}>
                MessMeals brings mess listings and useful food-related information together, helping you explore available options across Kozhikode in one place.
              </p>
              <Link href="#listings" className={styles["why-cta"]}>
                Explore Messes in Kozhikode
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles["why-cards"]}>
              {[
                {
                  icon: MapPin,
                  label: "Discover",
                  desc: "Explore mess listings and food providers based on the areas that are convenient for you.",
                },
                {
                  icon: ListChecks,
                  label: "Compare",
                  desc: "Review available menus, meal plans, food preferences and pricing details to understand your options.",
                },
                {
                  icon: CheckCircle2,
                  label: "Choose",
                  desc: "Shortlist a mess that fits your location, food preferences and everyday meal requirements.",
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
              Frequently Asked Questions About Messes in Kozhikode
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
              Find Your Everyday Meals in Kozhikode
            </h2>
            <p className={styles["section-desc"]}>
              Finding regular food should fit naturally into your day. Whether you're studying, working or living away from home, MessMeals helps you explore messes and homely food options in Kozhikode.
            </p>
            <p className={styles["section-desc"]}>
              Browse the available listings, review menus and meal plans, and find a food provider that suits your location and routine.
            </p>
            <Link
              href="#listings"
              className={styles["why-cta"]}
              style={{ marginTop: 14 }}
            >
              Explore Messes in Kozhikode
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
