"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin, Phone } from "lucide-react";
import type {
  MessDetails,
  NewMessPlan,
  PlanMenuEntry,
} from "../../../../../../types/mess";
import { FOOD, type FoodImage } from "../../foodImages";
import styles from "./classic.module.css";
import PlanTabs from "../../PlanTabs";
import PlanScroller from "../../PlanScroller";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

/** "HYGIENIC_KITCHEN" -> "Hygienic Kitchen" */
function formatTag(tag: string): string {
  return tag
    .toLowerCase()
    .split("_")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const MEAL_ORDER = ["breakfast", "lunch", "dinner"];
function mealRank(title: string): number {
  const i = MEAL_ORDER.indexOf(title.trim().toLowerCase());
  return i === -1 ? MEAL_ORDER.length : i;
}

function todayDay(): (typeof DAYS)[number] {
  return DAYS[(new Date().getDay() + 6) % 7];
}
const subscribeNever = () => () => {};

function waLink(phone: string, messName: string): string {
  const digits = phone.replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hi! I found ${messName} on MessMeals and I'd like to subscribe to your meal plan.`,
  );
  return `https://wa.me/${digits}?text=${msg}`;
}

function inr(value: string | number): string {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function joinList(xs: string[]): string {
  return xs.length <= 1
    ? xs.join("")
    : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const EASE = [0.22, 1, 0.36, 1] as const;

/** Supporting copy for the tags the API can return. */
const PROMISE_COPY: Record<string, string> = {
  MONTHLY_PLANS:
    "Subscribe once and your meals are sorted for the whole month, with no daily ordering.",
  DAILY_FRESH_MEALS:
    "Every meal is cooked the same day it reaches you. Nothing is reheated.",
  HYGIENIC_KITCHEN:
    "A clean kitchen, clean hands and clean utensils, every single day.",
  AFFORDABLE_PRICING:
    "Proper, filling meals at a price that suits everyday eating.",
  VEG_AND_NON_VEG: "Vegetarian or non-vegetarian, there is a plate for you.",
  QUALITY_INGREDIENTS: "Fresh produce and quality staples go into every dish.",
  CONSISTENT_TASTE:
    "The meal you liked last week tastes just as good this week.",
  STUDENT_FRIENDLY:
    "Filling meals, sensible prices and timings that fit around classes.",
  FAMILY_MESS: "Homely food the whole family can sit down to.",
  NO_HIDDEN_CHARGES: "The price you see is the price you pay. No surprise fees.",
  TRUSTED_MESS: "A kitchen people come back to, meal after meal.",
};
const PROMISE_FALLBACK = "One more reason regulars keep coming back.";

/* ─── Shared pieces ────────────────────────────────────────────────────────── */

type PicSrc = StaticImageData | string;

/** Hosts allowed in next.config `images.remotePatterns`. */
function canOptimize(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".amazonaws.com");
  } catch {
    return false;
  }
}

