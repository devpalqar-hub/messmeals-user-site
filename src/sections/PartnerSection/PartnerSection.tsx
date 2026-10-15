"use client";

import styles from "./PartnerSection.module.css";
import {
  Smartphone,
  FileText,
  Handshake,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import {
  Store,
  Users,
  Settings,
} from "../../components/ui/SvgIcon/SvgIcon";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: <Store size={18} />,
    title: "List Your Mess Online",
    desc: "Create your mess profile and help customers discover your meal plans.",
  },
  {
    icon: <FileText size={18} />,
    title: "Manage Menus & Plans",
    desc: "Keep your menus, meal options, and plans up to date.",
  },
  {
    icon: <Users size={18} />,
    title: "Track Customer Orders",
    desc: "View customer orders and keep daily operations organized.",
  },
  {
    icon: <Handshake size={18} />,
    title: "Coordinate Deliveries",
    desc: "Add delivery partners and manage your delivery operations.",
  },
  {
    icon: <BarChart2 size={18} />,
    title: "Monitor Your Business",
    desc: "Review revenue and key business activity from your dashboard.",
  },
  {
    icon: <Settings size={18} />,
    title: "Manage It All in One App",
    desc: "Simplify everyday mess management with one convenient app.",
  },
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
            <span>Built for Mess Owners & Managers</span>
          </div>

          <h2 className={styles["partner-title"]}>
            Your Mess Manager App
            <br />
            Made Simple with <span>MessMeals</span>
          </h2>

          <p className={styles["partner-subtitle"]}>
            Looking for a simple mess manager app? MessMeals helps you list
            your mess, manage menus and meal plans, track customer orders,
            coordinate deliveries, and monitor your business performance —
            all in one place.
          </p>

          <div className={styles["partner-features"]}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles["feature-card"]}>
                <div className={styles["feature-icon-wrapper"]}>
                  {feature.icon}
                </div>

                <div className={styles["feature-text"]}>
                  <h3 className={styles["feature-title"]}>
                    {feature.title}
                  </h3>

                  <p className={styles["feature-desc"]}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles["partner-cta-area"]}>
            <button
              type="button"
              className={styles["partner-btn"]}
              onClick={() => router.push("/mess-manager")}
              aria-label="Explore the MessMeals mess manager app"
            >
              Explore Features
              <ArrowRight size={18} />
            </button>

            <div className={styles["partner-divider"]} />

            <p className={styles["partner-cta-text"]}>
              Less time managing tasks. More time serving your customers.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles["partner-right"]}>
          <div className={styles["circle-bg"]} />

          {/* Decorations */}
          <div className={styles["decoration-sparks"]}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 12L4 4"
                stroke="#55C500"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M22 10L18 2"
                stroke="#55C500"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M30 14L38 8"
                stroke="#55C500"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className={styles["decoration-text-top"]}>
            <span>
              Manage
              <br />
              Menus Easily
            </span>

            <svg
              width="30"
              height="40"
              viewBox="0 0 30 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["curved-arrow-top"]}
              aria-hidden="true"
            >
              <path
                d="M20 4C24 16 20 28 8 36"
                stroke="#55C500"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 36L14 34"
                stroke="#55C500"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 36L10 28"
                stroke="#55C500"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <img
            src="/messappmock.png"
            alt="MessMeals mess manager app for managing menus and customer orders"
            className={styles["mockup-image"]}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}