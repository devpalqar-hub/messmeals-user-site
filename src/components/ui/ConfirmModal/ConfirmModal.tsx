"use client";

import { useEffect } from "react";
import styles from "./ConfirmModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" → red confirm button (default), "warning", "primary" */
  variant?: "danger" | "warning" | "primary";
  icon?: React.ReactNode;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
}: Props) {
  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        {icon && (
          <div className={`${styles["icon-wrap"]} ${styles[`icon-wrap--${variant}`]}`}>
            {icon}
          </div>
        )}

        {/* Content */}
        <h2 id="confirm-modal-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles["btn-cancel"]}
            onClick={onClose}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles["btn-confirm"]} ${styles[`btn-confirm--${variant}`]}`}
            onClick={() => { onConfirm(); onClose(); }}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>

        {/* Close ✕ */}
        <button
          className={styles["close-x"]}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
