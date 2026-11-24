"use client";

import type { NewMessPlan } from "../../../../types/mess";
import styles from "./PlanTabs.module.css";

/** Plan switcher for the weekly-menu section, shared by every theme. */
export default function PlanTabs({
  plans,
  activeId,
  onSelect,
}: {
  plans: NewMessPlan[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Meal plan">
      {plans.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.on : ""}`}
            onClick={() => onSelect(p.id)}
          >
            {p.planName}
          </button>
        );
      })}
    </div>
  );
}
