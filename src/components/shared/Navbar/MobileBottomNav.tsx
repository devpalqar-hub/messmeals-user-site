"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, ListChecks, CalendarCheck2, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./MobileBottomNav.module.css";

function isLinkActive(pathname: string, to: string, end: boolean) {
  return end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  // "My Plans" is active when on /profile with tab=plans
  const isMyPlansActive =
    pathname === "/profile" && searchParams.get("tab") === "plans";

  const handleMyPlans = () => {
    if (isAuthenticated) {
      router.push("/profile?tab=plans");
    } else {
      router.push(`/login?redirectTo=${encodeURIComponent("/profile?tab=plans")}`);
    }
  };

  return (
    <nav className={styles["mobile-bottom-nav"]}>
      <Link
        href="/"
        className={
          isLinkActive(pathname, "/", true)
            ? `${styles["mbn-item"]} ${styles.active}`
            : styles["mbn-item"]
        }
      >
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link
        href="/view-all-listings"
        className={
          isLinkActive(pathname, "/view-all-listings", false)
            ? `${styles["mbn-item"]} ${styles.active}`
            : styles["mbn-item"]
        }
      >
        <ListChecks size={20} />
        <span>Messes</span>
      </Link>

      <button
        className={`${styles["mbn-item"]} ${isMyPlansActive ? styles.active : ""}`}
        onClick={handleMyPlans}
      >
        <CalendarCheck2 size={20} />
        <span>My Plans</span>
      </button>

      <button
        className={`${styles["mbn-item"]} ${pathname === "/profile" && !isMyPlansActive ? styles.active : ""
          }`}
        onClick={() => router.push(isAuthenticated ? "/profile" : "/login")}
      >
        <User size={20} />
        <span>{isAuthenticated ? "Profile" : "Sign In"}</span>
      </button>
    </nav>
  );
}
