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
  Mail,
  Wallet,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/userService";
import { getAddresses } from "../../services/addressService";
import type { Address } from "../../types/address";
import AddressModal from "./AddressModal";
import {
  getSubscriptions,
  pauseSubscription,
  cancelSubscription,
  skipMeal,
} from "../../services/bookingService";
import type { Subscription } from "../../types/booking";
import SubscriptionActionModal from "./SubscriptionActionModal";
import type { ActionMode } from "./SubscriptionActionModal";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"details" | "addresses" | "plans">("details");

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
    fetchProfile();
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    if (!user?.token) return;
    try {
      setProfileLoading(true);
      const data = await getUserProfile(user.token);
      setProfileData(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user?.token) return;
    try {
      setAddressesLoading(true);
      const data = await getAddresses(user.token);
      setAddresses(data);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setAddressesLoading(false);
    }
  };

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
    <div className={styles["profile-page"]}>
      <div className={styles["profile-header"]}>
        <div className={styles["profile-avatar"]}>
          <User size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "20px", margin: 0, color: "#14181a" }}>My Account</h1>
        </div>
        <button className={styles["profile-logout"]} onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className={styles["tabs-container"]}>
        <button
          className={`${styles["tab-btn"]} ${activeTab === "details" ? styles.active : ""}`}
          onClick={() => setActiveTab("details")}
        >
          My Details
        </button>
        <button
          className={`${styles["tab-btn"]} ${activeTab === "addresses" ? styles.active : ""}`}
          onClick={() => setActiveTab("addresses")}
        >
          My Addresses
        </button>
        <button
          className={`${styles["tab-btn"]} ${activeTab === "plans" ? styles.active : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          My Meal Plans
        </button>
      </div>

      {activeTab === "details" && (
        <div className={styles["address-card"]} style={{ marginTop: "16px" }}>
          {profileLoading ? (
            <p className={styles["profile-loading"]}>Loading profile...</p>
          ) : profileData ? (
            <>
              <div className={styles["profile-name-row"]}>
                <span className={styles["profile-name"]}>{profileData.name}</span>
              </div>
              <div className={styles["profile-details"]}>
                <span>
                  <Phone size={14} /> {profileData.phone}
                </span>
                <span>
                  <Mail size={14} /> {profileData.email}
                </span>
                <span>
                  <Wallet size={14} /> ₹{profileData.customerProfile?.walletAmount || "0"}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles["profile-name-row"]}>
                <span className={styles["profile-name"]}>{user.name}</span>
              </div>
              <div className={styles["profile-details"]}>
                <span>
                  <Phone size={14} /> +91 {user.phone}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "addresses" && (
        <div className={styles["address-list"]}>
          {addressesLoading ? (
            <p className={styles["profile-loading"]}>Loading addresses...</p>
          ) : (
            <>
              {addresses.map((addr) => (
                <div key={addr.id} className={styles["address-card"]}>
                  <h3 className={styles["address-name"]}>{addr.name}</h3>
                  <p className={styles["address-details"]}>
                    {addr.street}, {addr.townOrcity}, {addr.country} - {addr.postcode}
                    {addr.landmark && <><br />Landmark: {addr.landmark}</>}
                  </p>
                  <div className={styles["address-contact"]}>
                    <span><Phone size={14} /> {addr.phone}</span>
                    {addr.email && <span><Mail size={14} /> {addr.email}</span>}
                  </div>
                </div>
              ))}
              <button
                className={styles["add-address-btn"]}
                onClick={() => setIsAddressModalOpen(true)}
              >
                <Plus size={18} /> Add New Address
              </button>
            </>
          )}

          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSuccess={fetchAddresses}
          />
        </div>
      )}

      {activeTab === "plans" && (
        <>
          {loading ? (
            <p className={styles["profile-loading"]}>Loading your plans...</p>
          ) : subs.length === 0 ? (
            <div className={styles["profile-empty"]}>
              <p>You haven't booked any mess plans yet.</p>
              <button onClick={() => navigate("/view-all-listings")}>Browse Messes</button>
            </div>
          ) : (
            <div className={styles["sub-list"]}>
              {subs.map((sub) => (
                <div className={styles["sub-card"]} key={sub.id}>
                  <div className={styles["sub-card-top"]}>
                    <div>
                      <h3>{sub.messName}</h3>
                      <p className={styles["sub-plan-name"]}>{sub.planName}</p>
                    </div>
                    <span className={`${styles["sub-status"]} ${styles[sub.status] || ""}`}>{sub.status}</span>
                  </div>

                  <div className={styles["sub-meta"]}>
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
                    <div className={styles["sub-weekdays"]}>
                      {sub.weekdays.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  )}

                  {sub.pausedRanges.length > 0 && (
                    <div className={styles["sub-tags"]}>
                      {sub.pausedRanges.map((p) => (
                        <span key={p.id} className={`${styles.tag} ${styles.paused}`}>
                          Paused {p.start} → {p.end}
                        </span>
                      ))}
                    </div>
                  )}

                  {sub.skippedDates.length > 0 && (
                    <div className={styles["sub-tags"]}>
                      {sub.skippedDates.map((d) => (
                        <span key={d} className={`${styles.tag} ${styles.skipped}`}>
                          Skipped {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {sub.status !== "cancelled" && (
                    <div className={styles["sub-actions"]}>
                      <button onClick={() => setActiveModal({ mode: "pause", sub })}>
                        <PauseCircle size={15} /> Pause a week
                      </button>
                      <button onClick={() => setActiveModal({ mode: "skip", sub })}>
                        <CalendarX2 size={15} /> Skip a day
                      </button>
                      <button
                        className={styles.danger}
                        onClick={() => setActiveModal({ mode: "cancel", sub })}
                      >
                        <XCircle size={15} /> Cancel plan
                      </button>
                    </div>
                  )}

                  {sub.status === "cancelled" && (
                    <div className={styles["sub-cancelled-note"]}>
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
        </>
      )}
    </div>
  );
}
