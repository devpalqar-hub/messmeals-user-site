import { useNavigate } from "react-router-dom";
import { Truck, UserCircle, PartyPopper } from "lucide-react";
import styles from "./BookingSuccess.module.css";

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className={styles["bs-page"]}>
      {/* Background blobs */}
      <div className={styles["bs-blob-1"]} />
      <div className={styles["bs-blob-2"]} />

      <div className={styles["bs-card"]}>

        {/* Animated checkmark */}
        <div className={styles["bs-icon-wrap"]}>
          <div className={styles["bs-ring"]} />
          <svg
            className={styles["bs-check"]}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="26" cy="26" r="25" stroke="#4cd00f" strokeWidth="2" />
            <path
              className={styles["bs-checkmark"]}
              d="M14 26L22 34L38 18"
              stroke="#4cd00f"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles["bs-content"]}>
          <h1>Payment Successful!</h1>
          <p className={styles["bs-subtitle"]}>
            Your meal subscription is now <strong>confirmed</strong>. Sit back and
            let the food come to you! <PartyPopper size={16} style={{ display: "inline", verticalAlign: "middle", color: "#f59e0b" }} />
          </p>

          <div className={styles["bs-info-cards"]}>
            <div className={styles["bs-info-card"]}>
              <Truck size={22} className={styles["bs-info-icon"]} />
              <span>Deliveries will start on your scheduled date</span>
            </div>
            <div className={styles["bs-info-card"]}>
              <UserCircle size={22} className={styles["bs-info-icon"]} />
              <span>Track and manage from your profile</span>
            </div>
          </div>

          <div className={styles["bs-actions"]}>
            <button
              className={styles["bs-primary-btn"]}
              onClick={() => navigate("/profile")}
            >
              View My Plans
            </button>
            <button
              className={styles["bs-secondary-btn"]}
              onClick={() => navigate("/")}
            >
              Browse More Mess
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
