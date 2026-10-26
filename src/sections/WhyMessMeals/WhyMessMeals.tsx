"use client";

import styles from "./WhyMessMeals.module.css";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WhyMessMeals() {
  const router = useRouter();

  return (
    <section className={styles["why-section"]} id="why-messmeals">
      <div className={styles["why-container"]}>

        {/* LEFT: Text Content */}
        <div className={styles["why-left"]}>

          <h2 className={styles["why-title"]}>
            What Is <span className={styles["why-brand"]}>MessMeals</span> All About?
          </h2>

          <p className={styles["why-desc"]}>
            MessMeals is a site where you can search for daily meal plans and local messes. Search by city or locality to find daily or monthly plans in nearby messes, and compare the meal preferences and costs. Whether you&apos;re a student, working professional, or living away from home, MessMeals helps you find reliable homely cuisine without the hassle of searching multiple places.
          </p>

          <button
            id="why-browse-messes-btn"
            className={styles["why-btn"]}
            onClick={() => router.push("/messes")}
          >
            Browse the available messes
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>

        {/* RIGHT: Image */}
        <div className={styles["why-right"]}>
          <Image
            src="/whybg.png"
            alt="Homely Meals Always – Indian thali with rice, curries and vegetables"
            width={720}
            height={540}
            className={styles["why-image"]}
            priority={false}
          />
        </div>

      </div>
    </section>
  );
}
