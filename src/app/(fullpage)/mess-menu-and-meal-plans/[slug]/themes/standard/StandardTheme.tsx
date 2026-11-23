"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  Crown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Utensils,
} from "lucide-react";
import type {
  MessDetails,
  NewMessPlan,
  PlanMenuEntry,
} from "../../../../../../types/mess";
import { FOOD, type FoodImage } from "../../foodImages";
import MealIcon, { pickMealKind } from "../../MealIcon";
import styles from "./standard.module.css";

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

const EASE = [0.22, 1, 0.36, 1] as const;

/** Supporting copy for the tags the API can return. */
const HIGHLIGHT_COPY: Record<string, string> = {
  MONTHLY_PLANS:
    "Subscribe once and your meals are sorted for the whole month. No daily ordering.",
  DAILY_FRESH_MEALS:
    "Every meal is cooked the same day it reaches you. Nothing reheated.",
  HYGIENIC_KITCHEN:
    "A clean kitchen, clean hands and clean utensils, every single day.",
  AFFORDABLE_PRICING:
    "Proper, filling meals at a price that makes sense for everyday eating.",
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
const HIGHLIGHT_FALLBACK = "One more reason regulars keep coming back.";

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

/**
 * Fills its (positioned, sized) parent. Uses next/image (AVIF/WebP, srcset,
 * lazy loading) and falls back to <img> for hosts the optimiser can't fetch.
 */
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

/** Gentle fade-up the first time the block scrolls into view. */
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`${styles.head} ${center ? styles.headCenter : ""}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.h2}>{title}</h2>
      {lead && <p className={styles.lead}>{lead}</p>}
    </Reveal>
  );
}

/** Number that counts up the first time it scrolls into view. */
function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const label = useTransform(
    mv,
    (v) => `${prefix}${Math.round(v).toLocaleString("en-IN")}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.1, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  return <motion.span ref={ref}>{label}</motion.span>;
}

type Stat = { label: string; value?: number; prefix?: string; text?: string };

/* ─── Navigation ───────────────────────────────────────────────────────────── */

