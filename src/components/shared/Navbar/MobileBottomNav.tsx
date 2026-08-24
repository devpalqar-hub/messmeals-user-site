import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ListChecks, PlusCircle, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import ListMessModal from "../../ui/ListMessModal/ListMessModal";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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

        <button className={`${styles["mbn-item"]} ${styles["mbn-fab"]}`} onClick={() => setIsModalOpen(true)}>
          <span className={styles["mbn-fab-icon"]}>
            <PlusCircle size={22} />
          </span>
          <span>List Mess</span>
        </button>

        <button
          className={styles["mbn-item"]}
          onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
        >
          <User size={20} />
          <span>{isAuthenticated ? "Profile" : "Sign In"}</span>
        </button>
      </nav>

      <ListMessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
