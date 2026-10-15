import type { Metadata } from "next";
import styles from "./page.module.css";
import FaqItem from "../../../components/ui/FaqItem/FaqItem";
import {
  Bike,
  BarChart2,
  Tag,
  Download,
  UserPlus,
  TrendingUp,
  Star,
  Smartphone,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  Building2,
  UserCheck,
} from "lucide-react";
import {
  Store,
  UtensilsCrossed,
  Users,
  ShieldCheck,
  Settings,
} from "../../../components/ui/SvgIcon/SvgIcon";

export const metadata: Metadata = {
  title: "Mess Manager App for Mess Owners | Mess Manager",
  description:
    "Simplify daily mess operations with the Mess Manager app. Manage menus, meal plans, customers, orders, deliveries and revenue in one place.",
  alternates: { canonical: "/mess-manager" },
  openGraph: {
    title: "Mess Manager App for Mess Owners | Mess Manager",
    description:
      "Simplify daily mess operations with the Mess Manager app. Manage menus, meal plans, customers, orders, deliveries and revenue in one place.",
    url: "/mess-manager",
    images: ["/seo/og-mess-manager.png"],
  },
};

const FEATURES = [
  {
    icon: Store,
    title: "Manage Multiple Messes from One Account",
    desc: "Running more than one mess? Keep them organized through a single account. Manage the menus, customers, meal plans and orders associated with your messes without constantly switching accounts.",
  },
  {
    icon: UtensilsCrossed,
    title: "Create Menus and Manage Meal Plans",
    desc: "Keep your food offerings and meal plans up to date. Set your meal options and pricing, organize your plans, and make changes whenever your mess offerings change.",
  },
  {
    icon: Users,
    title: "Keep Customer Details Organized",
    desc: "Adding customers and managing recurring meal subscriptions becomes easier when their information is in one place. Keep customer details, meal plans and subscription information organized, and manage customer wallets and related transactions through the app.",
  },
  {
    icon: Bike,
    title: "Manage Orders and Coordinate Deliveries",
    desc: "As your customer base grows, keeping track of orders and deliveries can become challenging. Add delivery partners, assign deliveries and check delivery records using the available statuses and filters.",
  },
  {
    icon: BarChart2,
    title: "Understand Your Mess Business Performance",
    desc: "Want a clearer picture of how your mess is doing? Check your revenue summary, order activity, customer information and other key business metrics from the dashboard. Get a useful overview without having to gather information from different places.",
  },
  {
    icon: Tag,
    title: "Create Offers and Discounts",
    desc: "Give customers another reason to choose your mess. Create special offers and discounts to support your promotions and make your meal offerings more flexible.",
  },
];

const BENEFITS = [
  {
    icon: Layers,
    title: "Keep everything organized",
    desc: "Bring customer information, meal plans, orders and delivery operations together.",
  },
  {
    icon: Store,
    title: "Manage from one account",
    desc: "Access multiple messes without maintaining a separate account for every location.",
  },
  {
    icon: CheckCircle2,
    title: "Stay on top of orders",
    desc: "Organize orders and delivery assignments as part of your daily workflow.",
  },
  {
    icon: BarChart2,
    title: "Understand your business better",
    desc: "Check revenue and important business information from your dashboard.",
  },
  {
    icon: TrendingUp,
    title: "Grow at your own pace",
    desc: "Manage your operations as your customer base or number of mess locations increases.",
  },
];

const STEPS = [
  {
    number: 1,
    Icon: Download,
    title: "Download Mess Manager",
    desc: "Get the app from the Google Play Store or Apple App Store, where available, and start setting up your mess business.",
  },
  {
    number: 2,
    Icon: Settings,
    title: "Add Your Mess Details",
    desc: "Set up your mess information, create your menu and configure the meal plans and pricing you offer.",
  },
  {
    number: 3,
    Icon: UserPlus,
    title: "Add Customers and Delivery Partners",
    desc: "Organize customer details and meal subscriptions, then add the delivery partners who help you fulfil orders.",
  },
  {
    number: 4,
    Icon: TrendingUp,
    title: "Manage Your Daily Operations",
    desc: "Use Mess Manager to manage menus, orders, deliveries, customer wallets and revenue information from one place.",
  },
];

