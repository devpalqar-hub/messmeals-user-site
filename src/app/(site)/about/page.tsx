import type { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | MessMeals",
  description:
    "Learn more about MessMeals, our mission, and how we connect people with trusted local messes for authentic homely food.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | MessMeals",
    description:
      "Learn more about MessMeals, our mission, and how we connect people with trusted local messes for authentic homely food.",
    url: "/about",
  },
};

export default function About() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <HomeIconSmall />
              <span>Good Food Brings People Together</span>
            </div>
            <h1 className={styles.heroTitle}>
              Good food should feel <br />
              <span>closer to home.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Messmeals makes it easier to discover trusted local messes,
              compare meal plans, and enjoy homely food without the hassle.
              We connect people looking for everyday meals with mess owners
              who care about good food and reliable service.
            </p>
            <div className={styles.heroActions}>
              <Link href="/" className={styles.btnPrimary}>
                Explore Messes &rarr;
              </Link>
              <Link href="/partner" className={styles.btnSecondary}>
                List Your Mess
              </Link>
            </div>
            <div className={styles.heroFeatures}>
              <div className={styles.featureItem}>
                <HomeIconSmall />
                <span>Authentic Home Food</span>
              </div>
              <div className={styles.featureItem}>
                <ShieldIconSmall />
                <span>Trusted & Verified</span>
              </div>
              <div className={styles.featureItem}>
                <PlanIconSmall />
                <span>Affordable Plans</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <img src="/about/aboutherobg.png" alt="Homely Meals" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.missionContainer}>
          <div className={styles.missionImageWrapper}>
            <img src="/about/aboutourimg.png" alt="Our Mission" className={styles.missionImage} />
          </div>
          <div className={styles.missionContent}>
            <div className={styles.sectionBadge}>
              <ClockIconSmall />
              <span>Our Mission</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Why we built <span>Messmeals</span>
            </h2>
            <p className={styles.sectionDesc}>
              We believe everyone deserves access to fresh, healthy and homely
              meals. Messmeals was built to make everyday meals easier to find,
              help local messes reach more customers, bring transparency to
              meal plans and pricing, and simplify the way people discover
              recurring meals.
            </p>
            <div className={styles.missionCards}>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>
                  <StoreIconSmall />
                </div>
                <strong>Trusted</strong>
                <span>local messes</span>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>
                  <ClipboardIconSmall />
                </div>
                <strong>Flexible</strong>
                <span>meal plans</span>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>
                  <HeartIconSmall />
                </div>
                <strong>Built for</strong>
                <span>everyday meals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Experiences Section */}
      <section className={styles.experiencesSection}>
        <div className={styles.experiencesContainer}>
          <div className={styles.experiencesHeader}>
            <div className={styles.sectionBadgeCentered}>
              <ShieldIconSmall />
              <span>Two Communities, One Goal</span>
            </div>
            <h2 className={styles.sectionTitleCentered}>
              One platform, two simple experiences.
            </h2>
            <p className={styles.sectionDescCentered}>
              Whether you're looking for homely meals or managing a mess, Messmeals is built for you.
            </p>
          </div>

          <div className={styles.experiencesCards}>
            {/* Customers Card */}
            <div className={styles.experienceCard}>
              <div className={styles.expCardHeader}>
                <div className={styles.expCardIcon}>
                  <UsersIconSmall />
                </div>
                <div>
                  <h3>For Customers</h3>
                  <p>Find meals that feel like home.</p>
                </div>
              </div>
              <div className={styles.expCardBody}>
                <ul className={styles.expList}>
                  <li><CheckIcon /> Discover nearby messes</li>
                  <li><CheckIcon /> Compare meal plans and menus</li>
                  <li><CheckIcon /> View verified messes</li>
                  <li><CheckIcon /> Manage your meal plans</li>
                  <li><CheckIcon /> Save addresses for easy booking</li>
                  <li><CheckIcon /> Enjoy fresh and homely meals</li>
                </ul>
                <div className={styles.expCardFooter}>
                  <Link href="/" className={styles.btnPrimaryDark}>
                    Explore Messes &rarr;
                  </Link>
                </div>
                <img src="/about/aboutgirl.png" alt="For Customers" className={styles.expImageGirl} />
              </div>
            </div>

            {/* Mess Owners Card */}
            <div className={styles.experienceCard}>
              <div className={styles.expCardHeader}>
                <div className={styles.expCardIcon}>
                  <StoreIconSmall />
                </div>
                <div>
                  <h3>For Mess Owners</h3>
                  <p>Grow your mess business, effortlessly.</p>
                </div>
              </div>
              <div className={styles.expCardBody}>
                <ul className={styles.expList}>
                  <li><CheckIcon /> List and manage multiple messes</li>
                  <li><CheckIcon /> Add and update menus and plans</li>
                  <li><CheckIcon /> Manage customers and delivery partners</li>
                  <li><CheckIcon /> Track revenue and orders</li>
                  <li><CheckIcon /> Handle customer wallets and discounts</li>
                  <li><CheckIcon /> View and filter deliveries</li>
                </ul>
                <div className={styles.expCardFooter}>
                  <Link href="/partner" className={styles.btnPrimaryDark}>
                    List Your Mess &rarr;
                  </Link>
                </div>
                <img src="/about/aboutman.png" alt="For Mess Owners" className={styles.expImageMan} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.howItWorksContainer}>
          <div className={styles.howItWorksHeader}>
            <h2 className={styles.sectionTitleCentered}>
              How <span>Messmeals</span> works
            </h2>
            <p className={styles.sectionDescCentered}>
              A simple process for great meals, for everyone.
            </p>
          </div>

          <div className={styles.howItWorksBox}>
            <div className={styles.hwBoxHeader}>
              <div className={styles.hwBadge}>
                <UsersIconSmallWhite />
                <span>For Customers</span>
              </div>
            </div>
            <div className={styles.hwSteps}>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>1</div>
                <div className={styles.hwStepIcon}><SearchIconSmall /></div>
                <h4>Discover a mess</h4>
                <p>Search by location, explore verified messes.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>2</div>
                <div className={styles.hwStepIcon}><CompareIconSmall /></div>
                <h4>Compare plans & menus</h4>
                <p>Check meal options, pricing and reviews.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>3</div>
                <div className={styles.hwStepIcon}><CalendarIconSmall /></div>
                <h4>Choose your meal plan</h4>
                <p>Pick the plan that fits your needs.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>4</div>
                <div className={styles.hwStepIcon}><HeartIconSmall /></div>
                <h4>Enjoy homely meals</h4>
                <p>Get your meals and savor the experience.</p>
              </div>
            </div>
          </div>

          <div className={styles.howItWorksBox}>
            <div className={styles.hwBoxHeader}>
              <div className={styles.hwBadge}>
                <StoreIconSmallWhite />
                <span>For Mess Owners</span>
              </div>
            </div>
            <div className={styles.hwSteps}>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>1</div>
                <div className={styles.hwStepIcon}><PlusIconSmall /></div>
                <h4>List your mess</h4>
                <p>Add your mess details and location.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>2</div>
                <div className={styles.hwStepIcon}><MenuIconSmall /></div>
                <h4>Add menus & plans</h4>
                <p>Create meal plans and set pricing.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>3</div>
                <div className={styles.hwStepIcon}><UsersIconSmall /></div>
                <h4>Add customers</h4>
                <p>Manage your customers with ease.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>4</div>
                <div className={styles.hwStepIcon}><ChartIconSmall /></div>
                <h4>Manage deliveries</h4>
                <p>Track orders and grow your business.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Section */}
      <section className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <div className={styles.whyChooseHeader}>
            <div className={styles.sectionBadge}>
              <ShieldIconSmall />
              <span>Why Choose Messmeals</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Built around trust, convenience <br />
              and <span>local food.</span>
            </h2>
            <p className={styles.sectionDesc}>
              We're creating a better way to connect people with homely meals.
            </p>
          </div>

          <div className={styles.whyChooseGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <ShieldIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Verified Messes</h4>
                <p>Only trusted and quality messes listed.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <DocumentIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Clear Meal Plans</h4>
                <p>Transparent pricing and meal details.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <SearchIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Helpful Search & Filters</h4>
                <p>Find the right mess quickly in your area.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <HeadphonesIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Customer Support</h4>
                <p>We're here to help with any queries.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <TruckIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Delivery Management</h4>
                <p>Track deliveries with ease and reliability.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <LockIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Secure Account Access</h4>
                <p>Your data and payments are always safe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin App Section */}
      <section className={styles.adminAppSection}>
        <div className={styles.adminAppContainer}>
          <div className={styles.adminAppContent}>
            <div className={styles.sectionBadge}>
              <StoreIconSmall />
              <span>For Mess Owners & Managers</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Manage your mess <br />
              with <span>less effort.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Messmeals Admin is a powerful and easy-to-use app to manage
              multiple messes, track revenue, handle customers, delivery partners,
              menus, plans, wallets, discounts and deliveries &mdash; all in one place.
            </p>
            <div className={styles.appStoreButtons}>
              <button className={styles.storeBtn}>
                <GooglePlayIcon />
                <div className={styles.storeBtnText}>
                  <span>GET IT ON</span>
                  <strong>Google Play</strong>
                </div>
              </button>
              <button className={styles.storeBtn}>
                <AppleIcon />
                <div className={styles.storeBtnText}>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </button>
            </div>
            <Link href="/partner" className={styles.learnMoreLink}>
              Learn more about Messmeals Admin &rarr;
            </Link>
          </div>
          <div className={styles.adminAppImageWrapper}>
            <img src="/messappmock.png" alt="Messmeals Admin App" className={styles.adminAppImage} />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className={styles.visionSection}>
        <div className={styles.visionContainer}>
          <div className={styles.visionHeader}>
            <div className={styles.sectionBadge}>
              <EyeIconSmall />
              <span>Our Vision</span>
            </div>
            <h2 className={styles.sectionTitle}>
              What we're building for the future.
            </h2>
            <p className={styles.sectionDesc}>
              We're committed to creating a healthier, more connected food community.
            </p>
          </div>

          <div className={styles.visionGrid}>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <StoreIconSmall />
              </div>
              <h4>More local messes</h4>
              <p>Bring more verified messes to every city and town.</p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <SearchIconSmall />
              </div>
              <h4>Smarter discovery</h4>
              <p>Use technology to help people find the right meals faster.</p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <SettingsIconSmall />
              </div>
              <h4>Smoother operations</h4>
              <p>Better tools for mess owners to manage and grow.</p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <HeartIconSmall />
              </div>
              <h4>Better everyday food experiences</h4>
              <p>Make homely meals accessible to more people.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.bottomCtaContainer}>
          <div className={styles.bottomCtaLeft}>
            <div className={styles.bottomCtaIcon}>
              <StoreIconSmall />
            </div>
            <div className={styles.bottomCtaText}>
              <h3>A better way to find and manage everyday meals.</h3>
              <p>For food lovers, and for mess owners. Let's build a stronger, healthier food community together.</p>
            </div>
          </div>
          <div className={styles.bottomCtaActions}>
            <Link href="/" className={styles.btnPrimaryDark}>
              Explore Messes &rarr;
            </Link>
            <Link href="/partner" className={styles.btnSecondary}>
              List Your Mess
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Icons
const HomeIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ShieldIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const PlanIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ClockIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const StoreIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const StoreIconSmallWhite = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ClipboardIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);
const HeartIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
const UsersIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const UsersIconSmallWhite = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const SearchIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const CompareIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><polyline points="8 5 3 10 8 15"></polyline><line x1="3" y1="14" x2="21" y2="14"></line><polyline points="16 19 21 14 16 9"></polyline></svg>
);
const CalendarIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const PlusIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MenuIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const ChartIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const DocumentIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const HeadphonesIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
);
const TruckIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const LockIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const EyeIconSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const SettingsIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55C500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
const GooglePlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z"></path></svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
    <rect width="24" height="24" rx="12" fill="#55C500"/>
    <path d="M7 12L10.5 15.5L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
