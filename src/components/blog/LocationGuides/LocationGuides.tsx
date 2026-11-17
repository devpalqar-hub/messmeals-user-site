import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import type { LocationGuide } from "../../../types/blog";
import styles from "./LocationGuides.module.css";

interface LocationGuidesProps {
  locations: LocationGuide[];
}

export default function LocationGuides({ locations }: LocationGuidesProps) {
  return (
    <section
      id="location-guides"
      className={styles.section}
      aria-labelledby="location-guides-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>
            <Compass size={13} aria-hidden="true" />
            <span>KERALA MESS DIRECTORY</span>
          </div>
          <h2 id="location-guides-heading" className={styles.sectionTitle}>
            Explore Mess Guides by Location
          </h2>
          <p className={styles.sectionDesc}>
            Discover messes, homely dining arrangements, and daily or monthly
            meal plans across key Kerala cities. Each guide links directly to
            live listings and provider menus.
          </p>
        </div>

        <div className={styles.grid}>
          {locations.map((loc) => (
            <article key={loc.slug} className={styles.card}>
              {/* Visual Banner */}
              <div className={styles.cardVisual}>
                {loc.image ? (
                  <Image
                    src={loc.image}
                    alt={loc.imageAlt || `${loc.name} food & mess guide`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"
                    className={styles.cardVisualImage}
                  />
                ) : (
                  <>
                    <div className={styles.cardVisualPattern} />
                    <div className={styles.cardVisualIconWrap}>
                      <MapPin size={26} strokeWidth={2.2} />
                    </div>
                  </>
                )}
                <span className={styles.cardTag}>{loc.tag}</span>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardTitleRow}>
                  <h3 className={styles.cardTitle}>{loc.name}</h3>
                  {loc.altName && (
                    <span className={styles.cardAltName}>({loc.altName})</span>
                  )}
                </div>

                <p className={styles.cardDescription}>{loc.description}</p>

                {loc.popularAreas && loc.popularAreas.length > 0 && (
                  <>
                    <span className={styles.areasLabel}>Popular Localities</span>
                    <div className={styles.areasList}>
                      {loc.popularAreas.map((area) => (
                        <span key={area} className={styles.areaPill}>
                          {area}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <Link href={loc.href} className={styles.exploreBtn}>
                  Explore Messes in {loc.name}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

