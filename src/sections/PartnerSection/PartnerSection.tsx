"use client";

import styles from './PartnerSection.module.css';
import {
  Smartphone,
  Store,
  FileText,
  Users,
  Handshake,
  BarChart2,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  {
    icon: <Store size={18} />,
    title: "List Your Mess",
    desc: "Create your profile and reach more hungry customers."
  },
  {
    icon: <FileText size={18} />,
    title: "Manage Menus",
    desc: "Update menus and plans with ease."
  },
  {
    icon: <Users size={18} />,
    title: "Track Orders",
    desc: "View and manage customer orders in real time."
  },
  {
    icon: <Handshake size={18} />,
    title: "Manage Partners",
    desc: "Add delivery partners and serve more areas."
  },
  {
    icon: <BarChart2 size={18} />,
    title: "Business Insights",
    desc: "Track revenue and performance."
  },
  {
    icon: <Settings size={18} />,
    title: "All in One Place",
    desc: "Simple, powerful and built for mess owners."
  }
];

export default function PartnerSection() {
  const router = useRouter();

  return (
    <section className={styles["partner-section"]}>
      <div className={styles["partner-container"]}>

        {/* LEFT COLUMN */}
        <div className={styles["partner-left"]}>

          <div className={styles["partner-badge"]}>
            <Smartphone size={16} />
            <span>For Mess Owners & Managers</span>
          </div>

          <h2 className={styles["partner-title"]}>
            Run Your Mess<br />
            Smarter with <span>MessMeals</span>
          </h2>

          <p className={styles["partner-subtitle"]}>
            List your mess, manage menus, track orders, partners and deliveries — everything you need to grow your business in one place.
          </p>

          <div className={styles["partner-features"]}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles["feature-card"]}>
                <div className={styles["feature-icon-wrapper"]}>
                  {feature.icon}
                </div>
                <h3 className={styles["feature-title"]}>{feature.title}</h3>
                <p className={styles["feature-desc"]}>{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles["partner-cta-area"]}>
            <button
              className={styles["partner-btn"]}
              onClick={() => router.push("/partner")}
            >
              Know More
              <ArrowRight size={18} />
            </button>
            <div className={styles["partner-divider"]} />
            <p className={styles["partner-cta-text"]}>
              Empowering mess owners to serve better, everyday.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles["partner-right"]}>
          <div className={styles["circle-bg"]} />

          {/* Decorations */}
          <div className={styles["decoration-sparks"]}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12L4 4" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 10L18 2" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30 14L38 8" stroke="#55C500" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className={styles["decoration-text-top"]}>
            <span>Manage<br />Menus Easily</span>
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles["curved-arrow-top"]}>
              <path d="M20 4C24 16 20 28 8 36" stroke="#55C500" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 36L14 34" stroke="#55C500" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 36L10 28" stroke="#55C500" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <img
            src="/messappmock.png"
            alt="MessMeals Partner App Mockup"
            className={styles["mockup-image"]}
          />
        </div>
      </div>
    </section>
  );
}
