import { useNavigate } from "react-router-dom";
import styles from "./BookingCancel.module.css";

export default function BookingCancel() {
  const navigate = useNavigate();

  return (
    <div className={styles["bc-page"]}>
      {/* Background blobs */}
      <div className={styles["bc-blob-1"]} />
      <div className={styles["bc-blob-2"]} />

      <div className={styles["bc-card"]}>

        {/* Animated X icon */}
        <div className={styles["bc-icon-wrap"]}>
          <div className={styles["bc-ring"]} />
          <svg
            className={styles["bc-icon"]}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="26" cy="26" r="25" stroke="#e05c5c" strokeWidth="2" opacity="0.5" />
            <path
              className={styles["bc-xmark"]}
              d="M18 18L34 34M34 18L18 34"
              stroke="#e05c5c"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={styles["bc-content"]}>
          <h1>Payment Cancelled</h1>
          <p className={styles["bc-subtitle"]}>
            No worries — your payment was not charged. You can try again whenever you're ready.
          </p>

          <div className={styles["bc-tips"]}>
            <div className={styles["bc-tip"]}>
              <span>💳</span>
              <span>Make sure your card details are correct</span>
            </div>
            <div className={styles["bc-tip"]}>
              <span>📶</span>
              <span>Check your internet connection</span>
            </div>
            <div className={styles["bc-tip"]}>
              <span>🔒</span>
              <span>Ensure your bank hasn't blocked the transaction</span>
            </div>
          </div>

          <div className={styles["bc-actions"]}>
            <button
              className={styles["bc-primary-btn"]}
              onClick={() => navigate(-1 as any)}
            >
              ← Try Again
            </button>
            <button
              className={styles["bc-secondary-btn"]}
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