function Nav({ mess, hasPlan }: { mess: MessDetails; hasPlan: boolean }) {
  return (
    <nav className={styles.nav} aria-label="Page">
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand}>
          MessMeals
        </Link>
        <div className={styles.navLinks}>
          <a href="#about">About</a>
          {hasPlan && <a href="#menu">Menu</a>}
          {hasPlan && <a href="#plan">Plan</a>}
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>
        <a
          href={waLink(mess.phone, mess.messName)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
        >
          Subscribe
        </a>
      </div>
    </nav>
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
  const badges = [
    mess.status.isVerified && {
      label: "Verified",
      icon: <BadgeCheck size={14} />,
    },
    mess.status.isFeatured && { label: "Featured", icon: <Star size={14} /> },
    mess.status.isPremium && { label: "Premium", icon: <Crown size={14} /> },
  ].filter(Boolean) as { label: string; icon: React.ReactNode }[];

  return (
    <header className={styles.hero}>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((b) => (
                <span key={b.label} className={styles.badge}>
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          )}

          <h1 className={styles.h1}>{mess.messName}</h1>

          {mess.address?.location && (
            <p className={styles.heroLoc}>
              <MapPin size={16} /> {mess.address.location}
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
              Subscribe on WhatsApp <ArrowRight size={18} />
            </a>
            {hasPlan && (
              <a href="#menu" className={`${styles.btn} ${styles.btnGhost}`}>
                View weekly menu
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          className={styles.heroMedia}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          <div className={styles.heroFrame}>
            {mess.coverImage ? (
              <Pic
                src={mess.coverImage}
                alt={`Food from ${mess.messName}${
                  mess.address?.location ? ` in ${mess.address.location}` : ""
                }`}
                sizes="(max-width: 900px) 100vw, 600px"
                priority
              />
            ) : (
              <div className={styles.heroFallback} />
            )}
          </div>
          {mess.logo && (
            <div className={styles.heroLogoCard}>
              <div className={styles.heroLogo}>
                <Pic
                  src={mess.logo}
                  alt={`${mess.messName} logo`}
                  sizes="48px"
                />
              </div>
              <div>
                <strong>{mess.messName}</strong>
                <span>on MessMeals</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {stats.length > 0 && (
        <div className={styles.container}>
          <motion.dl
            className={styles.stats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dd>
                  {stat.value != null ? (
                    <CountUp value={stat.value} prefix={stat.prefix} />
                  ) : (
                    stat.text
                  )}
                </dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>
      )}
    </header>
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
          <SectionHead
            eyebrow="About the kitchen"
            title={`Meet ${mess.messName}`}
          />
          <Reveal delay={0.05}>
            <p className={styles.prose}>
              {mess.description ||
                `${mess.messName} serves fresh, homely meals every day.`}
            </p>
          </Reveal>

          {mess.foodTypes.length > 0 && (
            <Reveal delay={0.1} className={styles.foodTypes}>
              {mess.foodTypes.map((ft) => (
                <span key={ft} className={styles.foodType}>
                  <i
                    className={`${styles.foodDot} ${
                      ft === "VEG" ? styles.vegDot : styles.nonVegDot
                    }`}
                  />
                  {ft === "VEG"
                    ? "Vegetarian"
                    : ft === "NON_VEG"
                      ? "Non-vegetarian"
                      : formatTag(ft)}
                </span>
              ))}
            </Reveal>
          )}

          {extraTags.length > 0 && (
            <Reveal delay={0.15} className={styles.chips}>
              {extraTags.map((tag) => (
                <span key={tag} className={styles.chip}>
                  <Check size={14} /> {formatTag(tag)}
                </span>
              ))}
            </Reveal>
          )}
        </div>

        <Reveal className={styles.aboutMedia}>
          <div className={styles.aboutFrame}>
            <Pic
              src={FOOD.vegBowl.src}
              alt={FOOD.vegBowl.alt}
              sizes="(max-width: 900px) 100vw, 520px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Full-width photo band ────────────────────────────────────────────────── */

function PhotoBreak({
  image,
  alt,
  line,
  eyebrow,
}: {
  image: PicSrc;
  alt: string;
  line: string;
  eyebrow: string;
}) {
  return (
    <section className={styles.photoBreak}>
      <div className={styles.breakMedia}>
        <Pic src={image} alt={alt} sizes="100vw" />
      </div>
      <div className={styles.breakShade} />
      <div className={`${styles.container} ${styles.breakCopy}`}>
        <Reveal>
          <p className={styles.breakEyebrow}>{eyebrow}</p>
          <h2 className={styles.breakTitle}>{line}</h2>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Weekly menu ──────────────────────────────────────────────────────────── */

const subscribeNever = () => () => {};

function MenuSection({ plan }: { plan: NewMessPlan }) {
  const menu = plan.menus[0];
  // Server renders Monday; the client swaps to today's day after hydration.
  const today = useSyncExternalStore<string>(
    subscribeNever,
    todayDay,
    () => DAYS[0],
  );
  const [pickedDay, setActiveDay] = useState<string | null>(null);
  const activeDay = pickedDay ?? today;

  const variationTitle = useMemo(() => {
    const map = new Map<string, string>();
    plan.variations.forEach((v) => map.set(v.id, v.title));
    return map;
  }, [plan.variations]);

  if (!menu) return null;

  const entries: PlanMenuEntry[] = [...(menu.schedule[activeDay] ?? [])].sort(
    (a, b) =>
      mealRank(variationTitle.get(a.variationId) ?? "") -
      mealRank(variationTitle.get(b.variationId) ?? ""),
  );

  const rows = entries.map((entry) => {
    const meal = variationTitle.get(entry.variationId) ?? "Meal";
    return { entry, meal, kind: pickMealKind(entry.items, meal) };
  });

  return (
    <section id="menu" className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="Weekly menu"
          title="What's cooking this week"
          lead="Pick a day to see what's on the plate."
        />

        <Reveal className={styles.tabs}>
          <div role="tablist" aria-label="Day" className={styles.tabList}>
            {DAYS.map((day) => {
              const active = activeDay === day;
              return (
                <button
                  key={day}
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                  onClick={() => setActiveDay(day)}
                >
                  {active && (
                    <motion.span
                      layoutId="dayPill"
                      className={styles.tabPill}
                      transition={{ duration: 0.25, ease: EASE }}
                    />
                  )}
                  <span className={styles.tabLabel}>{DAY_SHORT[day]}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className={styles.menuGrid}>
          <div className={styles.dayStage}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                className={styles.dayCard}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, ease: EASE },
                }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                <h3 className={styles.dayTitle}>{formatTag(activeDay)}</h3>

                {entries.length === 0 ? (
                  <div className={styles.restDay}>
                    <p className={styles.restTitle}>Kitchen rest day</p>
                    <p className={styles.restNote}>
                      No service on {formatTag(activeDay)}. A fresh menu is
                      back tomorrow.
                    </p>
                  </div>
                ) : (
                  <ul className={styles.mealRows}>
                    {rows.map(({ entry, meal, kind }, i) => (
                      <li key={`${entry.variationId}-${i}`} className={styles.mealRow}>
                        <div className={styles.mealTile}>
                          <MealIcon kind={kind} />
                        </div>
                        <div className={styles.mealText}>
                          <span className={styles.mealLabel}>{meal}</span>
                          <span className={styles.mealItems}>{entry.items}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <Reveal className={styles.glance}>
            <p className={styles.glanceTitle}>The week at a glance</p>
            <ul className={styles.glanceList}>
              {DAYS.map((day) => {
                const dayEntries = menu.schedule[day] ?? [];
                const active = activeDay === day;
                return (
                  <li key={day}>
                    <button
                      className={`${styles.glanceRow} ${
                        active ? styles.glanceRowActive : ""
                      }`}
                      onClick={() => setActiveDay(day)}
                    >
                      <span className={styles.glanceDay}>{DAY_SHORT[day]}</span>
                      <span className={styles.glanceItems}>
                        {dayEntries.length === 0
                          ? "Kitchen rest day"
                          : dayEntries.map((e) => e.items).join(" · ")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────────── */

function HowItWorks({ mess }: { mess: MessDetails }) {
  const steps = [
    {
      icon: <ClipboardList size={24} />,
      title: "Choose your plan",
      text: "Check this week's menu and the plan price right here on this page.",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Message the kitchen",
      text: `Tap Subscribe to chat with ${mess.messName} on WhatsApp and agree your start date.`,
    },
    {
      icon: <Utensils size={24} />,
      title: "Enjoy your meals",
      text: "Your meals are cooked fresh. No shopping, no cooking and no dishes.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          center
          eyebrow="How it works"
          title="Getting started takes three steps"
        />
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08} className={styles.step}>
              <span className={styles.stepIcon}>{step.icon}</span>
              <span className={styles.stepNum}>Step {i + 1}</span>
              <h3 className={styles.h3}>{step.title}</h3>
              <p className={styles.cardText}>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why choose us ────────────────────────────────────────────────────────── */

function Reasons({
  reasons,
  messName,
}: {
  reasons: string[];
  messName: string;
}) {
  if (reasons.length === 0) return null;
  const photos = [FOOD.vegBowl, FOOD.salad, FOOD.grilled];

  return (
    <section className={`${styles.section} ${styles.sectionTint}`}>
      <div className={styles.container}>
        <SectionHead
          center
          eyebrow="Why choose us"
          title="What you can count on"
          lead={`${
            reasons.length === 1
              ? "One simple promise"
              : `${reasons.length} simple promises`
          } from ${messName}, served with every meal.`}
        />
        <div className={styles.cardGrid}>
          {reasons.map((reason, i) => {
            const photo = photos[i % photos.length];
            return (
              <Reveal key={reason} delay={i * 0.08} className={styles.card}>
                <div className={styles.cardMedia}>
                  <Pic
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 900px) 100vw, 360px"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.h3}>{formatTag(reason)}</h3>
                  <p className={styles.cardText}>
                    {HIGHLIGHT_COPY[reason] ?? HIGHLIGHT_FALLBACK}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Plan ─────────────────────────────────────────────────────────────────── */

function PlanSection({ mess, plan }: { mess: MessDetails; plan: NewMessPlan }) {
  const showMin =
    Number(plan.minPrice) > 0 && Number(plan.minPrice) < Number(plan.price);

  const variations = [...plan.variations].sort(
    (a, b) => mealRank(a.title) - mealRank(b.title),
  );
  const href = waLink(mess.phone, mess.messName);
  const ownPhoto = plan.images[0];
  const planPhoto: { src: PicSrc; alt: string } = ownPhoto
    ? {
        src: ownPhoto.url,
        alt: ownPhoto.altText ?? `${plan.planName} at ${mess.messName}`,
      }
    : FOOD.proteinBowl;

  return (
    <section id="plan" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="Subscription plan"
          title="Simple, clear pricing"
          lead="One plan covers your regular meals. You pay the kitchen directly."
        />

        <div className={styles.planGrid}>
          <Reveal className={styles.planCard}>
            <div className={styles.priceBadges}>
              {plan.isDailyPlan && <span>Daily plan</span>}
              {plan.isMonthlyPlan && <span>Monthly plan</span>}
            </div>
            <h3 className={styles.priceName}>{plan.planName}</h3>
            {plan.description && (
              <p className={styles.cardText}>{plan.description}</p>
            )}

            <p className={styles.price}>{inr(plan.price)}</p>
            {showMin && (
              <p className={styles.priceFrom}>
                Starting from <strong>{inr(plan.minPrice)}</strong>
              </p>
            )}

            {variations.length > 0 && (
              <ul className={styles.includes}>
                {variations.map((v) => (
                  <li key={v.id}>
                    <Check size={18} />
                    {v.title} included
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.ctaRow}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Subscribe now <ArrowRight size={18} />
              </a>
              <a
                href={`tel:${mess.phone}`}
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                <Phone size={16} /> Call the kitchen
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className={styles.planPhoto}>
            <Pic
              src={planPhoto.src}
              alt={planPhoto.alt}
              sizes="(max-width: 900px) 100vw, 520px"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery (conditional) ────────────────────────────────────────────────── */

function Gallery({ mess }: { mess: MessDetails }) {
  if (mess.gallery.length === 0) return null;
  const sorted = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={styles.container}>
        <SectionHead center eyebrow="Gallery" title="A look at the food" />
        <div className={styles.galleryGrid}>
          {sorted.map((img, i) => (
            <Reveal
              key={img.id}
              delay={(i % 3) * 0.06}
              className={styles.galleryItem}
            >
              <Pic
                src={img.url}
                alt={img.altText ?? `Food at ${mess.messName}`}
                sizes="(max-width: 900px) 50vw, 380px"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section id="faq" className={`${styles.section} ${styles.sectionSoft}`}>
      <div className={`${styles.container} ${styles.narrow}`}>
        <SectionHead center eyebrow="FAQ" title="Frequently asked questions" />
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
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.faqAWrap}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
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

function ContactSection({ mess }: { mess: MessDetails }) {
  const hours = Object.entries(mess.openingHours ?? {});
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mess.address.latitude != null && mess.address.longitude != null
      ? `${mess.address.latitude},${mess.address.longitude}`
      : `${mess.messName} ${mess.address.address}`,
  )}`;

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          center
          eyebrow="Contact"
          title="Visit or get in touch"
          lead="Questions about the menu or the plan? The kitchen is happy to help."
        />

        <div className={styles.contactGrid}>
          <Reveal className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <MapPin size={20} />
            </span>
            <h3 className={styles.h3}>Address</h3>
            <p className={styles.cardText}>{mess.address.address}</p>
            <p className={styles.cardMuted}>
              {mess.address.location}
              {mess.address.zipcode ? ` · ${mess.address.zipcode}` : ""}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Open in Maps <ArrowRight size={15} />
            </a>
          </Reveal>

          {mess.phone && (
            <Reveal delay={0.06} className={styles.contactCard}>
              <span className={styles.cardIcon}>
                <Phone size={20} />
              </span>
              <h3 className={styles.h3}>Phone</h3>
              <p className={styles.cardText}>Call or message on WhatsApp.</p>
              <a href={`tel:${mess.phone}`} className={styles.textLink}>
                {mess.phone}
              </a>
            </Reveal>
          )}

          {mess.email && (
            <Reveal delay={0.12} className={styles.contactCard}>
              <span className={styles.cardIcon}>
                <Mail size={20} />
              </span>
              <h3 className={styles.h3}>Email</h3>
              <p className={styles.cardText}>Write to the kitchen any time.</p>
              <a href={`mailto:${mess.email}`} className={styles.textLink}>
                {mess.email}
              </a>
            </Reveal>
          )}

          {hours.length > 0 && (
            <Reveal delay={0.18} className={styles.contactCard}>
              <span className={styles.cardIcon}>
                <Clock size={20} />
              </span>
              <h3 className={styles.h3}>Opening hours</h3>
              <ul className={styles.hours}>
                {hours.map(([day, h]) => (
                  <li key={day}>
                    <span>{formatTag(day)}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Sticky subscribe bar (phones) ────────────────────────────────────────── */

function StickyBar({
  mess,
  plan,
}: {
  mess: MessDetails;
  plan: NewMessPlan | null;
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
            {plan && <strong>{inr(plan.price)}</strong>}
          </div>
          <a
            href={waLink(mess.phone, mess.messName)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
          >
            Subscribe
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function StandardTheme({ mess }: { mess: MessDetails }) {
  // Paint the body behind the mobile bottom padding to match the footer.
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#101c10";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  const plan = mess.plans[0] ?? null;
  const schedule = plan?.menus[0]?.schedule ?? {};
  const servedDays = DAYS.filter((d) => (schedule[d] ?? []).length > 0);
  const restDays = DAYS.filter((d) => (schedule[d] ?? []).length === 0);
  const meals = plan
    ? [...plan.variations]
        .sort((a, b) => mealRank(a.title) - mealRank(b.title))
        .map((v) => v.title)
    : [];
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
    stats.push({ label: "Plan price", value: Number(plan.price), prefix: "₹" });
    if (meals.length > 0)
      stats.push({ label: "Meals a day", value: meals.length });
    if (servedDays.length > 0)
      stats.push({ label: "Days a week", value: servedDays.length });
  }
  if (mess.foodTypes.length > 0) {
    stats.push({
      label: "On the menu",
      text: mess.foodTypes
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
          `The plan includes ${joinList(meals.map((m) => m.toLowerCase()))}.`,
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
      a: `The ${plan.planName} is ${inr(plan.price)}${
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

  // First three tags become the highlight cards; the rest show as chips.
  const reasons = mess.tags.slice(0, 3);
  const extraTags = mess.tags.slice(3);

  // Photo bands use the mess's own gallery when it has one.
  const gallery = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder);
  const scene = (
    i: number,
    fallback: FoodImage,
  ): { src: PicSrc; alt: string } =>
    gallery[i]
      ? {
          src: gallery[i].url,
          alt: gallery[i].altText ?? `Food at ${mess.messName}`,
        }
      : fallback;
  const sceneA = scene(0, FOOD.spread);
  const sceneB = scene(1, FOOD.healthyPlate);

  return (
    <MotionConfig reducedMotion="user">
      <main className={`${styles.page} ${body.variable}`}>
        <Nav mess={mess} hasPlan={!!plan} />
        <Hero mess={mess} lead={lead} stats={stats} hasPlan={!!plan} />
        <About mess={mess} extraTags={extraTags} />
        <PhotoBreak
          image={sceneA.src}
          alt={sceneA.alt}
          eyebrow="From the kitchen"
          line="Made fresh, every single day."
        />
        {plan && <MenuSection plan={plan} />}
        <HowItWorks mess={mess} />
        <Reasons reasons={reasons} messName={mess.messName} />
        {plan && <PlanSection mess={mess} plan={plan} />}
        <PhotoBreak
          image={sceneB.src}
          alt={sceneB.alt}
          eyebrow="Meals without the effort"
          line="Good food, zero effort."
        />
        <Gallery mess={mess} />
        <Faq items={faqs} />
        <ContactSection mess={mess} />

        <footer className={styles.footer}>
          <div className={`${styles.container} ${styles.footerInner}`}>
            <p>
              <strong>{mess.messName}</strong>
              {mess.address?.location ? ` · ${mess.address.location}` : ""}
            </p>
            <p>
              Listed on{" "}
              <Link href="/" className={styles.footerLink}>
                MessMeals
              </Link>
            </p>
          </div>
        </footer>

        <StickyBar mess={mess} plan={plan} />
      </main>
    </MotionConfig>
  );
}
