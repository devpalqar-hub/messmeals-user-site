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
import { Be_Vietnam_Pro, Caveat, Fredoka } from "next/font/google";
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
import { ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import type {
  MessDetails,
  NewMessPlan,
  PlanMenuEntry,
} from "../../../../../../types/mess";
import { FOOD } from "../../foodImages";
import MealIcon, { pickMealKind } from "../../MealIcon";
import styles from "./warm.module.css";

const heading = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
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

/* ─── Hand-drawn doodles ───────────────────────────────────────────────────── */

type DoodleProps = { className?: string };

function Squiggle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 12" className={className} aria-hidden preserveAspectRatio="none">
      <path
        d="M2 6 Q12 0 22 6 T42 6 T62 6 T82 6 T102 6 T118 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 1C12.8 7 17 11.2 23 12 17 12.8 12.8 17 12 23 11.2 17 7 12.8 1 12 7 11.2 11.2 7 12 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Heart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.4 4.5 7 4.5c2 0 3.7 1.1 5 2.9 1.3-1.8 3-2.9 5-2.9 3.6 0 6 3.5 4.5 7.3C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

function Leaf({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 20C4 10 10 4 21 3c0 10-6 16-17 17z" fill="currentColor" />
      <path
        d="M4 20 14 10"
        stroke="var(--cream)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Check({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3 12.5 9 18 21 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurlyArrow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <path
        d="M3 8C20 2 34 18 52 12M44 4l9 8-9 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wave() {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={styles.wave}
      aria-hidden
    >
      <path
        d="M0 32C180 62 360 4 540 28S900 60 1080 30 1320 6 1440 30V60H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

/** Soft rise the first time the block scrolls into view. */
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
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type Tone = "cream" | "mint" | "butter" | "peach" | "forest";

/** A page section with a pastel background and a wavy top edge. */
function Sec({
  id,
  tone,
  wave = true,
  children,
}: {
  id?: string;
  tone: Tone;
  wave?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.sec} data-tone={tone}>
      {wave && <Wave />}
      <div className={styles.container}>{children}</div>
    </section>
  );
}

function SectionHead({
  note,
  title,
  lead,
}: {
  note: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className={styles.head}>
      <p className={styles.note}>{note}</p>
      <h2 className={styles.h2}>{title}</h2>
      <Squiggle className={styles.squiggle} />
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
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  return <motion.span ref={ref}>{label}</motion.span>;
}

type Stat = { label: string; value?: number; prefix?: string; text?: string };

/* ─── Navigation ───────────────────────────────────────────────────────────── */

function Nav({ mess, hasPlan }: { mess: MessDetails; hasPlan: boolean }) {
  return (
    <div className={styles.navWrap}>
      <nav className={styles.nav} aria-label="Page">
        <Link href="/" className={styles.brand}>
          <Heart className={styles.brandHeart} />
          MessMeals
        </Link>
        <div className={styles.navLinks}>
          <a href="#about">About</a>
          {hasPlan && <a href="#menu">Menu</a>}
          {hasPlan && <a href="#plan">Plan</a>}
          <a href="#faq">Questions</a>
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
      </nav>
    </div>
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
    <header className={styles.hero} data-tone="cream">
      <Sparkle className={`${styles.floater} ${styles.fl1}`} />
      <Leaf className={`${styles.floater} ${styles.fl2}`} />
      <Heart className={`${styles.floater} ${styles.fl3}`} />

      <div className={`${styles.container} ${styles.heroGrid}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {marks.length > 0 && (
            <div className={styles.marks}>
              {marks.map((m, i) => (
                <span key={m} className={styles.mark} data-i={i}>
                  {m}
                </span>
              ))}
            </div>
          )}

          <h1 className={styles.h1}>{mess.messName}</h1>
          <Squiggle className={styles.heroSquiggle} />

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
              Subscribe on WhatsApp
            </a>
            {hasPlan && (
              <a href="#menu" className={`${styles.btn} ${styles.btnSoft}`}>
                See the menu
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          className={styles.heroMedia}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
        >
          <div className={styles.photoFrame}>
            {mess.coverImage ? (
              <Pic
                src={mess.coverImage}
                alt={`Food from ${mess.messName}${
                  mess.address?.location ? ` in ${mess.address.location}` : ""
                }`}
                sizes="(max-width: 900px) 100vw, 560px"
                priority
              />
            ) : (
              <div className={styles.photoFallback} />
            )}
          </div>
          {mess.logo && (
            <div className={styles.logoBadge}>
              <Pic src={mess.logo} alt={`${mess.messName} logo`} sizes="84px" />
            </div>
          )}
          <p className={styles.heroNote}>
            cooked fresh,
            <br />
            every day
          </p>
          <CurlyArrow className={styles.heroArrow} />
        </motion.div>
      </div>

      {stats.length > 0 && (
        <div className={styles.container}>
          <motion.dl
            className={styles.stats}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className={styles.stat} data-i={i % 4}>
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
    <Sec id="about" tone="mint">
      <div className={styles.aboutGrid}>
        <Reveal className={styles.aboutPhoto}>
          <div className={styles.roundPhoto}>
            <Pic
              src={FOOD.vegBowl.src}
              alt={FOOD.vegBowl.alt}
              sizes="(max-width: 900px) 100vw, 460px"
            />
          </div>
          <Sparkle className={`${styles.floater} ${styles.flAbout}`} />
        </Reveal>

        <div>
          <SectionHead note="a little about us" title={`Say hello to ${mess.messName}`} />
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
      </div>
    </Sec>
  );
}

/* ─── Photo band ───────────────────────────────────────────────────────────── */

function PhotoBand({
  image,
  alt,
  caption,
}: {
  image: PicSrc;
  alt: string;
  caption: string;
}) {
  return (
    <section className={styles.bandSection} data-tone="cream">
      <div className={styles.container}>
        <Reveal>
          <div className={styles.band}>
            <Pic src={image} alt={alt} sizes="(max-width: 1200px) 100vw, 1100px" />
            <p className={styles.bandSticker}>
              <Heart className={styles.bandHeart} /> {caption}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Weekly menu (chalkboard) ─────────────────────────────────────────────── */

function MenuSection({ plan }: { plan: NewMessPlan }) {
  const menu = plan.menus[0];
  // Server renders Monday; the client swaps to today's day after hydration.
  const today = useSyncExternalStore<string>(
    subscribeNever,
    todayDay,
    () => DAYS[0],
  );
  const [pickedDay, setPickedDay] = useState<string | null>(null);
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
    <Sec id="menu" tone="butter">
      <SectionHead
        note="what's cooking?"
        title="This week's menu"
        lead="Pick a day to see what the kitchen is making."
      />

      <Reveal className={styles.dayChips}>
        <div role="tablist" aria-label="Day" className={styles.chipRow}>
          {DAYS.map((day) => {
            const active = activeDay === day;
            return (
              <button
                key={day}
                role="tab"
                aria-selected={active}
                className={`${styles.chip} ${active ? styles.chipOn : ""}`}
                onClick={() => setPickedDay(day)}
              >
                {active && (
                  <motion.span
                    layoutId="warmDay"
                    className={styles.chipFill}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}
                <span className={styles.chipLabel}>{DAY_SHORT[day]}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal className={styles.boardWrap}>
        <div className={styles.board}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              className={styles.boardInner}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <h3 className={styles.boardDay}>{formatTag(activeDay)}</h3>

              {entries.length === 0 ? (
                <p className={styles.boardRest}>
                  The kitchen is taking a break today.
                  <span>Back tomorrow with something tasty!</span>
                </p>
              ) : (
                <ul className={styles.boardRows}>
                  {rows.map(({ entry, meal, kind }, i) => (
                    <li key={`${entry.variationId}-${i}`} className={styles.boardRow}>
                      <div className={styles.boardIcon}>
                        <MealIcon kind={kind} animated />
                      </div>
                      <div className={styles.boardText}>
                        <span className={styles.boardMeal}>{meal}</span>
                        <span className={styles.boardItems}>{entry.items}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Sec>
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
  const photos = [FOOD.vegBowl, FOOD.salad, FOOD.grilled];
  const icons = [Heart, Leaf, Sparkle];

  return (
    <Sec tone="cream">
      <SectionHead
        note="you can count on us"
        title="Made with care"
        lead={`${
          reasons.length === 1
            ? "One little promise"
            : `${reasons.length} little promises`
        } from ${messName}, kept with every meal.`}
      />
      <div className={styles.cardGrid}>
        {reasons.map((reason, i) => {
          const Icon = icons[i % icons.length];
          const photo = photos[i % photos.length];
          return (
            <Reveal key={reason} delay={i * 0.08} className={styles.card} >
              <div className={styles.cardInner} data-i={i % 3}>
                <div className={styles.cardPhoto}>
                  <Pic src={photo.src} alt={photo.alt} sizes="(max-width: 900px) 100vw, 360px" />
                </div>
                <span className={styles.cardIcon}>
                  <Icon className={styles.cardIconSvg} />
                </span>
                <h3 className={styles.h3}>{formatTag(reason)}</h3>
                <p className={styles.cardText}>
                  {PROMISE_COPY[reason] ?? PROMISE_FALLBACK}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Sec>
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
    <Sec tone="peach">
      <SectionHead note="how it works" title="Three easy steps" />
      <div className={styles.steps}>
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1} className={styles.step}>
            <span className={styles.stepNum}>{i + 1}</span>
            <h3 className={styles.h3}>{step.title}</h3>
            <p className={styles.cardText}>{step.text}</p>
          </Reveal>
        ))}
      </div>
    </Sec>
  );
}

/* ─── Subscription ─────────────────────────────────────────────────────────── */

function PlanSection({ mess, plan }: { mess: MessDetails; plan: NewMessPlan }) {
  const showMin =
    Number(plan.minPrice) > 0 && Number(plan.minPrice) < Number(plan.price);
  const variations = [...plan.variations].sort(
    (a, b) => mealRank(a.title) - mealRank(b.title),
  );
  const ownPhoto = plan.images[0];
  const planPhoto: { src: PicSrc; alt: string } = ownPhoto
    ? {
        src: ownPhoto.url,
        alt: ownPhoto.altText ?? `${plan.planName} at ${mess.messName}`,
      }
    : FOOD.proteinBowl;

  return (
    <Sec id="plan" tone="mint">
      <SectionHead
        note="ready when you are"
        title="Simple, friendly pricing"
        lead="One plan covers your regular meals. You pay the kitchen directly."
      />

      <div className={styles.planGrid}>
        <Reveal className={styles.planCard}>
          <span className={styles.priceSticker} aria-hidden>
            <small>just</small>
            {inr(plan.price)}
          </span>

          {(plan.isDailyPlan || plan.isMonthlyPlan) && (
            <div className={styles.planKinds}>
              {plan.isDailyPlan && <span>Daily plan</span>}
              {plan.isMonthlyPlan && <span>Monthly plan</span>}
            </div>
          )}
          <h3 className={styles.planName}>{plan.planName}</h3>
          {plan.description && <p className={styles.cardText}>{plan.description}</p>}

          <p className={styles.price}>{inr(plan.price)}</p>
          {showMin && (
            <p className={styles.priceFrom}>starting from {inr(plan.minPrice)}</p>
          )}

          {variations.length > 0 && (
            <ul className={styles.includes}>
              {variations.map((v) => (
                <li key={v.id}>
                  <Check className={styles.checkMark} />
                  {v.title} included
                </li>
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
              className={`${styles.btn} ${styles.btnSoft}`}
            >
              <Phone size={16} /> Call the kitchen
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className={styles.planPhotoWrap}>
          <div className={styles.planPhoto}>
            <Pic
              src={planPhoto.src}
              alt={planPhoto.alt}
              sizes="(max-width: 900px) 100vw, 480px"
            />
          </div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* ─── Gallery (conditional) ────────────────────────────────────────────────── */

function Gallery({ mess }: { mess: MessDetails }) {
  if (mess.gallery.length === 0) return null;
  const sorted = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Sec tone="cream">
      <SectionHead note="a peek inside" title="From our kitchen" />
      <div className={styles.galleryGrid}>
        {sorted.map((img, i) => (
          <Reveal
            key={img.id}
            delay={(i % 3) * 0.06}
            className={styles.galleryItem}
          >
            <div
              className={styles.galleryFrame}
              style={{ rotate: `${i % 2 === 0 ? -1.4 : 1.2}deg` }}
            >
              <div className={styles.galleryImg}>
                <Pic
                  src={img.url}
                  alt={img.altText ?? `Food at ${mess.messName}`}
                  sizes="(max-width: 900px) 50vw, 360px"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Sec>
  );
}

/* ─── Questions ────────────────────────────────────────────────────────────── */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <Sec id="faq" tone="butter">
      <div className={styles.narrow}>
        <SectionHead note="got a question?" title="Good to know" />
        <ul className={styles.faqList}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <li className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}>
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
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Sec>
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
    <Sec id="contact" tone="mint">
      <SectionHead
        note="come say hi"
        title="Find the kitchen"
        lead="Questions about the menu or the plan? We're happy to help."
      />

      <div className={styles.contactGrid}>
        <Reveal className={styles.contactCard} >
          <span className={styles.cardIcon}>
            <MapPin size={22} />
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
            Open in Maps <ArrowUpRight size={15} />
          </a>
        </Reveal>

        {mess.phone && (
          <Reveal delay={0.07} className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <Phone size={22} />
            </span>
            <h3 className={styles.h3}>Phone</h3>
            <p className={styles.cardText}>Call or message on WhatsApp.</p>
            <a href={`tel:${mess.phone}`} className={styles.textLink}>
              {mess.phone}
            </a>
          </Reveal>
        )}

        {mess.email && (
          <Reveal delay={0.14} className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <Mail size={22} />
            </span>
            <h3 className={styles.h3}>Email</h3>
            <p className={styles.cardText}>Write to us any time.</p>
            <a href={`mailto:${mess.email}`} className={styles.textLink}>
              {mess.email}
            </a>
          </Reveal>
        )}

        {hours.length > 0 && (
          <Reveal delay={0.21} className={styles.contactCard}>
            <span className={styles.cardIcon}>
              <Clock size={22} />
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
    </Sec>
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
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
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

export default function WarmTheme({ mess }: { mess: MessDetails }) {
  // Paint the body behind the mobile bottom padding to match the footer.
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#1c3a1c";
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
    stats.push({ label: "plan price", value: Number(plan.price), prefix: "₹" });
    if (meals.length > 0)
      stats.push({ label: "meals a day", value: meals.length });
    if (servedDays.length > 0)
      stats.push({ label: "days a week", value: servedDays.length });
  }
  if (mess.foodTypes.length > 0) {
    stats.push({
      label: "on the menu",
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

  // First three tags become the promise cards; the rest show as small labels.
  const reasons = mess.tags.slice(0, 3);
  const extraTags = mess.tags.slice(3);

  // The photo band uses the mess's own gallery image when it has one.
  const first = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const photo: { src: PicSrc; alt: string } = first
    ? { src: first.url, alt: first.altText ?? `Food at ${mess.messName}` }
    : FOOD.spread;

  return (
    <MotionConfig reducedMotion="user">
      <main
        className={`${styles.page} ${heading.variable} ${hand.variable} ${body.variable}`}
      >
        <Nav mess={mess} hasPlan={!!plan} />
        <Hero mess={mess} lead={lead} stats={stats} hasPlan={!!plan} />
        <About mess={mess} extraTags={extraTags} />
        <PhotoBand
          image={photo.src}
          alt={photo.alt}
          caption="Cooked fresh in our kitchen"
        />
        {plan && <MenuSection plan={plan} />}
        <Promises reasons={reasons} messName={mess.messName} />
        <HowItWorks mess={mess} />
        {plan && <PlanSection mess={mess} plan={plan} />}
        <Gallery mess={mess} />
        <Faq items={faqs} />
        <Contact mess={mess} />

        <footer className={styles.footer} data-tone="forest">
          <Wave />
          <div className={styles.container}>
            <p className={styles.footerNote}>thanks for dropping by</p>
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

        <StickyBar mess={mess} plan={plan} />
      </main>
    </MotionConfig>
  );
}