/** Fills its (positioned, sized) parent; falls back to <img> off-network. */
function Pic({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: PicSrc;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (typeof src === "string" && !canOptimize(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={styles.fillImg}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={typeof src === "string" ? "empty" : "blur"}
      className={styles.fillImg}
    />
  );
}

/** Quiet fade the first time the block scrolls into view. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Ornament() {
  return (
    <div className={styles.ornament} aria-hidden>
      <i />
      <span>✦</span>
      <i />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className={styles.head}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.h2}>{title}</h2>
      <Ornament />
      {lead && <p className={styles.lead}>{lead}</p>}
    </Reveal>
  );
}

type Stat = { label: string; value: string };

/* ─── Masthead ─────────────────────────────────────────────────────────────── */

function Masthead({ mess, hasPlan }: { mess: MessDetails; hasPlan: boolean }) {
  return (
    <header className={styles.masthead}>
      <div className={styles.mastInner}>
        <Link href="/" className={styles.mastBrand}>
          MessMeals
        </Link>
        <nav className={styles.mastNav} aria-label="Page">
          <a href="#about">About</a>
          {hasPlan && <a href="#menu">Menu</a>}
          {hasPlan && <a href="#plan">Plan</a>}
          <a href="#faq">Questions</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          href={waLink(mess.phone, mess.messName)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mastCta}
        >
          Subscribe
        </a>
      </div>
    </header>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */

function Hero({
  mess,
  lead,
  stats,
  hasPlan,
}: {
  mess: MessDetails;
  lead: string;
  stats: Stat[];
  hasPlan: boolean;
}) {
  const marks = [
    mess.status.isVerified && "Verified",
    mess.status.isFeatured && "Featured",
    mess.status.isPremium && "Premium",
  ].filter(Boolean) as string[];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {marks.length > 0 && (
            <p className={styles.marks}>{marks.join("  ·  ")}</p>
          )}
          {mess.logo && (
            <div className={styles.logo}>
              <Pic src={mess.logo} alt={`${mess.messName} logo`} sizes="72px" />
            </div>
          )}
          <h1 className={styles.h1}>{mess.messName}</h1>
          {mess.address?.location && (
            <p className={styles.heroLoc}>
              <MapPin size={15} /> {mess.address.location}
            </p>
          )}
          <p className={styles.heroLead}>{lead}</p>
          <div className={styles.heroCtas}>
            <a
              href={waLink(mess.phone, mess.messName)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Subscribe on WhatsApp
            </a>
            {hasPlan && (
              <a href="#menu" className={`${styles.btn} ${styles.btnGhost}`}>
                View the menu
              </a>
            )}
          </div>
        </motion.div>

        <motion.figure
          className={styles.plate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          <div className={styles.plateInner}>
            {mess.coverImage ? (
              <Pic
                src={mess.coverImage}
                alt={`Food from ${mess.messName}${
                  mess.address?.location ? ` in ${mess.address.location}` : ""
                }`}
                sizes="(max-width: 900px) 100vw, 1000px"
                priority
              />
            ) : (
              <div className={styles.plateFallback} />
            )}
          </div>
        </motion.figure>

        {stats.length > 0 && (
          <Reveal className={styles.stats}>
            <dl>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <dd>{s.value}</dd>
                  <dt>{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ─── About ────────────────────────────────────────────────────────────────── */

function About({
  mess,
  extraTags,
}: {
  mess: MessDetails;
  extraTags: string[];
}) {
  return (
    <section id="about" className={styles.section}>
      <div className={`${styles.container} ${styles.aboutGrid}`}>
        <div>
          <SectionHead eyebrow="Our story" title={`About ${mess.messName}`} />
          <Reveal delay={0.05}>
            <p className={styles.prose}>
              {mess.description ||
                `${mess.messName} serves fresh, homely meals every day.`}
            </p>
          </Reveal>

          {(mess.foodTypes.length > 0 || extraTags.length > 0) && (
            <Reveal delay={0.1} className={styles.tags}>
              {mess.foodTypes.map((ft) => (
                <span key={ft} className={styles.tag}>
                  <i
                    className={`${styles.dot} ${
                      ft === "VEG" ? styles.dotVeg : styles.dotNon
                    }`}
                  />
                  {ft === "VEG"
                    ? "Vegetarian"
                    : ft === "NON_VEG"
                      ? "Non-vegetarian"
                      : formatTag(ft)}
                </span>
              ))}
              {extraTags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {formatTag(tag)}
                </span>
              ))}
            </Reveal>
          )}
        </div>

        <Reveal className={styles.aboutPlate}>
          <div className={styles.plateInner}>
            <Pic
              src={FOOD.vegBowl.src}
              alt={FOOD.vegBowl.alt}
              sizes="(max-width: 900px) 100vw, 480px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Photograph band ──────────────────────────────────────────────────────── */

function Photograph({
  image,
  alt,
  caption,
}: {
  image: PicSrc;
  alt: string;
  caption: string;
}) {
  return (
    <section className={styles.photoSection}>
      <div className={styles.container}>
        <Reveal>
          <figure className={styles.photograph}>
            <div className={styles.photographFrame}>
              <Pic src={image} alt={alt} sizes="(max-width: 1200px) 100vw, 1100px" />
            </div>
            <figcaption>{caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Printed menu ─────────────────────────────────────────────────────────── */

function MenuSection({ plans }: { plans: NewMessPlan[] }) {
  const menuPlans = plans.filter((p) => p.menus[0]);
  const [planId, setPlanId] = useState<string | null>(null);
  const plan = menuPlans.find((p) => p.id === planId) ?? menuPlans[0];
  const menu = plan?.menus[0];
  // Server renders Monday; the client swaps to today's day after hydration.
  const today = useSyncExternalStore<string>(
    subscribeNever,
    todayDay,
    () => DAYS[0],
  );
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const activeDay = pickedDay ?? today;

  const variationTitle = new Map<string, string>(
    (plan?.variations ?? []).map((v) => [v.id, v.title]),
  );

  if (!menu) return null;

  const entries: PlanMenuEntry[] = [...(menu.schedule[activeDay] ?? [])].sort(
    (a, b) =>
      mealRank(variationTitle.get(a.variationId) ?? "") -
      mealRank(variationTitle.get(b.variationId) ?? ""),
  );

  return (
    <section id="menu" className={`${styles.section} ${styles.sectionPaper}`}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="The weekly menu"
          title="What is on the table"
          lead="Choose a day to see what the kitchen is preparing."
        />

      {menuPlans.length > 1 && (
          <PlanTabs plans={menuPlans} activeId={plan?.id} onSelect={setPlanId} />
        )}

        <Reveal className={styles.menuWrap}>
          <div className={styles.menuCard}>
            <div className={styles.menuInner}>
              <div className={styles.menuTabs} role="tablist" aria-label="Day">
                {DAYS.map((day) => {
                  const active = activeDay === day;
                  return (
                    <button
                      key={day}
                      role="tab"
                      aria-selected={active}
                      className={`${styles.menuTab} ${
                        active ? styles.menuTabOn : ""
                      }`}
                      onClick={() => setPickedDay(day)}
                    >
                      {DAY_SHORT[day]}
                      {active && (
                        <motion.span
                          layoutId="classicDay"
                          className={styles.menuTabLine}
                          transition={{ duration: 0.25, ease: EASE }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  className={styles.menuDay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.35 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                >
                  <h3 className={styles.dayName}>{formatTag(activeDay)}</h3>
                  <Ornament />

                  {entries.length === 0 ? (
                    <p className={styles.restDay}>
                      The kitchen rests on {formatTag(activeDay)}.
                      <span>A fresh menu returns tomorrow.</span>
                    </p>
                  ) : (
                    <ul className={styles.dishes}>
                      {entries.map((entry, i) => (
                        <li key={`${entry.variationId}-${i}`}>
                          <span className={styles.dishMeal}>
                            {variationTitle.get(entry.variationId) ?? "Meal"}
                          </span>
                          <span className={styles.leader} aria-hidden />
                          <span className={styles.dishItems}>{entry.items}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Promises (from the mess's tags) ──────────────────────────────────────── */

function Promises({
  reasons,
  messName,
}: {
  reasons: string[];
  messName: string;
}) {
  if (reasons.length === 0) return null;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="Our promise"
          title="What you can rely on"
          lead={`${
            reasons.length === 1
              ? "One commitment"
              : `${reasons.length} commitments`
          } from ${messName}, kept with every meal.`}
        />
        <div className={styles.columns}>
          {reasons.map((reason, i) => (
            <Reveal key={reason} delay={i * 0.08} className={styles.column}>
              <span className={styles.numeral}>{ROMAN[i] ?? i + 1}</span>
              <h3 className={styles.h3}>{formatTag(reason)}</h3>
              <p className={styles.colText}>
                {PROMISE_COPY[reason] ?? PROMISE_FALLBACK}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────────── */

function HowItWorks({ mess }: { mess: MessDetails }) {
  const steps = [
    {
      title: "Choose your plan",
      text: "Look through this week's menu and the plan price on this page.",
    },
    {
      title: "Message the kitchen",
      text: `Tap Subscribe to write to ${mess.messName} on WhatsApp and agree your start date.`,
    },
    {
      title: "Enjoy your meals",
      text: "Your meals are cooked fresh each day. No shopping, no cooking, no dishes.",
    },
  ];

  return (
    <section className={`${styles.section} ${styles.sectionPaper}`}>
      <div className={styles.container}>
        <SectionHead eyebrow="How it works" title="Three simple steps" />
        <div className={styles.columns}>
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08} className={styles.column}>
              <span className={styles.numeral}>{ROMAN[i]}</span>
              <h3 className={styles.h3}>{step.title}</h3>
              <p className={styles.colText}>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Subscription ─────────────────────────────────────────────────────────── */

function PlanBlock({ mess, plan }: { mess: MessDetails; plan: NewMessPlan }) {
  const showMin =
    Number(plan.minPrice) > 0 && Number(plan.minPrice) < Number(plan.price);
  const variations = [...plan.variations].sort(
    (a, b) => mealRank(a.title) - mealRank(b.title),
  );
  const ownPhoto = plan.images[0];

  return (
    <>
        <Reveal className={styles.planWrap}>
          <div className={styles.planCard}>
            <div className={styles.planInner}>
              {(plan.isDailyPlan || plan.isMonthlyPlan) && (
                <p className={styles.planKind}>
                  {[plan.isDailyPlan && "Daily", plan.isMonthlyPlan && "Monthly"]
                    .filter(Boolean)
                    .join("  ·  ")}
                </p>
              )}
              <h3 className={styles.planName}>{plan.planName}</h3>
              {plan.description && (
                <p className={styles.planDesc}>{plan.description}</p>
              )}
              <Ornament />
              <p className={styles.price}>{inr(plan.price)}</p>
              {showMin && (
                <p className={styles.priceFrom}>
                  Starting from {inr(plan.minPrice)}
                </p>
              )}

              {variations.length > 0 && (
                <ul className={styles.includes}>
                  {variations.map((v) => (
                    <li key={v.id}>{v.title} included</li>
                  ))}
                </ul>
              )}

              <div className={styles.planCtas}>
                <a
                  href={waLink(mess.phone, mess.messName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Subscribe now
                </a>
                <a
                  href={`tel:${mess.phone}`}
                  className={`${styles.btn} ${styles.btnGhost}`}
                >
                  <Phone size={15} /> Call the kitchen
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {ownPhoto && (
          <Reveal className={styles.planPhoto}>
            <div className={styles.plateInner}>
              <Pic
                src={ownPhoto.url}
                alt={ownPhoto.altText ?? `${plan.planName} at ${mess.messName}`}
                sizes="(max-width: 900px) 100vw, 760px"
              />
            </div>
          </Reveal>
        )}
    </>
  );
}

function PlanSection({ mess, plans }: { mess: MessDetails; plans: NewMessPlan[] }) {
  return (
    <section id="plan" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="The subscription"
          title="Simple, honest pricing"
          lead={plans.length > 1 ? "Pick the plan that suits you. You pay the kitchen directly." : "One plan covers your regular meals. You pay the kitchen directly."}
        />

        <PlanScroller plans={plans} mess={mess}>
          {plans.map((plan) => (
            <PlanBlock key={plan.id} mess={mess} plan={plan} />
          ))}
        </PlanScroller>
      </div>
    </section>
  );
}

/* ─── Gallery (conditional) ────────────────────────────────────────────────── */

function Gallery({ mess }: { mess: MessDetails }) {
  if (mess.gallery.length === 0) return null;
  const sorted = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className={`${styles.section} ${styles.sectionPaper}`}>
      <div className={styles.container}>
        <SectionHead eyebrow="Gallery" title="From our kitchen" />
        <div className={styles.galleryGrid}>
          {sorted.map((img, i) => (
            <Reveal
              key={img.id}
              delay={(i % 3) * 0.06}
              className={styles.galleryItem}
            >
              <div className={styles.galleryFrame}>
                <Pic
                  src={img.url}
                  alt={img.altText ?? `Food at ${mess.messName}`}
                  sizes="(max-width: 900px) 50vw, 360px"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Questions ────────────────────────────────────────────────────────────── */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section id="faq" className={styles.section}>
      <div className={`${styles.container} ${styles.narrow}`}>
        <SectionHead eyebrow="Questions" title="Good to know" />
        <Reveal>
          <ul className={styles.faqList}>
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className={styles.faqItem}>
                  <button
                    className={styles.faqQ}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className={styles.faqChevron}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.faqAWrap}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p className={styles.faqA}>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Contact ──────────────────────────────────────────────────────────────── */

function Contact({ mess }: { mess: MessDetails }) {
  const hours = Object.entries(mess.openingHours ?? {});
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mess.address.latitude != null && mess.address.longitude != null
      ? `${mess.address.latitude},${mess.address.longitude}`
      : `${mess.messName} ${mess.address.address}`,
  )}`;

  return (
    <section id="contact" className={`${styles.section} ${styles.sectionPaper}`}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="Contact"
          title="Visit or write to us"
          lead="Questions about the menu or the plan? The kitchen is glad to help."
        />

        <Reveal className={styles.contactRow}>
          <div className={styles.contactCell}>
            <h3 className={styles.cellTitle}>Address</h3>
            <p>{mess.address.address}</p>
            <p className={styles.cellMuted}>
              {mess.address.location}
              {mess.address.zipcode ? ` · ${mess.address.zipcode}` : ""}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Open in Maps <ArrowUpRight size={14} />
            </a>
          </div>

          {(mess.phone || mess.email) && (
            <div className={styles.contactCell}>
              <h3 className={styles.cellTitle}>Reach us</h3>
              {mess.phone && (
                <p>
                  <a href={`tel:${mess.phone}`} className={styles.plainLink}>
                    {mess.phone}
                  </a>
                </p>
              )}
              {mess.email && (
                <p>
                  <a href={`mailto:${mess.email}`} className={styles.plainLink}>
                    {mess.email}
                  </a>
                </p>
              )}
            </div>
          )}

          {hours.length > 0 && (
            <div className={styles.contactCell}>
              <h3 className={styles.cellTitle}>Opening hours</h3>
              <ul className={styles.hours}>
                {hours.map(([day, h]) => (
                  <li key={day}>
                    <span>{formatTag(day)}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Sticky subscribe bar (phones) ────────────────────────────────────────── */

function StickyBar({
  mess,
  plan,
  multi = false,
}: {
  mess: MessDetails;
  plan: NewMessPlan | null;
  multi?: boolean;
}) {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setShow(v > window.innerHeight * 0.8);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.stickyBar}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <div className={styles.stickyInfo}>
            <span>{mess.messName}</span>
            {plan && <strong>{multi ? "from " : ""}{inr(plan.price)}</strong>}
          </div>
          <a
            href={waLink(mess.phone, mess.messName)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mastCta}
          >
            Subscribe
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ClassicTheme({ mess }: { mess: MessDetails }) {
  // Paint the body behind the mobile bottom padding to match the footer.
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#1c3a1c";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  const plans = mess.plans;
  const plan = plans[0] ?? null;
  const cheapest = plans.reduce<NewMessPlan | null>(
    (best, p) => (!best || Number(p.price) < Number(best.price) ? p : best),
    null,
  );
  const servedDays = DAYS.filter((d) =>
    plans.some((p) => (p.menus[0]?.schedule?.[d] ?? []).length > 0),
  );
  const restDays = DAYS.filter((d) => !servedDays.includes(d));
  const meals = [
    ...new Map(
      plans.flatMap((p) => p.variations).map((v) => [v.title.toLowerCase(), v.title]),
    ).values(),
  ].sort((a, b) => mealRank(a) - mealRank(b));
  const foodWords = mess.foodTypes.map((ft) =>
    ft === "VEG"
      ? "vegetarian"
      : ft === "NON_VEG"
        ? "non-vegetarian"
        : formatTag(ft).toLowerCase(),
  );

  const lead = `Fresh${foodWords.length > 0 ? ` ${joinList(foodWords)}` : ""} meals${
    meals.length > 0
      ? `, with ${joinList(meals.map((m) => m.toLowerCase()))} on a simple subscription.`
      : " on a simple subscription."
  }`;

  const stats: Stat[] = [];
  if (plan) {
    stats.push({
      label: plans.length > 1 ? "Plans from" : "Plan price",
      value: inr((cheapest ?? plan).price),
    });
    if (meals.length > 0)
      stats.push({ label: "Meals a day", value: String(meals.length) });
    if (servedDays.length > 0)
      stats.push({ label: "Days a week", value: String(servedDays.length) });
  }
  if (mess.foodTypes.length > 0) {
    stats.push({
      label: "On the menu",
      value: mess.foodTypes
        .map((ft) =>
          ft === "VEG" ? "Veg" : ft === "NON_VEG" ? "Non-veg" : formatTag(ft),
        )
        .join(" & "),
    });
  }

  const faqs: { q: string; a: string }[] = [];
  if (foodWords.length > 0 || meals.length > 0) {
    faqs.push({
      q: `What does ${mess.messName} serve?`,
      a: [
        foodWords.length > 0 &&
          `${mess.messName} serves ${joinList(foodWords)} meals.`,
        meals.length > 0 &&
          `${plans.length > 1 ? "The plans include" : "The plan includes"} ${joinList(meals.map((m) => m.toLowerCase()))}.`,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
  if (plan) {
    const hasMin =
      Number(plan.minPrice) > 0 && Number(plan.minPrice) < Number(plan.price);
    faqs.push({
      q: "How much does the meal plan cost?",
      a: plans.length > 1 ? `We offer ${plans.length} plans: ${plans.map((p) => `${p.planName} at ${inr(p.price)}`).join("; ")}.` : `The ${plan.planName} is ${inr(plan.price)}${
        hasMin ? `, with prices starting from ${inr(plan.minPrice)}` : ""
      }.`,
    });
    if (servedDays.length > 0) {
      faqs.push({
        q: "Which days are meals served?",
        a: `Meals are served on ${joinList(servedDays.map(formatTag))}.${
          restDays.length > 0
            ? ` The kitchen rests on ${joinList(restDays.map(formatTag))}.`
            : ""
        }`,
      });
    }
  }
  if (mess.address?.address) {
    faqs.push({
      q: `Where is ${mess.messName} located?`,
      a: `${mess.address.address}${
        mess.address.location ? ` (${mess.address.location})` : ""
      }.`,
    });
  }
  if (mess.phone) {
    faqs.push({
      q: "How do I subscribe?",
      a: `Tap Subscribe to message the kitchen on WhatsApp, or call ${mess.phone}. They will confirm your plan and start date.`,
    });
  }

  // First three tags become the promises; the rest show as small labels.
  const reasons = mess.tags.slice(0, 3);
  const extraTags = mess.tags.slice(3);

  // The photograph uses the mess's own gallery image when it has one.
  const first = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const photo: { src: PicSrc; alt: string } = first
    ? { src: first.url, alt: first.altText ?? `Food at ${mess.messName}` }
    : (FOOD.spread as FoodImage);

  return (
    <MotionConfig reducedMotion="user">
      <main className={`${styles.page} ${display.variable} ${body.variable}`}>
        <Masthead mess={mess} hasPlan={!!plan} />
        <Hero mess={mess} lead={lead} stats={stats} hasPlan={!!plan} />
        <About mess={mess} extraTags={extraTags} />
        <Photograph
          image={photo.src}
          alt={photo.alt}
          caption="Cooked fresh in the kitchen, every day."
        />
        {plan && <MenuSection plans={plans} />}
        <Promises reasons={reasons} messName={mess.messName} />
        <HowItWorks mess={mess} />
        {plan && <PlanSection mess={mess} plans={plans} />}
        <Gallery mess={mess} />
        <Faq items={faqs} />
        <Contact mess={mess} />

        <footer className={styles.footer}>
          <div className={styles.container}>
            <p className={styles.footerName}>{mess.messName}</p>
            {mess.address?.location && (
              <p className={styles.footerLoc}>{mess.address.location}</p>
            )}
            <p className={styles.footerLine}>
              Listed on{" "}
              <Link href="/" className={styles.footerLink}>
                MessMeals
              </Link>
            </p>
          </div>
        </footer>

        <StickyBar mess={mess} plan={cheapest} multi={plans.length > 1} />
      </main>
    </MotionConfig>
  );
}
