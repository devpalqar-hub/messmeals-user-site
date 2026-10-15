import type { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About MessMeals | Our Mission & Platform",
  description:
    "Learn about MessMeals, the platform that helps people discover nearby messes, explore meal plans and connect with local food providers.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MessMeals | Our Mission & Platform",
    description:
      "Learn about MessMeals, the platform that helps people discover nearby messes, explore meal plans and connect with local food providers.",
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
              About MessMeals: <br />
              <span>Connecting People with Nearby Messes &amp; Meal Plans</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Searching for a mess near me? MessMeals helps you discover nearby
              messes, explore homely food, and compare available menus and daily
              or monthly meal plans. We also help mess owners manage their
              businesses with Mess Manager, our mess management app.
            </p>
            <div className={styles.heroActions}>
              <Link href="/" className={styles.btnPrimary}>
                Explore Messes &rarr;
              </Link>
              <Link href="/mess-manager" className={styles.btnSecondary}>
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
            <img src="/about/aboutherobg.png" alt="Homely food and meal options on MessMeals" className={styles.heroImage} />
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
              Why we built <span>MessMeals</span>
            </h2>
            <p className={styles.sectionDesc}>
              Finding everyday food should be simpler. MessMeals helps people
              discover nearby messes, review available menus, and compare meal
              plans in one place. We also want to help local mess owners reach
              more customers and organize their daily work with Mess Manager,
              an app built for mess management.
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
              Whether you're searching for a mess near you or managing a food business, MessMeals brings both experiences together.
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
                  <li><CheckIcon /> Find nearby messes by location</li>
                  <li><CheckIcon /> Compare available meal plans and menus</li>
                  <li><CheckIcon /> Review mess details and available information</li>
                  <li><CheckIcon /> Explore daily and monthly meal options</li>
                  <li><CheckIcon /> Save addresses for easier booking</li>
                  <li><CheckIcon /> Discover homely food for your routine</li>
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
                  <p>Manage daily operations with Mess Manager.</p>
                </div>
              </div>
              <div className={styles.expCardBody}>
                <ul className={styles.expList}>
                  <li><CheckIcon /> List and manage mess locations</li>
                  <li><CheckIcon /> Create menus and meal plans</li>
                  <li><CheckIcon /> Organize customers and delivery partners</li>
                  <li><CheckIcon /> Track orders and revenue information</li>
                  <li><CheckIcon /> Manage customer wallets and discounts</li>
                  <li><CheckIcon /> Review and filter deliveries</li>
                </ul>
                <div className={styles.expCardFooter}>
                  <Link href="/mess-manager" className={styles.btnPrimaryDark}>
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
              How <span>MessMeals</span> Works
            </h2>
            <p className={styles.sectionDescCentered}>
              Find nearby messes and meal plans, or manage your mess business with Mess Manager.
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
                <h4>Find a nearby mess</h4>
                <p>Explore messes by city or locality.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>2</div>
                <div className={styles.hwStepIcon}><CompareIconSmall /></div>
                <h4>Compare meal plans</h4>
                <p>Review available menus, prices and plan details.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>3</div>
                <div className={styles.hwStepIcon}><CalendarIconSmall /></div>
                <h4>Choose a meal plan</h4>
                <p>Find an available option for your routine.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>4</div>
                <div className={styles.hwStepIcon}><HeartIconSmall /></div>
                <h4>Enjoy everyday meals</h4>
                <p>Follow the provider's booking or enquiry process.</p>
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
                <p>Add your business details and location.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>2</div>
                <div className={styles.hwStepIcon}><MenuIconSmall /></div>
                <h4>Set menus & meal plans</h4>
                <p>Add available meals and plan pricing.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>3</div>
                <div className={styles.hwStepIcon}><UsersIconSmall /></div>
                <h4>Organize customers</h4>
                <p>Keep customer and subscription details organized.</p>
              </div>
              <div className={styles.hwArrow}>&rarr;</div>
              <div className={styles.hwStep}>
                <div className={styles.hwStepNum}>4</div>
                <div className={styles.hwStepIcon}><ChartIconSmall /></div>
                <h4>Manage daily operations</h4>
                <p>Review orders and coordinate delivery tasks.</p>
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
              <span>Why Choose MessMeals</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Built around trust, convenience <br />
              and <span>local food.</span>
            </h2>
            <p className={styles.sectionDesc}>
              MessMeals makes it easier to explore nearby messes and available meal plans, while Mess Manager helps owners organize daily operations.
            </p>
          </div>

          <div className={styles.whyChooseGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <ShieldIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Local Mess Listings</h4>
                <p>Explore mess details and food options in your area.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <DocumentIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Meal Plans & Menus</h4>
                <p>Review available prices, menus and plan information.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <SearchIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Search for Nearby Messes</h4>
                <p>Explore messes based on location and available filters.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <HeadphonesIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Helpful Information</h4>
                <p>Review listing details and contact providers when needed.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <TruckIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Delivery Management</h4>
                <p>Mess Manager helps owners organize delivery-related tasks.</p>
              </div>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <LockIconSmall />
              </div>
              <div className={styles.whyCardContent}>
                <h4>Convenient Account Access</h4>
                <p>Access the tools and information available through your account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mess Manager App Section */}
      <section className={styles.adminAppSection}>
        <div className={styles.adminAppContainer}>
          <div className={styles.adminAppContent}>
            <div className={styles.sectionBadge}>
              <StoreIconSmall />
              <span>For Mess Owners & Managers</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Manage your mess <br />
              with <span>Mess Manager.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Mess Manager is an app built for mess owners and managers. Organize
              mess locations, menus, meal plans, customers, delivery partners,
              orders, wallets, discounts and revenue information in one place.
            </p>
            <div className={styles.appStoreButtons}>
              <a
                href="https://play.google.com/store/apps/details?id=com.messmeals.mess"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
                aria-label="Get it on Google Play"
              >
                <img src="/Playstore.svg" alt="Google Play" className={styles.storeBtnIcon} />
                <div className={styles.storeBtnText}>
                  <span>GET IT ON</span>
                  <strong>Google Play</strong>
                </div>
              </a>
              <a
                href="https://apps.apple.com/in/app/messmeals/id6754977891"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
                aria-label="Download on the App Store"
              >
                <img src="/Apple.svg" alt="App Store" className={`${styles.storeBtnIcon} ${styles.storeBtnIconInvert}`} />
                <div className={styles.storeBtnText}>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
            </div>
            <Link href="/mess-manager" className={styles.learnMoreLink}>
              Learn more about Mess Manager &rarr;
            </Link>
          </div>
          <div className={styles.adminAppImageWrapper}>
            <img src="/messappmock.png" alt="Mess Manager app for mess owners and managers" className={styles.adminAppImage} />
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
              A better future for nearby food discovery and mess management.
            </h2>
            <p className={styles.sectionDesc}>
              We're working toward a more connected food community where people can find everyday meals more easily and mess owners have useful tools to manage their businesses.
            </p>
          </div>

          <div className={styles.visionGrid}>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <StoreIconSmall />
              </div>
              <h4>More local messes</h4>
              <p>Help more people discover local messes and meal options in their area.</p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <SearchIconSmall />
              </div>
              <h4>Smarter discovery</h4>
              <p>Make it easier to search for nearby messes and compare meal plans.</p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.visionCardIcon}>
                <SettingsIconSmall />
              </div>
              <h4>Smoother operations</h4>
              <p>Keep improving Mess Manager for everyday business tasks.</p>
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
              <h3>Find nearby messes. Compare meal plans. Manage your mess.</h3>
              <p>MessMeals helps customers explore everyday food options, while Mess Manager gives mess owners tools to organize their business.</p>
            </div>
          </div>
          <div className={styles.bottomCtaActions}>
            <Link href="/" className={styles.btnPrimaryDark}>
              Explore Messes &rarr;
            </Link>
            <Link href="/mess-manager" className={styles.btnSecondary}>
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

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
    <rect width="24" height="24" rx="12" fill="#55C500" />
    <path d="M7 12L10.5 15.5L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

