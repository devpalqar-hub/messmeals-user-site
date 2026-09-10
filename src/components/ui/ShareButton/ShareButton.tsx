"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Copy, Mail, X } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import styles from "./ShareButton.module.css";

// Inline Telegram icon (not in lucide-react)
const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941Z" />
  </svg>
);

// Inline WhatsApp icon (matches existing pattern in the codebase)
const WhatsappIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12.013 2a9.98 9.98 0 0 0-8.528 15.17l-1.48 4.417 4.542-1.464A9.98 9.98 0 1 0 12.013 2Zm0 18.293a8.318 8.318 0 0 1-4.238-1.157l-.304-.18-3.15.992.996-3.047-.2-.315A8.307 8.307 0 0 1 3.693 12a8.32 8.32 0 1 1 8.32 8.293Zm4.57-6.223c-.25-.125-1.48-.732-1.708-.816-.23-.083-.396-.125-.563.125-.166.25-.644.815-.79.98-.146.167-.292.188-.542.063-.25-.125-1.055-.39-2.01-1.24-.74-.66-1.24-1.47-1.385-1.72-.146-.25-.015-.385.11-.51.112-.113.25-.292.375-.438.125-.145.166-.25.25-.416.083-.166.04-.312-.02-.437-.063-.125-.563-1.355-.77-1.854-.203-.487-.41-.42-.564-.428l-.48-.008c-.166 0-.437.063-.666.313-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.02 2.583.125.167 1.76 2.688 4.263 3.77.596.258 1.06.412 1.423.527.597.19 1.14.163 1.57.1.473-.07 1.48-.605 1.688-1.188.208-.583.208-1.082.146-1.187-.062-.105-.228-.167-.478-.292Z" />
  </svg>
);

export interface ShareButtonProps {
  /** Title shown in the native share sheet */
  title: string;
  /** Body text shown in the native share sheet and messaging apps */
  text: string;
  /** Full absolute URL to share */
  url: string;
  /** Optional CSS class applied to the trigger button */
  className?: string;
  /** Visual variant */
  variant?: "icon" | "secondary";
  /** Button label text (only visible when variant is not "icon") */
  label?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  className,
  variant = "secondary",
  label = "Share",
}: ShareButtonProps) {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Close on scroll or resize to prevent detached portal
  useEffect(() => {
    if (!open) return;
    const closeHandler = () => setOpen(false);
    window.addEventListener("scroll", closeHandler, true); // Use capture phase to catch scroll events from any container
    window.addEventListener("resize", closeHandler);
    return () => {
      window.removeEventListener("scroll", closeHandler, true);
      window.removeEventListener("resize", closeHandler);
    };
  }, [open]);

  const handleShare = async (e: React.MouseEvent) => {
    // Stop card click / navigation from triggering
    e.preventDefault();
    e.stopPropagation();

    // Try native Web Share API first (mobile + desktop Chrome 89+)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return; // Succeeded — no need to show dropdown
      } catch (err) {
        // AbortError = user cancelled → stay silent
        if (err instanceof Error && err.name === "AbortError") return;
        // Other errors → fall through to dropdown
      }
    }

    // Desktop fallback: toggle custom share menu
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let left = rect.right - 190; // Align right edge of dropdown with right edge of button (190px is min-width)
      if (left < 10) left = 10; // Prevent going off-screen left
      
      setPos({
        top: rect.bottom + 8,
        left: left,
      });
    }
    setOpen((prev) => !prev);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      success("Link copied!");
    } catch {
      // Clipboard API failed (rare) — silent
    }
    setOpen(false);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      Icon: WhatsappIcon,
      optClass: styles["share-option-whatsapp"],
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      Icon: TelegramIcon,
      optClass: styles["share-option-telegram"],
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`,
      Icon: Mail,
      optClass: styles["share-option-email"],
    },
  ];

  return (
    <div className={styles["share-wrapper"]}>
      <button
        ref={buttonRef}
        type="button"
        className={[
          styles["share-trigger"],
          variant === "icon"
            ? styles["share-trigger-icon"]
            : styles["share-trigger-secondary"],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleShare}
        aria-label="Share this plan"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Share2 size={15} aria-hidden="true" />
        {variant !== "icon" && <span>{label}</span>}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          className={styles["share-dropdown"]}
          style={{ top: pos.top, left: pos.left }}
          role="menu"
          aria-label="Share options"
        >
          <div className={styles["share-dropdown-header"]}>
            <span>Share this plan</span>
            <button
              type="button"
              className={styles["share-dropdown-close"]}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
              aria-label="Close share menu"
            >
              <X size={14} />
            </button>
          </div>

          <div className={styles["share-dropdown-options"]}>
            {shareOptions.map(({ id, label: optLabel, href, Icon, optClass }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={[styles["share-option"], optClass].join(" ")}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{optLabel}</span>
              </a>
            ))}

            <button
              type="button"
              className={[
                styles["share-option"],
                styles["share-option-copy"],
              ].join(" ")}
              role="menuitem"
              onClick={handleCopy}
            >
              <Copy size={16} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
