import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, ListChecks, CalendarCheck2, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // "My Plans" is active when on /profile with tab=plans
  const isMyPlansActive =
    location.pathname === "/profile" &&
    new URLSearchParams(location.search).get("tab") === "plans";

  const handleMyPlans = () => {
    if (isAuthenticated) {
      navigate("/profile?tab=plans");
    } else {
      navigate("/login", { state: { redirectTo: "/profile?tab=plans" } });
    }
  };

  return (
    <nav className={styles["mobile-bottom-nav"]}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? `${styles["mbn-item"]} ${styles.active}` : styles["mbn-item"]
        }
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/view-all-listings"
        className={({ isActive }) =>
          isActive ? `${styles["mbn-item"]} ${styles.active}` : styles["mbn-item"]
        }
      >
        <ListChecks size={20} />
        <span>Listings</span>
      </NavLink>

      <button
        className={`${styles["mbn-item"]} ${isMyPlansActive ? styles.active : ""}`}
        onClick={handleMyPlans}
      >
        <CalendarCheck2 size={20} />
        <span>My Plans</span>
      </button>

      <button
        className={`${styles["mbn-item"]} ${
          location.pathname === "/profile" && !isMyPlansActive ? styles.active : ""
        }`}
        onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
      >
        <User size={20} />
        <span>{isAuthenticated ? "Profile" : "Sign In"}</span>
      </button>
    </nav>
  );
}
