import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import styles from "./LocationHubs.module.css";

const REGION_HUBS = [
  {
    title: "Kerala Mess Guides",
    href: "/kerala",
    description:
      "City and tech-corridor guides across Kerala, paired with live MessMeals directory listings in Ernakulam and Thiruvananthapuram.",
    links: [
      { label: "Ernakulam & Kochi", href: "/kerala/ernakulam" },
      { label: "Thiruvananthapuram", href: "/kerala/thiruvananthapuram" },
      { label: "Kozhikode", href: "/kerala/kozhikode" },
      { label: "Thrissur", href: "/kerala/thrissur" },
      { label: "Kannur", href: "/kerala/kannur" },
    ],
    cta: "Explore Kerala mess guides",
  },
  {
    title: "UAE Meal & Mess Guides",
    href: "/uae",
    description:
      "Informational area guides across the Emirates for comparing daily mess formats, tiffins, and neighborhood logistics (no live UAE directory listings yet).",
    links: [
      { label: "Dubai", href: "/uae/dubai" },
      { label: "Sharjah", href: "/uae/sharjah" },
      { label: "Abu Dhabi", href: "/uae/abu-dhabi" },
      { label: "Karama", href: "/uae/dubai/karama" },
      { label: "Musaffah", href: "/uae/abu-dhabi/musaffah" },
    ],
    cta: "Explore UAE meal guides",
  },
  {
    title: "Bangalore Locality Guides",
    href: "/bangalore",
    description:
      "Informational PG, co-living, and IT-corridor meal guides across Bengaluru neighborhoods; live directory listings are not yet active in Bangalore.",
    links: [
      { label: "Electronic City", href: "/bangalore/electronic-city" },
      { label: "Whitefield", href: "/bangalore/whitefield" },
      { label: "BTM Layout", href: "/bangalore/btm-layout" },
      { label: "Koramangala", href: "/bangalore/koramangala" },
      { label: "Manyata", href: "/bangalore/manyata" },
    ],
    cta: "Explore Bangalore meal guides",
  },
  {
    title: "Qatar Meal & Mess Guides",
    href: "/qatar",
    description:
      "Informational city and Doha neighborhood guides covering meal plans, Metro access, and commuter areas across Qatar (live listings not yet active).",
    links: [
      { label: "Doha", href: "/qatar/doha" },
      { label: "Najma", href: "/qatar/doha/najma" },
      { label: "Old Airport", href: "/qatar/doha/old-airport" },
      { label: "Mansoura", href: "/qatar/doha/mansoura" },
      { label: "Al Wakrah", href: "/qatar/al-wakrah" },
    ],
    cta: "Explore Qatar meal guides",
  },
];

export default function LocationHubs() {
  return (
    <section className={styles["hubs-section"]} aria-label="Explore Location Guides">
      <div className={styles["hubs-header"]}>
        <div className={styles["hubs-badge"]}>
          <span className={styles["hubs-badge-line"]} />
          <span>LOCATION GUIDES</span>
          <span className={styles["hubs-badge-line"]} />
        </div>
        <h2 className={styles["hubs-title"]}>
          Discover Daily Mess &amp; Meal Guides by{" "}
          <span className={styles["hubs-accent"]}>Location</span>
        </h2>
        <p className={styles["hubs-subtitle"]}>
          Compare how daily messes, monthly meal plans, and tiffin routines work across Kerala, UAE, Bangalore, and Qatar. Live MessMeals provider listings currently cover Ernakulam and Thiruvananthapuram.
        </p>
      </div>

      <div className={styles["hubs-grid"]}>
        {REGION_HUBS.map((hub) => (
          <div key={hub.href} className={styles["hub-card"]}>
            <div>
              <Link href={hub.href} className={styles["hub-region-link"]}>
                <MapPin size={18} className={styles["hub-icon"]} aria-hidden="true" />
                <span>{hub.title}</span>
              </Link>
              <p className={styles["hub-desc"]}>{hub.description}</p>
              <div className={styles["hub-pills"]}>
                {hub.links.map((item) => (
                  <Link key={item.href} href={item.href} className={styles["hub-pill"]}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href={hub.href} className={styles["hub-footer-link"]}>
              <span>{hub.cta}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