const AUDIENCES = [
  {
    icon: UserCheck,
    title: "Mess Owners",
    desc: "Mess owners who want to keep daily business activities organized.",
  },
  {
    icon: Store,
    title: "Mess Managers",
    desc: "Mess managers who handle menus, customers, meal plans and orders.",
  },
  {
    icon: Users,
    title: "Operations Teams",
    desc: "Operations teams responsible for coordinating customers, deliveries and routine tasks.",
  },
  {
    icon: Building2,
    title: "Multi-Location Mess Businesses",
    desc: "Multi-location mess businesses that need to manage multiple messes from one account.",
  },
];

const FAQS = [
  {
    q: "What is a mess manager app?",
    a: "A mess manager app helps mess owners and managers organize the day-to-day activities involved in running a mess business. It can help manage menus, meal plans, customers, orders, deliveries and business reports. Mess Manager brings these functions together in one app.",
  },
  {
    q: "What is the Mess Manager app used for?",
    a: "Mess Manager helps you manage mess locations, menus, meal plans, customer information, orders, delivery partners, customer wallets, offers and revenue summaries.",
  },
  {
    q: "Can I manage multiple messes using Mess Manager?",
    a: "Mess Manager supports managing multiple messes from a single account. You can organize their menus, customers, plans, orders, deliveries and business information in one place.",
  },
  {
    q: "Can I manage customer meal plans and subscriptions?",
    a: "Yes. You can add customers, manage their meal plan details and organize subscription information. The app also supports customer wallet and transaction management.",
  },
  {
    q: "Can I manage menus and meal prices?",
    a: "Yes. You can create and update menus, configure meal options and manage the pricing and meal plans offered by your mess.",
  },
  {
    q: "Does the Mess Manager app support delivery management?",
    a: "Yes. You can add delivery partners, assign deliveries and organize delivery records using the available filters and statuses.",
  },
  {
    q: "Can I check my mess business revenue?",
    a: "Yes. The dashboard provides a revenue summary along with information about orders, customers, delivery partners and other business metrics to help you review your operations.",
  },
  {
    q: "Where can I download the Mess Manager app?",
    a: "Check the official Mess Manager download links for availability on the Google Play Store and Apple App Store.",
  },
  {
    q: "Is the Mess Manager app free to use?",
    a: "Check the app's official listing or current pricing information for its latest usage terms and any applicable charges.",
  },
];

function StoreButtons() {
  return (
    <div className={styles["store-btns"]}>
      <a
        href="https://play.google.com/store/apps/details?id=com.messmeals.mess"
        target="_blank"
        rel="noopener noreferrer"
        className={styles["store-btn"]}
        aria-label="Get it on Google Play"
      >
        <img
          src="/Playstore.svg"
          alt="Google Play"
          className={styles["store-btn-icon"]}
        />
        <div className={styles["store-btn-text"]}>
          <span className={styles["store-btn-label"]}>GET IT ON</span>
          <span className={styles["store-btn-name"]}>Google Play</span>
        </div>
      </a>
      <a
        href="https://apps.apple.com/in/app/messmeals/id6754977891"
        target="_blank"
        rel="noopener noreferrer"
        className={styles["store-btn"]}
        aria-label="Download on the App Store"
      >
        <img
          src="/Apple.svg"
          alt="App Store"
          className={`${styles["store-btn-icon"]} ${styles["store-btn-icon--invert"]}`}
        />
        <div className={styles["store-btn-text"]}>
          <span className={styles["store-btn-label"]}>Download on the</span>
          <span className={styles["store-btn-name"]}>App Store</span>
        </div>
      </a>
    </div>
  );
}

