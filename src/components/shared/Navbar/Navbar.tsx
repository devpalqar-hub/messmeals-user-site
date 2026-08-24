import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User, Utensils } from "lucide-react";
import styles from "./Navbar.module.css";
import ListMessModal from "../../ui/ListMessModal/ListMessModal";
import { useAuth } from "../../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/view-all-listings", label: "Listings", end: false },
  { to: "/about", label: "About Us", end: false },
  { to: "/blog", label: "Blog", end: false },
];

export default function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });
  const navCenterRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const closeNavbar = () => setIsNavbarOpen(false);

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
    // small delay to let NavLink apply .active class
    const t = setTimeout(restoreToActive, 30);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <header className={styles["navbar-wrapper"]}>
        <nav className={styles.navbar}>

          {/* LEFT — Logo */}
          <div className={styles["navbar-left"]} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className={styles["logo-box"]}>
              <Utensils className={styles["logo-icon"]} size={20} />
            </div>
            <span className={styles["logo-text"]}>MESS MEALS</span>
          </div>

          {/* CENTER — Nav links (desktop) */}
          <div
            className={styles["navbar-center"]}
            ref={navCenterRef}
            onMouseLeave={restoreToActive}
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["nav-link"]} ${styles.active}`
                    : styles["nav-link"]
                }
                onClick={closeNavbar}
                onMouseEnter={(e) => moveUnderlineTo(e.currentTarget)}
              >
                {label}
              </NavLink>
            ))}
            <span
              className={styles["nav-underline"]}
              style={{ left: underline.left, width: underline.width, opacity: underline.opacity }}
            />
          </div>

          {/* RIGHT — CTA */}
          <div className={styles["navbar-right"]}>
            <button className={styles["cta-btn"]} onClick={() => setIsModalOpen(true)}>
              List Your Mess
            </button>
            {isAuthenticated ? (
              <button className={styles["profile-chip"]} onClick={() => navigate("/profile")}>
                <User size={15} />
                {user?.name || "My Account"}
              </button>
            ) : (
              <button className={styles["signin-btn"]} onClick={() => navigate("/login")}>
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className={styles["navbar-toggler"]}
            aria-label="Toggle navigation"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* MOBILE DROPDOWN */}
        {isNavbarOpen && (
          <div className={styles["mobile-menu"]}>
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles["mobile-nav-link"]} ${styles.active}`
                    : styles["mobile-nav-link"]
                }
                onClick={closeNavbar}
              >
                {label}
              </NavLink>
            ))}
            <button
              className={`${styles["cta-btn"]} ${styles["mobile-cta"]}`}
              onClick={() => { setIsModalOpen(true); closeNavbar(); }}
            >
              List Your Mess
            </button>
            {isAuthenticated ? (
              <button
                className={`${styles["signin-btn"]} ${styles["mobile-signin"]}`}
                onClick={() => { navigate("/profile"); closeNavbar(); }}
              >
                My Account
              </button>
            ) : (
              <button
                className={`${styles["signin-btn"]} ${styles["mobile-signin"]}`}
                onClick={() => { navigate("/login"); closeNavbar(); }}
              >
                Sign In
              </button>
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
