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
import {
  Barlow_Condensed,
  Be_Vietnam_Pro,
  Nothing_You_Could_Do,
} from "next/font/google";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  Clock,
  MessageCircle,
  Utensils,
  Crown,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import type {
  MessDetails,
  NewMessPlan,
  PlanMenuEntry,
} from "../../../../../../types/mess";
import { FOOD, type FoodImage } from "../../foodImages";
import MealIcon, { pickMealKind } from "../../MealIcon";
import styles from "./modern.module.css";

const heading = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const note = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-note",
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

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Images ───────────────────────────────────────────────────────────────── */

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
 * Fills its (positioned, sized) parent. Goes through next/image — AVIF/WebP,
 * responsive srcset, lazy loading — and falls back to a plain <img> for
 * remote hosts the optimiser isn't configured for.
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

/* ─── Shared pieces ────────────────────────────────────────────────────────── */

/** Headline whose words rise out of a clipped line, one after another. */
function RiseText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  immediate = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  immediate?: boolean;
}) {
  // Observe the heading itself: the words start clipped out of view, so an
  // observer on them would never fire.
  const Comp = Tag as "h2";
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const show = immediate || inView;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Comp ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className={styles.wordClip} aria-hidden>
          <motion.span
            className={styles.word}
            initial={{ y: "115%" }}
            animate={{ y: show ? "0%" : "115%" }}
            transition={{
              duration: 0.75,
              ease: EASE,
              delay: show ? delay + i * 0.07 : 0,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Comp>
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
    const controls = animate(mv, value, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  return <motion.span ref={ref}>{label}</motion.span>;
}

/** Giant outlined text that slides sideways as the page scrolls. */
function ScrollBand({
  text,
  reverse = false,
}: {
  text: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["-32%", "0%"] : ["0%", "-32%"],
  );
  return (
    <div ref={ref} className={styles.scrollBand} aria-hidden>
      <motion.div className={styles.scrollBandTrack} style={{ x }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{text} ✦</span>
        ))}
      </motion.div>
    </div>
  );
}

type Stat = { label: string; value?: number; prefix?: string; text?: string };

function Stickers({ status }: { status: MessDetails["status"] }) {
  const list = [
    status.isFeatured && { label: "Featured", icon: <Star size={13} /> },
    status.isVerified && { label: "Verified", icon: <BadgeCheck size={13} /> },
    status.isPremium && { label: "Premium", icon: <Crown size={13} /> },
  ].filter(Boolean) as { label: string; icon: React.ReactNode }[];

  if (list.length === 0) return null;
  return (
    <div className={styles.stickers}>
      {list.map((s, i) => (
        <motion.span
          key={s.label}
          className={styles.sticker}
          initial={{ scale: 0, rotate: -20 }}
          animate={{
            scale: 1,
            rotate: i % 2 === 0 ? -6 : 5,
            transition: {
              type: "spring",
              stiffness: 320,
              damping: 14,
              delay: 1.7 + i * 0.12,
            },
          }}
        >
          {s.icon}
          {s.label}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Intro sheet + masthead ───────────────────────────────────────────────── */

function Preloader({ mess }: { mess: MessDetails }) {
  // Pure CSS: holds briefly, then lifts away. Hidden under reduced motion.
  return (
    <div className={styles.preloader} aria-hidden>
      <p className={styles.preloaderNote}>now serving</p>
      <p className={styles.preloaderName}>{mess.messName}</p>
    </div>
  );
}

function Masthead({ mess }: { mess: MessDetails }) {
  return (
    <div className={styles.masthead}>
      <Link href="/" className={styles.mastBrand}>
        MessMeals
      </Link>
      <a
        href={waLink(mess.phone, mess.messName)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mastCta}
      >
        Subscribe <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */

function Hero({ mess, stats }: { mess: MessDetails; stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoRotate = useTransform(scrollYProgress, [0, 1], [-5, 4]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <header ref={ref} className={styles.hero}>
      <motion.div style={reduceMotion ? undefined : { y: titleY }}>
        <RiseText
          as="h1"
          text={mess.messName}
          className={styles.heroTitle}
          delay={1.15}
          immediate
        />
      </motion.div>

      <div className={styles.heroRow}>
        <motion.figure
          className={styles.photoCard}
          style={reduceMotion ? undefined : { rotate: photoRotate, y: photoY }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.9, ease: EASE, delay: 1.45 },
          }}
        >
          <i className={`${styles.tape} ${styles.tapeTopLeft}`} />
          <i className={`${styles.tape} ${styles.tapeBottomRight}`} />
          {mess.coverImage ? (
            <div className={styles.photoFrame}>
              <Pic
                src={mess.coverImage}
                alt={`Food from ${mess.messName}${
                  mess.address?.location ? ` in ${mess.address.location}` : ""
                }`}
                sizes="(max-width: 820px) 92vw, 660px"
                priority
              />
            </div>
          ) : (
            <div className={styles.photoFallback} />
          )}
          {mess.logo && (
            <div className={styles.photoLogo}>
              <Pic
                src={mess.logo}
                alt={`${mess.messName} logo`}
                sizes="100px"
              />
            </div>
          )}
        </motion.figure>

        <div className={styles.heroSide}>
          <Stickers status={mess.status} />
          <p className={styles.heroNote}>
            fresh, homely meals
            <br />
            cooked every day!
          </p>
          {mess.address?.location && (
            <p className={styles.heroLoc}>
              <MapPin size={15} /> {mess.address.location}
            </p>
          )}
          <a href="#menu" className={styles.btnDark}>
            See this week&rsquo;s menu <ArrowDown size={17} />
          </a>
        </div>
      </div>

      {stats.length > 0 && (
        <motion.dl
          className={styles.stats}
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: EASE, delay: 1.9 },
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dd className={styles.statValue}>
                {stat.value != null ? (
                  <CountUp value={stat.value} prefix={stat.prefix} />
                ) : (
                  stat.text
                )}
              </dd>
              <dt className={styles.statLabel}>{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      )}
    </header>
  );
}

/* ─── Tag strip + statement + marquee ──────────────────────────────────────── */

function Statement({
  mess,
  extraTags,
}: {
  mess: MessDetails;
  extraTags: string[];
}) {
  return (
    <section className={`${styles.sheet} ${styles.forest}`}>
      <div className={styles.inner}>
        {extraTags.length > 0 && (
          <motion.p
            className={styles.tagLine}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {extraTags.map(formatTag).join(", ")}.
          </motion.p>
        )}

        <div className={styles.statementGrid}>
          <div>
            <p className={styles.noteLabel}>who&rsquo;s cooking?</p>
            {mess.description ? (
              <motion.p
                className={styles.statement}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {mess.description}
              </motion.p>
            ) : (
              <p className={styles.statement}>
                {mess.messName} serves fresh, homely meals every day.
              </p>
            )}
          </div>

          <div className={styles.statementSide}>
          {mess.foodTypes.length > 0 && (
            <motion.aside
              className={styles.stickyNote}
              initial={{ opacity: 0, rotate: 12, y: 40 }}
              whileInView={{ opacity: 1, rotate: 4, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
            >
              <i className={`${styles.tape} ${styles.tapeTopCenter}`} />
              <p className={styles.stickyNoteTitle}>on the menu</p>
              <ul>
                {mess.foodTypes.map((ft) => (
                  <li key={ft}>
                    <i
                      className={`${styles.foodDot} ${
                        ft === "VEG" ? styles.vegDot : styles.nonVegDot
                      }`}
                    />
                    {ft === "VEG"
                      ? "Veg"
                      : ft === "NON_VEG"
                        ? "Non-Veg"
                        : formatTag(ft)}
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
            <motion.figure
              className={styles.statementPhoto}
              initial={{ opacity: 0, rotate: -14, y: 50 }}
              whileInView={{ opacity: 1, rotate: -5, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
            >
              <i className={`${styles.tape} ${styles.tapeTopLeft}`} />
              <div className={styles.statementPhotoFrame}>
                <Pic
                  src={FOOD.vegBowl.src}
                  alt={FOOD.vegBowl.alt}
                  sizes="(max-width: 820px) 80vw, 420px"
                />
              </div>
            </motion.figure>
          </div>
        </div>
      </div>

      <div className={styles.waveBand} aria-hidden>
        <div className={styles.waveTrack}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              When hunger hits, {mess.messName} has you covered <b>✦</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Full-bleed photo break ───────────────────────────────────────────────── */

function PhotoBreak({
  image,
  alt,
  line,
  note,
}: {
  image: PicSrc;
  alt: string;
  line: string;
  note: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section ref={ref} className={`${styles.sheet} ${styles.photoBreak}`}>
      <motion.div
        className={styles.breakMedia}
        style={reduceMotion ? undefined : { y }}
      >
        <Pic src={image} alt={alt} sizes="100vw" />
      </motion.div>
      <div className={styles.breakShade} />
      <div className={`${styles.inner} ${styles.breakCopy}`}>
        <p className={styles.noteLabel}>{note}</p>
        <RiseText text={line} className={styles.displayXL} />
      </div>
    </section>
  );
}

/* ─── Menu: pick a day ─────────────────────────────────────────────────────── */

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
    <section id="menu" className={`${styles.sheet} ${styles.paper}`}>
      <div className={styles.inner}>
        <p className={styles.noteLabelDark}>pick a day!</p>
        <RiseText text="What's cooking this week" className={styles.display} />

        <div className={styles.dayDiscs} role="tablist" aria-label="Day">
          {DAYS.map((day) => {
            const active = activeDay === day;
            return (
              <button
                key={day}
                role="tab"
                aria-selected={active}
                className={`${styles.disc} ${active ? styles.discActive : ""}`}
                onClick={() => setActiveDay(day)}
              >
                {active && (
                  <motion.span
                    layoutId="discFill"
                    className={styles.discFill}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className={styles.discLabel}>{DAY_SHORT[day]}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.menuGrid}>
        <div className={styles.cardStage}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              className={styles.indexCard}
              initial={{ opacity: 0, y: 46, rotate: -3 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: { type: "spring", stiffness: 220, damping: 20 },
              }}
              exit={{
                opacity: 0,
                y: -24,
                rotate: 2,
                transition: { duration: 0.16 },
              }}
            >
              <i className={`${styles.tape} ${styles.tapeTopCenter}`} />
              <div className={styles.indexTab}>{formatTag(activeDay)}</div>

              {entries.length === 0 ? (
                <div className={styles.restDay}>
                  <p className={styles.restTitle}>Kitchen rest day</p>
                  <p className={styles.restNote}>
                    we&rsquo;re off today &mdash; back tomorrow with a fresh
                    menu!
                  </p>
                </div>
              ) : (
                <ul className={styles.mealRows}>
                  {rows.map(({ entry, meal, kind }, i) => (
                    <motion.li
                      key={`${entry.variationId}-${i}`}
                      className={styles.mealRow}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.14 + i * 0.1,
                          duration: 0.45,
                          ease: EASE,
                        },
                      }}
                    >
                      <div
                        className={`${styles.mealPhoto} ${
                          i % 2 === 0 ? styles.mealTileLime : ""
                        }`}
                        style={{ rotate: i % 2 === 0 ? "-3deg" : "3deg" }}
                      >
                        <MealIcon kind={kind} animated />
                      </div>
                      <div className={styles.mealText}>
                        <span className={styles.mealLabel}>{meal}</span>
                        <span className={styles.mealItems}>{entry.items}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

          <motion.aside
            className={styles.glance}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
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
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────────── */

function HowItWorks({ mess }: { mess: MessDetails }) {
  const steps = [
    {
      icon: <ClipboardList size={30} />,
      title: "Pick your plan",
      text: "Check this week's menu and the plan price right here on this page.",
    },
    {
      icon: <MessageCircle size={30} />,
      title: "Message the kitchen",
      text: `Tap Subscribe to chat with ${mess.messName} on WhatsApp and agree your start date.`,
    },
    {
      icon: <Utensils size={30} />,
      title: "Eat well, every day",
      text: "Your meals are cooked fresh. No shopping, no cooking and no dishes.",
    },
  ];

  return (
    <section className={`${styles.sheet} ${styles.tintSheet}`}>
      <ScrollBand text="Easy as one two three" />
      <div className={styles.inner}>
        <p className={styles.noteLabelDark}>how it works</p>
        <RiseText text="Three steps to dinner" className={styles.display} />

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <motion.article
              key={step.title}
              className={styles.step}
              initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -6 : 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                delay: i * 0.12,
              }}
            >
              <span className={styles.stepNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </motion.article>
          ))}
        </div>

        <a
          href={waLink(mess.phone, mess.messName)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnDark}
        >
          Start on WhatsApp <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className={`${styles.sheet} ${styles.forest}`}>
      <ScrollBand text="Good questions" reverse />
      <div className={`${styles.inner} ${styles.faqGrid}`}>
        <div>
          <p className={styles.noteLabel}>before you ask</p>
          <RiseText text="Quick answers" className={styles.display} />
          <div className={styles.faqArt}>
            <MealIcon kind="plate" animated />
          </div>
        </div>

        <ul className={styles.faqList}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={item.q}
                className={styles.faqItem}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              >
                <button
                  className={styles.faqQ}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <motion.span
                    className={styles.faqChevron}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                  >
                    <ChevronDown size={22} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.faqAWrap}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p className={styles.faqA}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─── Reasons: sheets that stack as you scroll ─────────────────────────────── */

/** Supporting copy for the tags the API can return. */
const REASON_COPY: Record<string, { text: string; note: string }> = {
  MONTHLY_PLANS: {
    text: "Subscribe once and your meals are sorted for the whole month. No daily ordering, no last-minute scramble.",
    note: "set it & forget it",
  },
  DAILY_FRESH_MEALS: {
    text: "Every meal is cooked the same day it reaches you. Nothing reheated, nothing left over from yesterday.",
    note: "cooked today, eaten today",
  },
  HYGIENIC_KITCHEN: {
    text: "A clean kitchen, clean hands and clean utensils, every single day. Food you can eat without a second thought.",
    note: "spotless, always",
  },
  AFFORDABLE_PRICING: {
    text: "Proper, filling meals at a price that makes sense for everyday eating, not just an occasional treat.",
    note: "easy on the wallet",
  },
  VEG_AND_NON_VEG: {
    text: "Vegetarian or non-vegetarian, there is a plate for you. Pick what suits you and enjoy it.",
    note: "something for everyone",
  },
  QUALITY_INGREDIENTS: {
    text: "Good food starts with good ingredients. Fresh produce and quality staples go into every dish.",
    note: "you can taste it",
  },
  CONSISTENT_TASTE: {
    text: "The meal you loved last week tastes just as good this week. Same care and same flavour, every day.",
    note: "no bad days",
  },
  STUDENT_FRIENDLY: {
    text: "Built for student life: filling meals, sensible prices and timings that fit around classes.",
    note: "like home, away from home",
  },
  FAMILY_MESS: {
    text: "Homely food the whole family can sit down to, from the youngest to the eldest.",
    note: "everyone's welcome",
  },
  NO_HIDDEN_CHARGES: {
    text: "The price you see is the price you pay. No surprise fees and no fine print.",
    note: "what you see is what you pay",
  },
  TRUSTED_MESS: {
    text: "A kitchen people come back to, meal after meal, because it keeps its promises.",
    note: "tried & trusted",
  },
};

const REASON_FALLBACK = {
  text: "One more reason regulars keep coming back for their daily meals.",
  note: "see for yourself",
};

function Reasons({
  reasons,
  messName,
}: {
  reasons: string[];
  messName: string;
}) {
  if (reasons.length === 0) return null;
  const tones = [styles.reasonLime, styles.reasonTint, styles.reasonForest];
  const plates = [FOOD.vegBowl, FOOD.salad, FOOD.grilled];

  return (
    <section className={styles.reasons}>
      <div className={styles.reasonsHead}>
        <p className={styles.noteLabelDark}>why people stick around</p>
        <RiseText text="Here's the deal." className={styles.display} />
        <p className={styles.reasonsIntro}>
          {reasons.length === 1
            ? `One simple promise from ${messName}, served with every meal.`
            : `${reasons.length} simple promises from ${messName}, served with every meal.`}
        </p>
      </div>

      {reasons.map((reason, i) => {
        const copy = REASON_COPY[reason] ?? REASON_FALLBACK;
        return (
          <div
            key={reason}
            className={`${styles.reason} ${tones[i % tones.length]}`}
            style={{ top: `${64 + i * 26}px` }}
          >
            <div className={styles.plateWrap}>
              <motion.div
                className={styles.plate}
                initial={{ scale: 0.6, rotate: -30, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                <Pic
                  src={plates[i % plates.length].src}
                  alt={plates[i % plates.length].alt}
                  sizes="(max-width: 820px) 170px, 280px"
                />
              </motion.div>
              <motion.span
                className={styles.reasonIndex}
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: -8 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
            </div>
            <RiseText
              as="h3"
              text={formatTag(reason)}
              className={styles.reasonTitle}
            />
            <motion.p
              className={styles.reasonText}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
            >
              {copy.text}
            </motion.p>
            <p className={styles.reasonNote}>{copy.note}</p>
          </div>
        );
      })}
    </section>
  );
}

/* ─── Plan / CTA ───────────────────────────────────────────────────────────── */

function PlanSection({ mess, plan }: { mess: MessDetails; plan: NewMessPlan }) {
  const showMin =
    plan.minPrice &&
    Number(plan.minPrice) > 0 &&
    Number(plan.minPrice) < Number(plan.price);

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
    <section id="plan" className={`${styles.sheet} ${styles.lime}`}>
      <div className={styles.inner}>
        <p className={styles.noteLabelDark}>ready when you are</p>
        <RiseText text="Let's get you fed!" className={styles.displayXL} />

        <div className={styles.planGrid}>
          <motion.div
            className={styles.planCard}
            initial={{ opacity: 0, y: 70, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            <i className={`${styles.tape} ${styles.tapeTopLeft}`} />
            <i className={`${styles.tape} ${styles.tapeTopRight}`} />

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spinDisc}
              aria-label="Subscribe now on WhatsApp"
            >
              <svg
                viewBox="0 0 120 120"
                className={styles.spinText}
                aria-hidden
              >
                <defs>
                  <path
                    id="discCircle"
                    d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                  />
                </defs>
                <text>
                  <textPath href="#discCircle">
                    SUBSCRIBE NOW ✦ SUBSCRIBE NOW ✦
                  </textPath>
                </text>
              </svg>
              <ArrowUpRight size={30} />
            </a>

            <div className={styles.planBadges}>
              {plan.isDailyPlan && <span>Daily plan</span>}
              {plan.isMonthlyPlan && <span>Monthly plan</span>}
            </div>
            <h3 className={styles.planName}>{plan.planName}</h3>
            {plan.description && (
              <p className={styles.planDesc}>{plan.description}</p>
            )}

            <div className={styles.priceRow}>
              <span className={styles.price}>{inr(plan.price)}</span>
              {showMin && (
                <span className={styles.fromNote}>
                  starting from {inr(plan.minPrice)}!
                </span>
              )}
            </div>

            {variations.length > 0 && (
              <ul className={styles.includes}>
                {variations.map((v) => (
                  <li key={v.id}>
                    <BadgeCheck size={18} />
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
                className={styles.btnDark}
              >
                Subscribe Now <ArrowUpRight size={18} />
              </a>
              <a href={`tel:${mess.phone}`} className={styles.btnOutline}>
                <Phone size={16} /> Call the kitchen
              </a>
            </div>
          </motion.div>

          <motion.figure
            className={styles.planPhoto}
            initial={{ opacity: 0, y: 60, rotate: 12 }}
            whileInView={{ opacity: 1, y: 0, rotate: 4 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 16,
              delay: 0.12,
            }}
          >
            <i className={`${styles.tape} ${styles.tapeTopCenter}`} />
            <div className={styles.planPhotoFrame}>
              <Pic
                src={planPhoto.src}
                alt={planPhoto.alt}
                sizes="(max-width: 820px) 88vw, 480px"
              />
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery (conditional) ────────────────────────────────────────────────── */

function GalleryStrip({ mess }: { mess: MessDetails }) {
  if (mess.gallery.length === 0) return null;
  return <GalleryStripInner mess={mess} />;
}

function GalleryStripInner({ mess }: { mess: MessDetails }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-28%"]);

  const sorted = [...mess.gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      ref={ref}
      className={`${styles.sheet} ${styles.forest} ${styles.gallery}`}
    >
      <motion.div
        className={styles.galleryTrack}
        style={reduceMotion ? undefined : { x }}
      >
        {sorted.map((img, i) => (
          <figure
            key={img.id}
            className={styles.galleryItem}
            style={{ rotate: `${i % 2 === 0 ? -3 : 2.5}deg` }}
          >
            <i className={`${styles.tape} ${styles.tapeTopCenter}`} />
            <div className={styles.galleryFrame}>
              <Pic
                src={img.url}
                alt={img.altText ?? `Food at ${mess.messName}`}
                sizes="(max-width: 820px) 60vw, 380px"
              />
            </div>
          </figure>
        ))}
      </motion.div>
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
    <section className={`${styles.sheet} ${styles.paper}`}>
      <div className={styles.inner}>
        <p className={styles.noteLabelDark}>come say hi</p>
        <RiseText text="Find the kitchen" className={styles.display} />

        <motion.div
          className={styles.contactGrid}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className={styles.contactCell}>
            <p className={styles.cellLabel}>
              <MapPin size={14} /> Address
            </p>
            <p className={styles.cellBig}>{mess.address.address}</p>
            <p className={styles.cellSub}>
              {mess.address.location}
              {mess.address.zipcode ? ` · ${mess.address.zipcode}` : ""}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              Open in Maps <ArrowUpRight size={16} />
            </a>
          </div>

          <div className={styles.contactCell}>
            {mess.phone && (
              <div>
                <p className={styles.cellLabel}>
                  <Phone size={14} /> Phone
                </p>
                <a href={`tel:${mess.phone}`} className={styles.cellLink}>
                  {mess.phone}
                </a>
              </div>
            )}
            {mess.email && (
              <div>
                <p className={styles.cellLabel}>
                  <Mail size={14} /> Email
                </p>
                <a href={`mailto:${mess.email}`} className={styles.cellLink}>
                  {mess.email}
                </a>
              </div>
            )}
            {hours.length > 0 && (
              <div>
                <p className={styles.cellLabel}>
                  <Clock size={14} /> Hours
                </p>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Sticky subscribe bar ─────────────────────────────────────────────────── */

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
    setShow(v > window.innerHeight * 0.9);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.stickyBar}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <div className={styles.stickyInfo}>
            <span className={styles.stickyName}>{mess.messName}</span>
            {plan && (
              <span className={styles.stickyPrice}>{inr(plan.price)}</span>
            )}
          </div>
          <a
            href={waLink(mess.phone, mess.messName)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.stickyCta}
          >
            Subscribe <ArrowUpRight size={16} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ModernTheme({ mess }: { mess: MessDetails }) {
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#101c10";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  // Inertia ("lerped") scrolling, like the reference site.
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: true });
    return () => lenis.destroy();
  }, [reduceMotion]);

  const plan = mess.plans[0] ?? null;
  const schedule = plan?.menus[0]?.schedule ?? {};
  const servedDays = DAYS.filter((d) => (schedule[d] ?? []).length > 0);
  const restDays = DAYS.filter((d) => (schedule[d] ?? []).length === 0);
  const meals = plan
    ? [...plan.variations]
        .sort((a, b) => mealRank(a.title) - mealRank(b.title))
        .map((v) => v.title)
    : [];
  const foodLabel = mess.foodTypes
    .map((ft) =>
      ft === "VEG" ? "Veg" : ft === "NON_VEG" ? "Non-veg" : formatTag(ft),
    )
    .join(" + ");

  const stats: Stat[] = [];
  if (plan) {
    stats.push({ label: "plan price", value: Number(plan.price), prefix: "₹" });
    if (meals.length > 0)
      stats.push({ label: "meals a day", value: meals.length });
    if (servedDays.length > 0)
      stats.push({ label: "days a week", value: servedDays.length });
  }
  if (foodLabel) stats.push({ label: "on the menu", text: foodLabel });

  const list = (xs: string[]) =>
    xs.length <= 1
      ? xs.join("")
      : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
  const faqs: { q: string; a: string }[] = [];
  if (foodLabel || meals.length > 0) {
    faqs.push({
      q: `What does ${mess.messName} serve?`,
      a: [
        foodLabel && `${mess.messName} serves ${foodLabel.toLowerCase().replace(" + ", " and ")} meals.`,
        meals.length > 0 && `The plan includes ${list(meals.map((m) => m.toLowerCase()))}.`,
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
        a: `Meals are served on ${list(servedDays.map(formatTag))}.${
          restDays.length > 0
            ? ` The kitchen rests on ${list(restDays.map(formatTag))}.`
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

  // First three tags become the stacked "reasons"; the rest feed the tag line.
  const reasons = mess.tags.slice(0, 3);
  const extraTags = mess.tags.slice(3);

  // Full-bleed scenes use the mess's own gallery when it has one.
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
      <main
        className={`${styles.page} ${heading.variable} ${body.variable} ${note.variable}`}
      >
        <Preloader mess={mess} />
        <Masthead mess={mess} />

        <Hero mess={mess} stats={stats} />
        <Statement mess={mess} extraTags={extraTags} />
        <PhotoBreak
          image={sceneA.src}
          alt={sceneA.alt}
          note="straight from the kitchen"
          line="Made fresh. Every single day."
        />
        {plan && <MenuSection plan={plan} />}
        <HowItWorks mess={mess} />
        <Reasons reasons={reasons} messName={mess.messName} />
        {plan && <PlanSection mess={mess} plan={plan} />}
        <PhotoBreak
          image={sceneB.src}
          alt={sceneB.alt}
          note="no cooking, no dishes"
          line="Good food. Zero effort."
        />
        <GalleryStrip mess={mess} />
        <Faq items={faqs} />
        <ContactSection mess={mess} />

        <footer className={`${styles.sheet} ${styles.footer}`}>
          <p className={styles.footerNote}>thanks for stopping by</p>
          <p className={styles.footerMark}>{mess.messName}</p>
          <p className={styles.footerLine}>
            Served fresh on{" "}
            <Link href="/" className={styles.footerLink}>
              MessMeals
            </Link>
          </p>
        </footer>

        <StickyBar mess={mess} plan={plan} />
      </main>
    </MotionConfig>
  );
}
