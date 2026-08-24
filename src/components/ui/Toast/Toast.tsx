import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { ToastMessage } from "../../../context/ToastContext";
import styles from "./Toast.module.css";

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const { type, message } = toast;

  const Icon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className={`${styles["toast-icon"]} ${styles["success-icon"]}`} />;
      case "error":
        return <AlertCircle size={20} className={`${styles["toast-icon"]} ${styles["error-icon"]}`} />;
      case "warning":
        return <AlertTriangle size={20} className={`${styles["toast-icon"]} ${styles["warning-icon"]}`} />;
      case "info":
        return <Info size={20} className={`${styles["toast-icon"]} ${styles["info-icon"]}`} />;
    }
  };

  return (
    <div className={`${styles["toast-item"]} ${styles["toast-" + type] || ""}`}>
      <div className={styles["toast-content"]}>
        <Icon />
        <span className={styles["toast-message"]}>{message}</span>
        <button className={styles["toast-close"]} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div className={`${styles["toast-progress"]} ${styles["toast-progress-" + type]}`} />
    </div>
  );
}
