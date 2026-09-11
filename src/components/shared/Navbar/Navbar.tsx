"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound, House, Utensils, LucideInfo, BookOpen, Menu, X, ChevronRight, Plus, ArrowRight } from "lucide-react";
import styles from "./Navbar.module.css";
import ListMessModal from "../../ui/ListMessModal/ListMessModal";
import { useAuth } from "../../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, Icon: House },
  { to: "/messes", label: "Messes", end: false, Icon: Utensils },
  { to: "/about", label: "About Us", end: false, Icon: LucideInfo },
  { to: "/blog", label: "Blog", end: false, Icon: BookOpen },
];

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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeNavbar = () => setIsNavbarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideHeader = headerRef.current?.contains(target);
      const insideMenu = mobileMenuRef.current?.contains(target);
      if (isNavbarOpen && !insideHeader && !insideMenu) {
        setIsNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);

  // Lock body scroll while sidebar is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isNavbarOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
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
    const t = setTimeout(restoreToActive, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <header className={styles["navbar-wrapper"]} ref={headerRef}>
        <nav className={styles.navbar}>

          {/* LEFT — Logo */}
          <div className={styles["navbar-left"]} onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <img src="/logo.png" alt="MessMeals Home" className={styles["logo-image"]} />
          </div>

          {/* CENTER — Nav links (desktop) */}
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

          {/* RIGHT — CTA */}
          <div className={styles["navbar-right"]}>
            <button className={styles["cta-btn"]} onClick={() => router.push("/mess-manager")}>
              List Your Mess
            </button>
            {isAuthenticated ? (
              <Link className={styles["profile-chip"]} href="/profile">
                <span className={styles["profile-avatar"]}>
                  <UserRound size={16} strokeWidth={2} />
                </span>
                <span className={styles["profile-name"]}>{user?.name || "My Account"}</span>
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
            aria-expanded={isNavbarOpen}
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* BACKDROP */}
      {isNavbarOpen && (
        <div
          className={styles["mobile-backdrop"]}
          onClick={closeNavbar}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR DRAWER */}
      <div
        className={`${styles["mobile-menu"]} ${isNavbarOpen ? styles["mobile-menu--open"] : ""}`}
        ref={mobileMenuRef}
        aria-hidden={!isNavbarOpen}
      >
        {/* Sidebar header */}
        <div className={styles["sidebar-header"]}>
          <img src="/logo.png" alt="MessMeals" className={styles["sidebar-logo"]} />
          <button
            className={styles["sidebar-close"]}
            onClick={closeNavbar}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Nav links */}
        <nav className={styles["sidebar-nav"]} aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, end, Icon }) => {
            const active = isLinkActive(pathname, to, end);
            return (
              <Link
                key={to}
                href={to}
                className={active ? `${styles["mobile-nav-link"]} ${styles.active}` : styles["mobile-nav-link"]}
                onClick={closeNavbar}
              >
                <span className={styles["mobile-nav-icon"]}>
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className={styles["mobile-nav-label"]}>{label}</span>
                <ChevronRight size={16} strokeWidth={2} className={styles["mobile-nav-chevron"]} />
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className={styles["sidebar-footer"]}>
          <button
            className={styles["sidebar-cta"]}
            onClick={() => { router.push("/mess-manager"); closeNavbar(); }}
          >
            <Plus size={16} strokeWidth={2.5} />
            List Your Mess
            <ArrowRight size={16} strokeWidth={2} className={styles["sidebar-cta-arrow"]} />
          </button>

          {/* Account row */}
          {isAuthenticated ? (
            <Link
              className={styles["sidebar-account"]}
              href="/profile"
              onClick={closeNavbar}
            >
              <span className={styles["sidebar-account-avatar"]}>
                <UserRound size={18} strokeWidth={2} />
              </span>
              <span className={styles["sidebar-account-text"]}>
                <span className={styles["sidebar-account-name"]}>{user?.name || "My Account"}</span>
                <span className={styles["sidebar-account-sub"]}>View and manage your account</span>
              </span>
              <ChevronRight size={16} strokeWidth={2} className={styles["sidebar-account-chevron"]} />
            </Link>
          ) : (
            <Link
              className={styles["sidebar-account"]}
              href="/login"
              onClick={closeNavbar}
            >
              <span className={styles["sidebar-account-avatar"]}>
                <UserRound size={18} strokeWidth={2} />
              </span>
              <span className={styles["sidebar-account-text"]}>
                <span className={styles["sidebar-account-name"]}>Sign In</span>
                <span className={styles["sidebar-account-sub"]}>Access your account</span>
              </span>
              <ChevronRight size={16} strokeWidth={2} className={styles["sidebar-account-chevron"]} />
            </Link>
          )}
        </div>
      </div>

      {/* MODAL */}
      <ListMessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
