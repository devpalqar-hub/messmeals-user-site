import { useState } from "react";
import { X, PauseCircle, XCircle, CalendarX2, AlertTriangle } from "lucide-react";
import styles from "./SubscriptionActionModal.module.css";

export type ActionMode = "pause" | "cancel" | "skip";

type Props = {
  mode: ActionMode;
  messName: string;
  onClose: () => void;
  onConfirm: (payload: { start?: string; end?: string; date?: string }) => Promise<void> | void;
};

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const META: Record<
  ActionMode,
  { icon: typeof PauseCircle; title: string; tone: "default" | "danger" }
> = {
  pause: { icon: PauseCircle, title: "Pause delivery for a week", tone: "default" },
  cancel: { icon: XCircle, title: "Cancel this plan", tone: "danger" },
  skip: { icon: CalendarX2, title: "Skip a single day's meal", tone: "default" },
};

export default function SubscriptionActionModal({ mode, messName, onClose, onConfirm }: Props) {
  const [start, setStart] = useState(today());
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);

  const { icon: Icon, title, tone } = META[mode];
  const end = addDays(start, 6);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (mode === "pause") await onConfirm({ start, end });
      else if (mode === "skip") await onConfirm({ date });
      else await onConfirm({});
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["sam-overlay"]} onClick={onClose}>
      <div className={styles["sam-card"]} onClick={(e) => e.stopPropagation()}>
        <button className={styles["sam-close"]} onClick={onClose}>
          <X size={18} />
        </button>

        <div className={`${styles["sam-icon"]} ${styles[tone] || ""}`}>
          <Icon size={24} />
        </div>

        <h3>{title}</h3>
        <p className={styles["sam-sub"]}>{messName}</p>

        {mode === "pause" && (
          <div className={styles["sam-field"]}>
            <label>Pause starting from</label>
            <input type="date" min={today()} value={start} onChange={(e) => setStart(e.target.value)} />
            <p className={styles["sam-note"]}>
              Delivery will be paused from <strong>{start}</strong> to <strong>{end}</strong> (7 days).
            </p>
          </div>
        )}

        {mode === "skip" && (
          <div className={styles["sam-field"]}>
            <label>Date to skip</label>
            <input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
            <p className={styles["sam-note"]}>Only this day's meal will be cancelled — your plan continues after.</p>
          </div>
        )}

        {mode === "cancel" && (
          <div className={styles["sam-warning"]}>
            <AlertTriangle size={16} />
            This will permanently cancel the entire plan and stop all future deliveries. This can't be undone.
          </div>
        )}

        <div className={styles["sam-actions"]}>
          <button className={styles["sam-cancel-btn"]} onClick={onClose}>
            Go back
          </button>
          <button
            className={`${styles["sam-confirm-btn"]} ${styles[tone] || ""}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "pause"
              ? "Pause for a week"
              : mode === "skip"
              ? "Skip this day"
              : "Yes, cancel plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
