import type { Metadata } from "next";
import styles from "./page.module.css";
import FaqItem from "./FaqItem";
import {
  Store,
  UtensilsCrossed,
  Users,
  Bike,
  BarChart2,
  Tag,
  Download,
  UserPlus,
  TrendingUp,
  Star,
  ShieldCheck,
  Smartphone,
  Settings,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MessMeals Admin - Manage Your Mess Anytime, Anywhere",
  description:
    "MessMeals Admin is a powerful app for mess owners to manage menus, customers, orders, delivery partners and business performance - all in one place.",
  alternates: { canonical: "/partner" },
  openGraph: {
    title: "MessMeals Admin - Manage Your Mess Anytime, Anywhere",
    description:
      "MessMeals Admin is a powerful app for mess owners to manage menus, customers, orders, delivery partners and business performance - all in one place.",
    url: "/partner",
  },
};

const FEATURES = [
  { icon: Store, title: "Manage Multiple Messes", desc: "Add and manage all your messes from a single account." },
  { icon: UtensilsCrossed, title: "Menu & Plans", desc: "Create and update menus, set meal plans and pricing." },
  { icon: Users, title: "Customer Management", desc: "Add customers, track orders and manage wallets." },
  { icon: Bike, title: "Delivery Partners", desc: "Add delivery partners, assign deliveries and track in real time." },
  { icon: BarChart2, title: "Revenue & Reports", desc: "View earnings, orders and business insights." },
  { icon: Tag, title: "Offers & Discounts", desc: "Create special offers and discounts to attract more customers." },
];

const STEPS = [
  { number: 1, Icon: Download, title: "Download the App", desc: "Get the MessMeals Admin app from Play Store or App Store." },
  { number: 2, Icon: Settings, title: "Set Up Your Mess", desc: "Add your mess details, menu and meal plans." },
  { number: 3, Icon: UserPlus, title: "Add Customers & Delivery Partners", desc: "Manage customers and onboard delivery partners." },
  { number: 4, Icon: TrendingUp, title: "Start Managing", desc: "Track orders, revenue and grow your mess business." },
];

const FAQS = [
  {
    q: "What is MessMeals Admin?",
    a: "MessMeals Admin is a mess management app designed for mess owners and managers. It helps you manage multiple messes, customers, meal plans, menus, delivery partners, orders, customer wallets, discounts, and business revenue from one place.",
  },
  {
    q: "Can I manage multiple messes with MessMeals Admin?",
    a: "Yes. MessMeals Admin lets you add and manage multiple messes from a single account. You can keep track of each mess, its customers, plans, menus, orders, deliveries, and performance without switching between different accounts.",
  },
  {
    q: "How can MessMeals Admin help me manage my mess business?",
    a: "MessMeals Admin brings your daily mess operations into one platform. You can monitor revenue, manage customers and delivery partners, create meal plans, update menus, track deliveries, manage customer wallets, and view important business information from the app.",
  },
  {
    q: "Can I track revenue and orders from the app?",
    a: "Yes. The dashboard provides a quick revenue summary along with an overview of orders, customers, delivery partners, and other important business metrics. This helps mess owners understand their business performance at a glance.",
  },
  {
    q: "Can I add customers and manage their meal plans?",
    a: "Yes. You can add customers, assign suitable meal plans, manage their subscription details, and keep their information organized. This makes it easier to manage recurring customers and their daily meal requirements.",
  },
  {
    q: "Can I create and manage menus and meal plans?",
    a: "Yes. MessMeals Admin allows mess owners to create and update menus and meal plans. You can configure meal options such as breakfast, lunch, and dinner and manage plans according to your mess offerings.",
  },
  {
    q: "Can I manage customer wallets and discounts?",
    a: "Yes. The app supports customer wallet and transaction management, making it easier to keep track of customer balances and related payments. You can also manage discounts and offers to provide more flexible pricing for customers.",
  },
  {
    q: "Can I add and manage delivery partners?",
    a: "Yes. You can add delivery partners, manage their details, and organize delivery operations for your mess. This helps you keep delivery management structured as your customer base grows.",
  },
  {
    q: "Can I track mess deliveries and filter delivery records?",
    a: "Yes. MessMeals Admin provides delivery management features that help you view deliveries and organize them using relevant filters and statuses. This makes it easier to monitor ongoing and completed deliveries.",
  },
  {
    q: "Who can use MessMeals Admin?",
    a: "MessMeals Admin is built for mess owners, mess managers, and operations teams who want to simplify mess business management. It is suitable for businesses handling customers, meal subscriptions, menus, orders, deliveries, and multiple mess locations.",
  },
  {
    q: "Is MessMeals Admin available on Android and iPhone?",
    a: "MessMeals Admin can be downloaded from the Google Play Store and Apple App Store, making it convenient for mess owners and managers to access their operations from mobile devices.",
  },
  {
    q: "Why should I use a mess management app like MessMeals Admin?",
    a: "Managing customers, menus, meal plans, orders, deliveries, wallets, and revenue manually can become difficult as a mess grows. MessMeals Admin brings these activities together in one place, helping make daily operations more organized and easier to manage.",
  },
];

