"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Utensils, LucideInfo, ClipboardList } from "lucide-react";
// import { useAuth } from "../../../context/AuthContext";
import styles from "./MobileBottomNav.module.css";

function isLinkActive(pathname: string, to: string, end: boolean) {
  return end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

export default function MobileBottomNav() {
  // const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const { isAuthenticated } = useAuth();

  // const isMyPlansActive =
  //   pathname === "/profile" && searchParams.get("tab") === "plans";

  // const handleMyPlans = () => {
  //   if (isAuthenticated) {
  //     router.push("/profile?tab=plans");
  //   } else {
  //     router.push(`/login?redirectTo=${encodeURIComponent("/profile?tab=plans")}`);
  //   }
  // };

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
        <House size={20} />
        <span>Home</span>
      </Link>

      <Link
        href="/messes"
        className={
          isLinkActive(pathname, "/messes", false)
            ? `${styles["mbn-item"]} ${styles.active}`
            : styles["mbn-item"]
        }
      >
        <Utensils size={20} />
        <span>Messes</span>
      </Link>

      <Link
        href="/about"
        className={
          isLinkActive(pathname, "/about", false)
            ? `${styles["mbn-item"]} ${styles.active}`
            : styles["mbn-item"]
        }
      >
        <LucideInfo size={20} />
        <span>About</span>
      </Link>

      <Link
        href="/mess-manager"
        className={
          isLinkActive(pathname, "/mess-manager", false)
            ? `${styles["mbn-item"]} ${styles.active}`
            : styles["mbn-item"]
        }
      >
        <ClipboardList size={20} />
        <span>List Mess</span>
      </Link>

      {/* MY PLANS & PROFILE / SIGN IN — hidden while login flow is disabled, uncomment to re-enable
      <button
        className={`${styles["mbn-item"]} ${isMyPlansActive ? styles.active : ""}`}
        onClick={handleMyPlans}
      >
        <CalendarCheck size={20} />
        <span>My Plans</span>
      </button>

      <button
        className={`${styles["mbn-item"]} ${pathname === "/profile" && !isMyPlansActive ? styles.active : ""
          }`}
        onClick={() => router.push(isAuthenticated ? "/profile" : "/login")}
      >
        <UserRound size={20} />
        <span>{isAuthenticated ? "Profile" : "Sign In"}</span>
      </button>
      */}
    </nav>
  );
}
