import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  Home,
  MapPin,
  Train,
  Utensils,
} from "lucide-react";
import FaqItem from "../ui/FaqItem/FaqItem";
import CityMessGrid from "../ui/CityMessGrid/CityMessGrid";
import { getLocationListings } from "../../data/locations";
import { buildLocationJsonLd } from "../../lib/locationSeo";
import type { LocationPageData, LocationPersona } from "../../types/location";
import styles from "./LocationGuideTemplate.module.css";

function PersonaIcon({ name }: { name: LocationPersona["icon"] }) {
  switch (name) {
    case "briefcase":
      return <Briefcase size={20} />;
    case "graduation":
      return <GraduationCap size={20} />;
    case "home":
      return <Home size={20} />;
    case "train":
      return <Train size={20} />;
    case "building":
      return <Building2 size={20} />;
    case "utensils":
      return <Utensils size={20} />;
    case "clock":
      return <Clock size={20} />;
    case "compass":
    default:
      return <Compass size={20} />;
  }
}

export default async function LocationGuideTemplate({ data }: { data: LocationPageData }) {
  const { breadcrumbLd, pageLd, faqLd } = buildLocationJsonLd(data);
  const hasChildLinks = Boolean(data.childLinks && data.childLinks.length > 0);
  const { messes: initialData, defaultCity } = await getLocationListings(data.path);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <main className={styles.page}>
        {/* ── 1. HERO & BREADCRUMBS ── */}
        <section className={styles.hero}>
          <div className={styles["hero-inner"]}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              {data.breadcrumbs.map((crumb, idx) => {
                const isLast = idx === data.breadcrumbs.length - 1;
                return (
                  <span key={`${crumb.label}-${idx}`} className={styles["breadcrumb-sep"]}>
                    {idx > 0 && <ChevronRight size={14} aria-hidden="true" style={{ marginRight: 6 }} />}
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className={styles["breadcrumb-link"]}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={styles["breadcrumb-current"]}>{crumb.label}</span>
                    )}
                  </span>
                );
              })}
            </nav>

            <div className={styles.eyebrow}>
              <MapPin size={14} aria-hidden="true" />
              <span>{data.heroEyebrow}</span>
            </div>

            <h1 className={styles["hero-title"]}>
              {data.h1}
              {data.heroAccent ? (
                <>
                  {" "}
                  <span className={styles["hero-accent"]}>{data.heroAccent}</span>
                </>
              ) : null}
            </h1>

            <p className={styles["hero-summary"]}>{data.heroSummary}</p>
            <p className={styles["hero-note"]}>{data.heroSecondaryNote}</p>

            <div className={styles["hero-actions"]}>
              <Link href={data.primaryCta.href} className={styles["btn-primary"]}>
                <span>{data.primaryCta.label}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={data.secondaryCta.href} className={styles["btn-secondary"]}>
                <span>{data.secondaryCta.label}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. QUICK FACTS ── */}
        <section className={styles["facts-section"]} aria-label="Local overview facts">
          <div className={styles["facts-grid"]}>
            {data.quickFacts.map((fact) => (
              <div key={fact.label} className={styles["fact-card"]}>
                <p className={styles["fact-label"]}>{fact.label}</p>
                <p className={styles["fact-value"]}>{fact.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. AVAILABLE MESS LISTINGS ── */}
        <section id="listings" className={styles.section}>
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Mess Listings</span>
            <h2 className={styles["section-title"]}>
              {defaultCity ? `Messes in ${defaultCity}` : "Available Messes"}
            </h2>
            <p className={styles["section-desc"]}>
              {defaultCity
                ? `Explore available messes and homely food providers near ${defaultCity}. Open a listing to review its address, food options, meal plans, and contact details.`
                : "Explore available messes and homely food providers. Open a listing to review its address, food options, meal plans, and contact details."}
            </p>
          </div>

          <CityMessGrid messes={initialData} defaultCity={defaultCity} />
        </section>

        {/* ── 4. CHILD DESTINATIONS (FOR HUBS & PARENT CITIES) ── */}
        {hasChildLinks && data.childLinks && (
          <section id="explore-areas" className={styles["section-alt"]}>
            <div className={styles["section-header"]}>
              <span className={styles["section-badge"]}>
                {data.kind === "hub" ? "Cities & Corridors" : "Dedicated Locality Guides"}
              </span>
              <h2 className={styles["section-title"]}>{data.childLinksHeading}</h2>
              {data.childLinksSubheading && (
                <p className={styles["section-desc"]}>{data.childLinksSubheading}</p>
              )}
            </div>

            <div className={styles["links-grid"]}>
              {data.childLinks.map((child) => (
                <Link key={child.href} href={child.href} className={styles["link-card"]}>
                  <div className={styles["link-card-top"]}>
                    {child.tag && <span className={styles["link-card-tag"]}>{child.tag}</span>}
                    <h3 className={styles["link-card-title"]}>{child.title}</h3>
                    <p className={styles["link-card-summary"]}>{child.summary}</p>
                  </div>
                  <span className={styles["link-card-cta"]}>
                    Read area guide
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. NEIGHBORHOOD POCKETS & LANDMARKS ── */}
        <section
          id="area-pockets"
          className={hasChildLinks ? styles.section : styles["section-alt"]}
        >
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Neighborhood Breakdown</span>
            <h2 className={styles["section-title"]}>{data.pocketsHeading}</h2>
            <p className={styles["section-desc"]}>{data.pocketsSubheading}</p>
          </div>

          <div className={styles["pockets-grid"]}>
            {data.pockets.map((pocket) => (
              <div key={pocket.name} className={styles["pocket-card"]}>
                <div className={styles["pocket-header"]}>
                  <h3 className={styles["pocket-title"]}>
                    <MapPin size={17} className={styles["pocket-pin"]} aria-hidden="true" />
                    <span>{pocket.name}</span>
                  </h3>
                  <span className={styles["pocket-landmark"]}>{pocket.landmark}</span>
                </div>
                <p className={styles["pocket-desc"]}>{pocket.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. AUDIENCE & DAILY ROUTINES ── */}
        <section className={hasChildLinks ? styles["section-alt"] : styles.section}>
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Daily Routines</span>
            <h2 className={styles["section-title"]}>{data.audienceHeading}</h2>
            <p className={styles["section-desc"]}>{data.audienceSubheading}</p>
          </div>

          <div className={styles["audience-grid"]}>
            {data.audiences.map((item) => (
              <div key={item.title} className={styles["audience-card"]}>
                <div className={styles["audience-icon"]}>
                  <PersonaIcon name={item.icon} />
                </div>
                <h3 className={styles["audience-title"]}>{item.title}</h3>
                <p className={styles["audience-desc"]}>{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. FOOD CULTURE & SCHEDULE PATTERNS ── */}
        <section className={hasChildLinks ? styles.section : styles["section-alt"]}>
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Food & Schedule Fit</span>
            <h2 className={styles["section-title"]}>{data.mealSectionHeading}</h2>
            <p className={styles["section-desc"]}>{data.mealSectionSubheading}</p>
          </div>

          <div className={styles["meal-grid"]}>
            {data.mealColumns.map((col) => (
              <div key={col.title} className={styles["meal-card"]}>
                <p className={styles["meal-eyebrow"]}>{col.eyebrow}</p>
                <h3 className={styles["meal-title"]}>{col.title}</h3>
                <p className={styles["meal-intro"]}>{col.intro}</p>
                <ul className={styles["meal-list"]}>
                  {col.highlights.map((point) => (
                    <li key={point} className={styles["meal-list-item"]}>
                      <CheckCircle2 size={17} className={styles["meal-check"]} aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. LOCAL VERIFICATION CHECKLIST ── */}
        <section
          id="planning-checklist"
          className={hasChildLinks ? styles["section-alt"] : styles.section}
        >
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Practical Checklist</span>
            <h2 className={styles["section-title"]}>{data.checklistHeading}</h2>
            <p className={styles["section-desc"]}>{data.checklistSubheading}</p>
          </div>

          <div className={styles["checklist-grid"]}>
            {data.checklistItems.map((item, idx) => (
              <div key={item.title} className={styles["checklist-card"]}>
                <span className={styles["checklist-num"]}>{idx + 1}</span>
                <div>
                  <h3 className={styles["checklist-title"]}>{item.title}</h3>
                  <p className={styles["checklist-desc"]}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 9. RELATED GUIDES ── */}
        <section className={hasChildLinks ? styles.section : styles["section-alt"]}>
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Nearby & Regional Links</span>
            <h2 className={styles["section-title"]}>{data.relatedHeading}</h2>
            <p className={styles["section-desc"]}>{data.relatedSubheading}</p>
          </div>

          <div className={styles["links-grid"]}>
            {data.relatedLinks.map((rel) => (
              <Link key={rel.href} href={rel.href} className={styles["link-card"]}>
                <div className={styles["link-card-top"]}>
                  {rel.tag && <span className={styles["link-card-tag"]}>{rel.tag}</span>}
                  <h3 className={styles["link-card-title"]}>{rel.title}</h3>
                  <p className={styles["link-card-summary"]}>{rel.summary}</p>
                </div>
                <span className={styles["link-card-cta"]}>
                  Explore guide
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 10. FAQS ── */}
        <section className={hasChildLinks ? styles["section-alt"] : styles.section}>
          <div className={styles["section-header"]}>
            <span className={styles["section-badge"]}>Questions & Answers</span>
            <h2 className={styles["section-title"]}>{data.faqHeading}</h2>
          </div>

          <div className={styles["faq-list"]}>
            {data.faqs.map((item, idx) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={idx} />
            ))}
          </div>
        </section>

        {/* ── 10. CLOSING CTA ── */}
        <section className={styles["closing-section"]}>
          <div className={styles["closing-inner"]}>
            <h2 className={styles["closing-title"]}>{data.closingHeading}</h2>
            <p className={styles["closing-desc"]}>{data.closingDescription}</p>
            <div className={styles["closing-actions"]}>
              <Link href={data.closingPrimaryCta.href} className={styles["btn-primary"]}>
                <span>{data.closingPrimaryCta.label}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={data.closingSecondaryCta.href} className={styles["btn-secondary"]}>
                <span>{data.closingSecondaryCta.label}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