function StoreButtons() {
  return (
    <div className={styles["store-btns"]}>
      <a href="#" className={styles["store-btn"]} aria-label="Get it on Google Play">
        <img src="/Playstore.svg" alt="Google Play" className={styles["store-btn-icon"]} />
        <div className={styles["store-btn-text"]}>
          <span className={styles["store-btn-label"]}>GET IT ON</span>
          <span className={styles["store-btn-name"]}>Google Play</span>
        </div>
      </a>
      <a href="#" className={styles["store-btn"]} aria-label="Download on the App Store">
        <img src="/Apple.svg" alt="App Store" className={`${styles["store-btn-icon"]} ${styles["store-btn-icon--invert"]}`} />
        <div className={styles["store-btn-text"]}>
          <span className={styles["store-btn-label"]}>Download on the</span>
          <span className={styles["store-btn-name"]}>App Store</span>
        </div>
      </a>
    </div>
  );
}

export default function Partner() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles["hero-left"]}>
          <div className={styles["hero-badge"]}>
            <Smartphone size={15} />
            <span>For Mess Owners &amp; Managers</span>
          </div>
          <h1 className={styles["hero-title"]}>
            Manage Your Mess<br />
            Anytime, <span>Anywhere.</span>
          </h1>
          <p className={styles["hero-subtitle"]}>
            MessMeals Admin is a powerful and easy-to-use app designed for mess owners and operations teams to manage menus, customers, orders, partners, deliveries and business performance — all in one place.
          </p>
          <StoreButtons />
          <div className={styles["trust-row"]}>
            {["Free to use", "Secure & reliable", "Built for mess owners"].map((label) => (
              <div key={label} className={styles["trust-item"]}>
                <ShieldCheck size={15} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles["hero-right"]}>
          <div className={styles["hero-circle"]} />
          <div className={styles["hero-decoration-text"]}>
            <span>Your<br />mess business<br />in your hands</span>
            <svg className={styles["hero-curved-arrow"]} width="36" height="48" viewBox="0 0 36 48" fill="none">
              <path d="M28 4C32 18 26 34 10 44" stroke="#55C500" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M10 44L16 40" stroke="#55C500" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M10 44L12 36" stroke="#55C500" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles["hero-sparks"]}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M14 14L6 6" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M24 12L20 4" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M33 16L41 10" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <img src="/messappmock.png" alt="MessMeals Admin App Mockup" className={styles["hero-mockup"]} />
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles["section-header"]}>
          <div className={styles["section-icon-wrap"]}><Star size={22} /></div>
          <div>
            <h2 className={styles["section-title"]}>Powerful Features for Mess Owners</h2>
            <p className={styles["section-subtitle"]}>Everything you need to manage and grow your mess business.</p>
          </div>
        </div>
        <div className={styles["features-grid"]}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}><Icon size={28} /></div>
                <h3 className={styles["feature-title"]}>{f.title}</h3>
                <p className={styles["feature-desc"]}>{f.desc}</p>
              </div>
            );
          })}
        </div>
        <div className={styles["features-cta"]}>
          <a href="#" className={styles["features-cta-btn"]}>Download the App <ArrowRight size={17} /></a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles["how-it-works"]}>
        <div className={styles["section-header"]}>
          <div className={styles["section-icon-wrap"]}><Settings size={22} /></div>
          <div>
            <h2 className={styles["section-title"]}>How It Works?</h2>
            <p className={styles["section-subtitle"]}>Get started and manage your mess in just a few simple steps.</p>
          </div>
        </div>
        <div className={styles["steps-row"]}>
          {STEPS.map((step, idx) => {
            const Icon = step.Icon;
            return (
              <div key={step.number} className={styles["step-wrapper"]}>
                <div className={styles["step-item"]}>
                  <div className={styles["step-visual"]}>
                    <span className={styles["step-number"]}>{step.number}</span>
                    <div className={styles["step-icon-wrap"]}><Icon size={26} /></div>
                  </div>
                  <h3 className={styles["step-title"]}>{step.title}</h3>
                  <p className={styles["step-desc"]}>{step.desc}</p>
                </div>
                {idx < STEPS.length - 1 && <div className={styles["step-connector"]} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles["faq-header"]}>
          <div className={styles["section-icon-wrap"]}><HelpCircle size={22} /></div>
          <div>
            <h2 className={styles["section-title"]}>Frequently Asked Questions</h2>
            <p className={styles["section-subtitle"]}>Everything you need to know about MessMeals Admin.</p>
          </div>
        </div>
        <div className={styles["faq-list"]}>
          {FAQS.map((item, idx) => (
            <FaqItem key={idx} q={item.q} a={item.a} index={idx} />
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.cta}>
        <div className={styles["cta-inner"]}>
          <div className={styles["cta-icon-wrap"]}><Smartphone size={28} /></div>
          <div className={styles["cta-text"]}>
            <h2>Ready to grow your mess business?</h2>
            <p>Download the MessMeals Admin app today and take control of your operations.</p>
          </div>
          <StoreButtons />
        </div>
      </section>
    </main>
  );
}
