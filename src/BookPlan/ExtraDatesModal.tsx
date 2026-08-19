import { useState } from "react";
import { X, Plus, CalendarPlus } from "lucide-react";
import "./ExtraDatesModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dates: string[];
  onChange: (dates: string[]) => void;
  minDate?: string;
};

export default function ExtraDatesModal({
  isOpen,
  onClose,
  dates,
  onChange,
  minDate,
}: Props) {
  const [pending, setPending] = useState("");

  if (!isOpen) return null;

  const addDate = () => {
    if (!pending) return;
    if (!dates.includes(pending)) {
      onChange([...dates, pending].sort());
    }
    setPending("");
  };

  const removeDate = (d: string) => {
    onChange(dates.filter((x) => x !== d));
  };

  return (
    <div className="edm-overlay" onClick={onClose}>
      <div className="edm-card" onClick={(e) => e.stopPropagation()}>
        <button className="edm-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="edm-header">
          <CalendarPlus size={20} />
          <h3>Add extra delivery dates</h3>
        </div>
        <p className="edm-sub">
          Add specific one-off dates outside your regular weekday pattern
          (e.g. a Sunday you'd still like a meal).
        </p>

        <div className="edm-picker">
          <input
            type="date"
            value={pending}
            min={minDate}
            onChange={(e) => setPending(e.target.value)}
          />
          <button type="button" className="edm-add-btn" onClick={addDate}>
            <Plus size={16} /> Add
          </button>
        </div>

        {dates.length > 0 ? (
          <div className="edm-chips">
            {dates.map((d) => (
              <span key={d} className="edm-chip">
                {new Date(d).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
                <button onClick={() => removeDate(d)} aria-label="Remove date">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="edm-empty">No extra dates added yet.</p>
        )}

        <button type="button" className="edm-done-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
