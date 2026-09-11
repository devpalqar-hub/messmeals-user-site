"use client";

import styles from "./HowItWorks.module.css";
import { MapPin, SlidersHorizontal, UtensilsCrossed, CalendarCheck, ArrowRight, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    num: "1",
    icon: MapPin,
    title: "Search your location",
    desc: "Enter your city or locality to find messes and meal plans available near you.",
  },
  {
    num: "2",
    icon: SlidersHorizontal,
    title: "Compare available plans",
    desc: "Review the food type, meals included, plan duration, price, location, and other details before choosing.",
  },
  {
    num: "3",
    icon: UtensilsCrossed,
    title: "Choose a mess",
    desc: "Open a mess listing to view its meal plans, menu information, service details, and contact options.",
  },
  {
    num: "4",
    icon: CalendarCheck,
    title: "Book or enquire",
    desc: "Select the plan that suits you and continue with the booking or enquiry process shown on the listing.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Find Your Everyday Meals with MessMeals",
  description:
    "Find a suitable mess and meal plan in a few simple steps. Search your area, compare the available options, and choose a plan that fits your routine.",
  step: STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
  })),
};

export default function HowItWorks() {
  const router = useRouter();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section className={styles["hiw-section"]} id="how-it-works">
        {/* Header */}
        <div className={styles["hiw-header"]}>
          <div className={styles["hiw-badge"]}>
            <span className={styles["hiw-badge-line"]} />
            <span>HOW IT WORKS</span>
            <span className={styles["hiw-badge-line"]} />
          </div>

          <h2 className={styles["hiw-title"]}>
            How to Find Your Everyday Meals
            <br />
            with <span className={styles["hiw-brand"]}>MessMeals</span>
          </h2>

          <p className={styles["hiw-intro"]}>
            Find a suitable mess and meal plan in a few simple steps. Search your area,
            compare the available options, and choose a plan that fits your routine.
          </p>
        </div>

        {/* Steps */}
        <div className={styles["hiw-steps"]}>
          {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
            <div className={styles["hiw-step-wrap"]} key={num}>
              <div className={styles["hiw-step"]}>
                {/* Step number badge */}
                <span className={styles["hiw-num"]}>{num}</span>

                {/* Icon bubble */}
                <div className={styles["hiw-icon-bubble"]}>
                  <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                </div>

                {/* Text: title + desc stacked */}
                <div className={styles["hiw-step-text"]}>
                  <h3 className={styles["hiw-step-title"]}>{title}</h3>
                  <p className={styles["hiw-step-desc"]}>{desc}</p>
                </div>
              </div>

              {/* Dashed connector (not after last) */}
              {i < STEPS.length - 1 && (
                <div className={styles["hiw-connector"]} aria-hidden="true">
                  <span className={styles["hiw-dash-line"]} />
                  <ArrowRight size={18} strokeWidth={2} className={styles["hiw-arrow-right"]} />
                  <ArrowDown size={18} strokeWidth={2} className={styles["hiw-arrow-down"]} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles["hiw-cta"]}>
          <button
            id="hiw-search-messes-btn"
            className={styles["hiw-cta-btn"]}
            onClick={() => router.push("/messes")}
          >
            Search Available Messes
            <ArrowRight size={17} strokeWidth={2} />
          </button>
        </div>
      </section>
    </>
  );
}
