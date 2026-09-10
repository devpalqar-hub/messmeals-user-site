"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound, House, Utensils, LucideInfo, BookOpen } from "lucide-react";
import styles from "./Navbar.module.css";
import ListMessModal from "../../ui/ListMessModal/ListMessModal";
import { useAuth } from "../../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, Icon: House },
  { to: "/messes", label: "Messes", end: false, Icon: Utensils },
  { to: "/about", label: "About Us", end: false, Icon: LucideInfo },
  { to: "/blog", label: "Blog", end: false, Icon: BookOpen },
];

// Replaces react-router-dom's <NavLink> `end` matching semantics: `end` true
// requires an exact match, otherwise match the path itself or any sub-path.
function isLinkActive(pathname: string, to: string, end: boolean) {
  return end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

export default function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });
  const navCenterRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const headerRef = useRef<HTMLElement>(null);

  const closeNavbar = () => setIsNavbarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNavbarOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);

  const moveUnderlineTo = (el: HTMLElement) => {
    if (!navCenterRef.current) return;
    const navRect = navCenterRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setUnderline({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
  };

  const restoreToActive = () => {
    if (!navCenterRef.current) return;
    const activeEl = navCenterRef.current.querySelector<HTMLElement>(
      `.${styles["nav-link"]}.${styles.active}`
    );
    if (activeEl) moveUnderlineTo(activeEl);
    else setUnderline((u) => ({ ...u, opacity: 0 }));
  };

  useEffect(() => {
    // small delay to let the active class apply
    const t = setTimeout(restoreToActive, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <header className={styles["navbar-wrapper"]} ref={headerRef}>
        <nav className={styles.navbar}>

          {/* LEFT â€” Logo */}
          <div className={styles["navbar-left"]} onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <img src="/logo.png" alt="MessMeals Home" className={styles["logo-image"]} />
          </div>

          {/* CENTER â€” Nav links (desktop) */}
          <div
            className={styles["navbar-center"]}
            ref={navCenterRef}
            onMouseLeave={restoreToActive}
          >
            {NAV_LINKS.map(({ to, label, end }) => {
              const active = isLinkActive(pathname, to, end);
              return (
                <Link
                  key={to}
                  href={to}
                  className={active ? `${styles["nav-link"]} ${styles.active}` : styles["nav-link"]}
                  onClick={closeNavbar}
                  onMouseEnter={(e) => moveUnderlineTo(e.currentTarget)}
                >
                  {label}
                </Link>
              );
            })}
            <span
              className={styles["nav-underline"]}
              style={{ left: underline.left, width: underline.width, opacity: underline.opacity }}
            />
          </div>

          {/* RIGHT â€” CTA */}
          <div className={styles["navbar-right"]}>
            <button className={styles["cta-btn"]} onClick={() => router.push("/mess-manager")}>
              List Your Mess
            </button>
            {isAuthenticated ? (
              <Link className={styles["profile-chip"]} href="/profile">
                <UserRound size={15} />
                {user?.name || "My Account"}
              </Link>
            ) : (
              <Link className={styles["signin-btn"]} href="/login">
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className={styles["navbar-toggler"]}
            aria-label="Toggle navigation"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? "âœ•" : "â˜°"}
          </button>
        </nav>

        {/* MOBILE DROPDOWN */}
        {isNavbarOpen && (
          <div className={styles["mobile-menu"]}>
            {NAV_LINKS.map(({ to, label, end, Icon }) => {
              const active = isLinkActive(pathname, to, end);
              return (
                <Link
                  key={to}
                  href={to}
                  className={active ? `${styles["mobile-nav-link"]} ${styles.active}` : styles["mobile-nav-link"]}
                  onClick={closeNavbar}
                >
                  <Icon size={18} className={styles["nav-icon"]} />
                  {label}
                </Link>
              );
            })}
            <button
              className={`${styles["cta-btn"]} ${styles["mobile-cta"]}`}
              onClick={() => { router.push("/mess-manager"); closeNavbar(); }}
            >
              List Your Mess
            </button>
            {isAuthenticated ? (
              <Link
                className={`${styles["signin-btn"]} ${styles["mobile-signin"]}`}
                href="/profile"
                onClick={closeNavbar}
              >
                My Account
              </Link>
            ) : (
              <Link
                className={`${styles["signin-btn"]} ${styles["mobile-signin"]}`}
                href="/login"
                onClick={closeNavbar}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* MODAL */}
      <ListMessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

