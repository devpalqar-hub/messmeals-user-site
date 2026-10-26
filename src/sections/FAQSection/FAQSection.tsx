"use client";

import { useState } from "react";
import styles from "./FAQSection.module.css";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    id: "faq-1",
    q: "How do I find a mess available near me?",
    a: "Enter your city or locality in the MessMeals search area and choose your food preference or meal plan type. You can then browse available messes, compare their plans, and open a listing for more details.",
  },
  {
    id: "faq-2",
    q: "What is MessMeals?",
    a: "MessMeals helps customers discover local messes, compare daily and monthly meal plans, and book or enquire about everyday food options near them.",
  },
  {
    id: "faq-3",
    q: "What type of food can I find on MessMeals?",
    a: "Available options depend on the messes listed in your area. You may find vegetarian, non-vegetarian, mixed, breakfast, lunch, dinner, daily, and monthly meal options.",
  },
  {
    id: "faq-4",
    q: "Can I find monthly mess food on MessMeals?",
    a: "Yes, where monthly plans are available. Open the individual mess listing to check the meals included, price, plan duration, and current availability.",
  },
  {
    id: "faq-5",
    q: "Can I find daily mess food near me?",
    a: "You can search for daily meal plans where they are offered by local messes. Availability depends on the location and the individual mess.",
  },
  {
    id: "faq-6",
    q: "Can I choose only breakfast, lunch, or dinner?",
    a: "Some messes offer individual meal plans, such as breakfast only, lunch only, or dinner only. Check the available plans on each mess listing.",
  },
  {
    id: "faq-7",
    q: "Are vegetarian and non-vegetarian mess options available?",
    a: "Food preferences depend on the available messes in your area. Use the food-preference filter to explore vegetarian, non-vegetarian, or mixed options where available.",
  },
  {
    id: "faq-8",
    q: "How much does mess food cost?",
    a: "Prices vary by location, meals included, plan duration, and the individual mess. MessMeals displays the available price and plan information on each listing.",
  },
  {
    id: "faq-9",
    q: "Does every mess provide delivery?",
    a: "No. Delivery, pickup, and service areas depend on the individual mess. Check the listing details or contact the mess before booking.",
  },
  {
    id: "faq-10",
    q: "How do I book a meal plan?",
    a: "Search for an available mess, compare its plans, open the plan details, and continue with the booking or enquiry option shown on the listing.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const col1 = FAQS.slice(0, 5);
  const col2 = FAQS.slice(5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className={styles["faq-section"]} id="faq" aria-labelledby="faq-heading">
        {/* Header */}
        <div className={styles["faq-header"]}>
          <div className={styles["faq-badge"]}>
            <span className={styles["faq-badge-line"]} />
            <span>FAQ</span>
            <span className={styles["faq-badge-line"]} />
          </div>

          <h2 className={styles["faq-title"]} id="faq-heading">
            Frequently Asked Questions About{" "}
            <span className={styles["faq-title-accent"]}>Mess Food</span> and{" "}
            <span className={styles["faq-title-accent"]}>Meal Plans</span>
          </h2>

          <p className={styles["faq-subtitle"]}>
            Find answers to common questions about using MessMeals, finding messes,
            and choosing the right meal plans for your daily needs.
          </p>
        </div>

        {/* Two-column accordion grid */}
        <div className={styles["faq-grid"]}>
          {[col1, col2].map((col, ci) => (
            <div key={ci} className={styles["faq-col"]}>
              {col.map((faq, idx) => {
                const globalIdx = ci * 5 + idx + 1;
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`${styles["faq-item"]} ${isOpen ? styles["faq-item--open"] : ""}`}
                  >
                    <h3 className={styles["faq-item-heading"]}>
                      <button
                        id={`${faq.id}-btn`}
                        className={styles["faq-btn"]}
                        aria-expanded={isOpen}
                        aria-controls={`${faq.id}-panel`}
                        onClick={() => toggle(faq.id)}
                      >
                        <span className={styles["faq-num"]}>{globalIdx}</span>
                        <span className={styles["faq-question"]}>{faq.q}</span>
                        <span
                          className={`${styles["faq-chevron"]} ${isOpen ? styles["faq-chevron--open"] : ""}`}
                          aria-hidden="true"
                        >
                          <ChevronDown size={18} strokeWidth={2.2} />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={`${faq.id}-panel`}
                      role="region"
                      aria-labelledby={`${faq.id}-btn`}
                      className={`${styles["faq-panel"]} ${isOpen ? styles["faq-panel--open"] : ""}`}
                    >
                      <p className={styles["faq-answer"]}>{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
