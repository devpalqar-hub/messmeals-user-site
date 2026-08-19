import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import "./Navbar.css";
import ListMessModal from "../ListMessModal/ListMessModal";
import { useAuth } from "../context/AuthContext";

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
    const activeEl = navCenterRef.current.querySelector<HTMLElement>(".nav-link.active");
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
      <header className="navbar-wrapper">
        <nav className="navbar">

          {/* LEFT — Logo */}
          <div className="navbar-left">
            <div className="logo-box">
              <span className="logo-icon">🍽️</span>
            </div>
            <span className="logo-text">MESS MEALS</span>
          </div>

          {/* CENTER — Nav links (desktop) */}
          <div
            className="navbar-center"
            ref={navCenterRef}
            onMouseLeave={restoreToActive}
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="nav-link"
                onClick={closeNavbar}
                onMouseEnter={(e) => moveUnderlineTo(e.currentTarget)}
              >
                {label}
              </NavLink>
            ))}
            <span
              className="nav-underline"
              style={{ left: underline.left, width: underline.width, opacity: underline.opacity }}
            />
          </div>

          {/* RIGHT — CTA */}
          <div className="navbar-right">
            <button className="cta-btn" onClick={() => setIsModalOpen(true)}>
              List Your Mess
            </button>
            {isAuthenticated ? (
              <button className="profile-chip" onClick={() => navigate("/profile")}>
                <User size={15} />
                {user?.name || "My Account"}
              </button>
            ) : (
              <button className="signin-btn" onClick={() => navigate("/login")}>
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggler"
            aria-label="Toggle navigation"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          >
            {isNavbarOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* MOBILE DROPDOWN */}
        {isNavbarOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="mobile-nav-link"
                onClick={closeNavbar}
              >
                {label}
              </NavLink>
            ))}
            <button
              className="cta-btn mobile-cta"
              onClick={() => { setIsModalOpen(true); closeNavbar(); }}
            >
              List Your Mess
            </button>
            {isAuthenticated ? (
              <button
                className="signin-btn mobile-signin"
                onClick={() => { navigate("/profile"); closeNavbar(); }}
              >
                My Account
              </button>
            ) : (
              <button
                className="signin-btn mobile-signin"
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