export default function MessManagerPage() {
  // Structured Data Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mess Manager",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Android, iOS",
    description:
      "Mess Manager is an app for mess owners and managers to handle menus, meal plans, customers, orders, delivery partners, customer wallets, offers, and business revenue.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <main className={styles.page}>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles["hero-left"]}>
            <div className={styles["hero-badge"]}>
              <Smartphone size={15} />
              <span>For Mess Owners &amp; Managers</span>
            </div>
            <h1 className={styles["hero-title"]}>
              Run Your Mess Business More Easily with{" "}
              <span className={styles["hero-highlight"]}>Mess Manager</span>
            </h1>
            <div className={styles["hero-text-block"]}>
              <p>
                Running a mess means keeping track of menus, meal plans, customers,
                daily orders, deliveries and business earnings. When everything is
                managed separately, even simple tasks can take up more time than
                they should.
              </p>
              <p>
                <strong className={styles["hero-lead"]}>
                  Mess Manager is an app that brings your daily mess operations
                  together in one place.
                </strong>{" "}
                Manage menus, organize customer information, coordinate
                deliveries and check your business performance from a single app.
              </p>
              <p>
                Whether you run one mess or manage multiple locations, Mess
                Manager helps you stay organized and spend more time focusing on
                your customers.
              </p>
            </div>

            <div className={styles["hero-actions"]}>
              <a href="#download" className={styles["hero-btn-primary"]}>
                Download the App <ArrowRight size={17} />
              </a>
              <a href="#how-it-works" className={styles["hero-btn-secondary"]}>
                See How It Works
              </a>
            </div>

            <div className={styles["trust-row"]}>
              {[
                "Built for mess owners and managers",
                "Available on Android and iPhone",
                "Manage multiple messes",
              ].map((label) => (
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
              <span>
                Your
                <br />
                mess business
                <br />
                in your hands
              </span>
              <svg
                className={styles["hero-curved-arrow"]}
                width="36"
                height="48"
                viewBox="0 0 36 48"
                fill="none"
              >
                <path
                  d="M28 4C32 18 26 34 10 44"
                  stroke="#55C500"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 44L16 40"
                  stroke="#55C500"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 44L12 36"
                  stroke="#55C500"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles["hero-sparks"]}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  d="M14 14L6 6"
                  stroke="#55C500"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M24 12L20 4"
                  stroke="#55C500"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M33 16L41 10"
                  stroke="#55C500"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <img
              src="/messappmock.png"
              alt="Mess Manager app dashboard"
              className={styles["hero-mockup"]}
            />
          </div>
        </section>

        {/* SECTION 2: FEATURES */}
        <section className={styles.features} id="features">
          <div className={styles["section-header"]}>
            <div className={styles["section-icon-wrap"]}>
              <Star size={22} />
            </div>
            <div>
              <h2 className={styles["section-title"]}>
                Everything You Need to Manage Your Mess in One Place
              </h2>
              <p className={styles["section-subtitle"]}>
                A mess business involves more than preparing and serving meals.
                You also need to manage customers, update menus, organize orders
                and keep an eye on your earnings. Mess Manager helps you handle
                these everyday responsibilities without jumping between
                different tools.
              </p>
            </div>
          </div>

          <div className={styles["features-grid"]}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={styles["feature-card"]}>
                  <div className={styles["feature-icon"]}>
                    <Icon size={28} />
                  </div>
                  <h3 className={styles["feature-title"]}>{f.title}</h3>
                  <p className={styles["feature-desc"]}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className={styles["features-cta"]}>
            <a href="#how-it-works" className={styles["features-cta-btn"]}>
              Explore Mess Manager <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* SECTION 3: BENEFITS */}
        <section className={styles.benefits} id="benefits">
          <div className={styles["section-header"]}>
            <div className={styles["section-icon-wrap"]}>
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className={styles["section-title"]}>
                Less Time Managing Tasks. More Time Growing Your Mess.
              </h2>
              <p className={styles["section-subtitle"]}>
                Managing a mess can keep you busy throughout the day. From
                answering customer questions to coordinating orders and
                deliveries, there is always something that needs your attention.
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "14.5px",
                  color: "#2E402E",
                  fontWeight: 600,
                }}
              >
                Mess Manager is designed to make these everyday responsibilities
                easier to handle.
              </p>
            </div>
          </div>

          <div className={styles["benefits-grid"]}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className={styles["benefit-card"]}>
                  <div className={styles["benefit-card-header"]}>
                    <div className={styles["benefit-icon"]}>
                      <Icon size={20} />
                    </div>
                    <h3 className={styles["benefit-title"]}>{b.title}</h3>
                  </div>
                  <p className={styles["benefit-desc"]}>{b.desc}</p>
                </div>
              );
            })}
          </div>

          <div className={styles["benefits-callout"]}>
            <Sparkles size={20} />
            <span>
              With Mess Manager, you have one convenient place to manage the
              essential activities involved in running your mess business.
            </span>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section className={styles["how-it-works"]} id="how-it-works">
          <div className={styles["section-header"]}>
            <div className={styles["section-icon-wrap"]}>
              <Settings size={22} />
            </div>
            <div>
              <h2 className={styles["section-title"]}>
                Get Started with the Mess Manager App in Four Simple Steps
              </h2>
              <p className={styles["section-subtitle"]}>
                Set up your operations in minutes and take full control of your
                mess business.
              </p>
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
                      <div className={styles["step-icon-wrap"]}>
                        <Icon size={26} />
                      </div>
                    </div>
                    <h3 className={styles["step-title"]}>{step.title}</h3>
                    <p className={styles["step-desc"]}>{step.desc}</p>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={styles["step-connector"]}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={styles["features-cta"]}
            style={{ marginTop: "44px" }}
          >
            <a href="#download" className={styles["features-cta-btn"]}>
              Get Started with Mess Manager <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* SECTION 5: WHO IT IS FOR */}
        <section className={styles.audience} id="who-it-is-for">
          <div className={styles["section-header"]}>
            <div className={styles["section-icon-wrap"]}>
              <Users size={22} />
            </div>
            <div>
              <h2 className={styles["section-title"]}>
                A Mess Management App Built for People Who Run a Mess
              </h2>
              <p className={styles["section-subtitle"]}>
                Every mess business has its own daily routine. Some serve regular
                customers on recurring meal plans, while others handle multiple
                mess locations and delivery operations.
              </p>
            </div>
          </div>

          <div className={styles["audience-grid"]}>
            {AUDIENCES.map((aud) => {
              const Icon = aud.icon;
              return (
                <div key={aud.title} className={styles["audience-card"]}>
                  <div className={styles["audience-icon"]}>
                    <Icon size={26} />
                  </div>
                  <h3 className={styles["audience-title"]}>{aud.title}</h3>
                  <p className={styles["audience-desc"]}>{aud.desc}</p>
                </div>
              );
            })}
          </div>

          <div className={styles["audience-callout"]}>
            <p>
              Whether you are managing a small local mess or coordinating
              multiple locations, Mess Manager helps bring your day-to-day
              operations together.
            </p>
            <a href="#download" className={styles["features-cta-btn"]}>
              Start Managing Today <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
        <section className={styles.faq} id="faq">
          <div className={styles["faq-header"]}>
            <div className={styles["section-icon-wrap"]}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 className={styles["section-title"]}>
                Frequently Asked Questions About the Mess Manager App
              </h2>
              <p className={styles["section-subtitle"]}>
                Everything you need to know about Mess Manager and how it
                simplifies mess operations.
              </p>
            </div>
          </div>

          <div className={styles["faq-list"]}>
            {FAQS.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className={styles.cta} id="download">
          <div className={styles["cta-inner"]}>
            <div className={styles["cta-icon-wrap"]}>
              <Smartphone size={28} />
            </div>
            <div className={styles["cta-text"]}>
              <h2>Ready to Make Mess Management Easier?</h2>
              <p>
                You started your mess business to serve good food and build lasting
                customer relationships, not to spend your whole day switching
                between tasks.
              </p>
              <p>
                Bring your menus, meal plans, customers, orders and delivery
                operations together with Mess Manager.
              </p>
              <p>
                Get started with a simpler way to organize your mess business and
                focus on serving your customers.
              </p>
              <span className={styles["cta-tagline"]}>
                Mess Manager — A simpler way to manage your mess business.
              </span>
            </div>
            <StoreButtons />
          </div>
        </section>
      </main>
    </>
  );
}
