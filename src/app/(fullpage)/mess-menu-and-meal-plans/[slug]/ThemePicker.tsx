"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pickTheme, resetTheme } from "./actions";
import { PREVIEW_SLUG, THEME_IDS, THEME_META, type ThemeId } from "./themes/registry";
import styles from "./ThemePreview.module.css";

export default function ThemePicker({
  current,
  slug,
  note,
  canReset,
}: {
  current: ThemeId;
  slug: string;
  note: string;
  canReset: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.picker} ref={rootRef}>
      {open && (
        <div className={styles.pickerPanel} role="group" aria-label="Choose a theme">
          <p className={styles.pickerTitle}>Choose a theme</p>
          <ul className={styles.pickerList}>
            {THEME_IDS.map((id) => {
              const meta = THEME_META[id];
              const active = id === current;
              return (
                <li key={id}>
                  <form action={pickTheme.bind(null, slug, id)}>
                    <button
                      type="submit"
                      className={`${styles.pickerItem} ${active ? styles.pickerItemOn : ""}`}
                      aria-current={active ? "true" : undefined}
                      disabled={active}
                    >
                      <span className={styles.pickerName}>{meta.name}</span>
                      <span className={styles.pickerTag}>{meta.tagline}</span>
                      {active && <span className={styles.pickerCheck}>Showing</span>}
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
          <div className={styles.pickerFoot}>
            {canReset && (
              <form action={resetTheme.bind(null, slug)}>
                <button type="submit" className={styles.pickerLink}>
                  Use the default theme
                </button>
              </form>
            )}
            {slug !== PREVIEW_SLUG && (
              <Link
                href={`/mess-menu-and-meal-plans/${PREVIEW_SLUG}`}
                className={styles.pickerLink}
              >
                See theme outlines
              </Link>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.pickerButton}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          <strong>{THEME_META[current].name}</strong> theme · {note}
        </span>
        <span className={styles.pickerCaret} aria-hidden>
          {open ? "▾" : "▴"}
        </span>
      </button>
    </div>
  );
}
