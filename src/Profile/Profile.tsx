import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  PauseCircle,
  XCircle,
  CalendarX2,
  PlayCircle,
  LogOut,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getSubscriptions,
  pauseSubscription,
  cancelSubscription,
  skipMeal,
} from "../services/bookingService";
import type { Subscription } from "../types/booking";
import SubscriptionActionModal from "./SubscriptionActionModal";
import type { ActionMode } from "./SubscriptionActionModal";
import "./Profile.css";

export default function Profile() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || "");

  const [activeModal, setActiveModal] = useState<{
    mode: ActionMode;
    sub: Subscription;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: "/profile" } });
      return;
    }
    fetchSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchSubs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getSubscriptions(user.phone);
      setSubs(data);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = () => {
    updateProfile({ name });
  };

  const handleAction = async (payload: { start?: string; end?: string; date?: string }) => {
    if (!activeModal) return;
    const { mode, sub } = activeModal;

    if (mode === "pause" && payload.start && payload.end) {
      await pauseSubscription(sub.id, { start: payload.start, end: payload.end });
    } else if (mode === "cancel") {
      await cancelSubscription(sub.id);
    } else if (mode === "skip" && payload.date) {
      await skipMeal(sub.id, payload.date);
    }
    await fetchSubs();
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={26} />
        </div>
        <div className="profile-info">
          <div className="profile-name-row">
            <input
              className="profile-name-input"
              value={name}
              placeholder="Add your name"
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
            />
          </div>
          <div className="profile-phone">
            <Phone size={14} /> +91 {user.phone}
          </div>
        </div>
        <button className="profile-logout" onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <h2 className="profile-section-title">My Meal Plans</h2>

      {loading ? (
        <p className="profile-loading">Loading your plans...</p>
      ) : subs.length === 0 ? (
        <div className="profile-empty">
          <p>You haven't booked any mess plans yet.</p>
          <button onClick={() => navigate("/view-all-listings")}>Browse Messes</button>
        </div>
      ) : (
        <div className="sub-list">
          {subs.map((sub) => (
            <div className="sub-card" key={sub.id}>
              <div className="sub-card-top">
                <div>
                  <h3>{sub.messName}</h3>
                  <p className="sub-plan-name">{sub.planName}</p>
                </div>
                <span className={`sub-status ${sub.status}`}>{sub.status}</span>
              </div>

              <div className="sub-meta">
                <span>
                  <CalendarDays size={14} />
                  {sub.planType === "monthly"
                    ? `From ${sub.startDate} · ${sub.months} month${sub.months !== 1 ? "s" : ""}`
                    : `${sub.startDate} → ${sub.endDate}`}
                </span>
                <span>
                  <MapPin size={14} />
                  {sub.address.city}, {sub.address.pincode}
                </span>
              </div>

              {sub.planType === "daily" && sub.weekdays && (
                <div className="sub-weekdays">
                  {sub.weekdays.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              )}

              {sub.pausedRanges.length > 0 && (
                <div className="sub-tags">
                  {sub.pausedRanges.map((p) => (
                    <span key={p.id} className="tag paused">
                      Paused {p.start} → {p.end}
                    </span>
                  ))}
                </div>
              )}

              {sub.skippedDates.length > 0 && (
                <div className="sub-tags">
                  {sub.skippedDates.map((d) => (
                    <span key={d} className="tag skipped">
                      Skipped {d}
                    </span>
                  ))}
                </div>
              )}

              {sub.status !== "cancelled" && (
                <div className="sub-actions">
                  <button onClick={() => setActiveModal({ mode: "pause", sub })}>
                    <PauseCircle size={15} /> Pause a week
                  </button>
                  <button onClick={() => setActiveModal({ mode: "skip", sub })}>
                    <CalendarX2 size={15} /> Skip a day
                  </button>
                  <button
                    className="danger"
                    onClick={() => setActiveModal({ mode: "cancel", sub })}
                  >
                    <XCircle size={15} /> Cancel plan
                  </button>
                </div>
              )}

              {sub.status === "cancelled" && (
                <div className="sub-cancelled-note">
                  <PlayCircle size={14} /> This plan has been cancelled.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeModal && (
        <SubscriptionActionModal
          mode={activeModal.mode}
          messName={activeModal.sub.messName}
          onClose={() => setActiveModal(null)}
          onConfirm={handleAction}
        />
      )}
    </div>
  );
}
