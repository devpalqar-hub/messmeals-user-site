import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  LogOut,
  CalendarDays,
  MapPin,
  Mail,
  Wallet,
  Plus,
  Loader2,
  UtensilsCrossed,
  Clock,
  ChevronRight,
  CalendarCheck2,
  BadgeCheck,
  Ban,
  PauseCircle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/userService";
import { getAddresses } from "../../services/addressService";
import type { Address } from "../../types/address";
import AddressModal from "./AddressModal";
import { getMySubscriptions } from "../../services/bookingService";
import type { MySubscription } from "../../types/booking";
import styles from "./Profile.module.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function statusMeta(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":   return { label: "Active",    cls: styles["status-active"],    icon: <BadgeCheck size={12} /> };
    case "PAUSED":   return { label: "Paused",    cls: styles["status-paused"],    icon: <PauseCircle size={12} /> };
    case "CANCELLED":return { label: "Cancelled", cls: styles["status-cancelled"], icon: <Ban size={12} /> };
    default:         return { label: "Inactive",  cls: styles["status-inactive"],  icon: <Clock size={12} /> };
  }
}

function scheduleLabel(sub: MySubscription) {
  switch (sub.scheduleType) {
    case "DAILY":     return "Daily";
    case "MONTHLY":   return "Monthly";
    case "EVERYDAY":  return "Every day";
    case "CUSTOM":    return "Custom days";
    case "WEEKLY":    return "Weekly";
    default:          return sub.scheduleType;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"details" | "addresses" | "plans">("details");

  const [mySubs, setMySubs] = useState<MySubscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState("");

  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: "/profile" } });
      return;
    }
    fetchProfile();
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load subscriptions lazily when tab is opened
  useEffect(() => {
    if (activeTab === "plans" && mySubs.length === 0 && !subsLoading) {
      fetchSubs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
    if (!user?.token) return;
    setSubsLoading(true);
    setSubsError("");
    try {
      const res = await getMySubscriptions(user.token);
      setMySubs(res.data);
    } catch (err: any) {
      setSubsError(err.message || "Failed to load subscriptions.");
    } finally {
      setSubsLoading(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className={styles["profile-page"]}>
      {/* Header */}
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

      {/* Tabs */}
      <div className={styles["tabs-container"]}>
        {(["details", "addresses", "plans"] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles["tab-btn"]} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" ? "My Details" : tab === "addresses" ? "My Addresses" : "My Meal Plans"}
          </button>
        ))}
      </div>

      {/* ── My Details ── */}
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
                <span><Phone size={14} /> {profileData.phone}</span>
                <span><Mail size={14} /> {profileData.email}</span>
                <span><Wallet size={14} /> ₹{profileData.customerProfile?.walletAmount || "0"}</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles["profile-name-row"]}>
                <span className={styles["profile-name"]}>{user.name}</span>
              </div>
              <div className={styles["profile-details"]}>
                <span><Phone size={14} /> +91 {user.phone}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── My Addresses ── */}
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
              <button className={styles["add-address-btn"]} onClick={() => setIsAddressModalOpen(true)}>
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

      {/* ── My Meal Plans ── */}
      {activeTab === "plans" && (
        <div className={styles["plans-section"]}>
          {subsLoading ? (
            <div className={styles["plans-loader"]}>
              <Loader2 size={28} className={styles["spin"]} />
              <span>Loading your plans…</span>
            </div>
          ) : subsError ? (
            <div className={styles["plans-error"]}>
              <p>{subsError}</p>
              <button onClick={fetchSubs}><RotateCcw size={14} /> Retry</button>
            </div>
          ) : mySubs.length === 0 ? (
            <div className={styles["profile-empty"]}>
              <UtensilsCrossed size={40} strokeWidth={1.4} color="#b3bab3" />
              <p>You haven't booked any mess plans yet.</p>
              <button onClick={() => navigate("/view-all-listings")}>Browse Messes</button>
            </div>
          ) : (
            <div className={styles["sub-list"]}>
              {mySubs.map((sub) => {
                const sm = statusMeta(sub.status);
                const img = sub.plan.images?.[0]?.url;
                return (
                  <div className={styles["sub-card"]} key={sub.id}>
                    {/* Top row: image + title + status */}
                    <div className={styles["sub-card-top"]}>
                      {img && (
                        <img
                          src={img}
                          alt={sub.plan.name}
                          className={styles["sub-plan-img"]}
                        />
                      )}
                      <div className={styles["sub-card-info"]}>
                        <div className={styles["sub-card-title-row"]}>
                          <div>
                            <h3 className={styles["sub-plan-name"]}>{sub.plan.name}</h3>
                            <span className={styles["sub-price"]}>
                              ₹{Number(sub.discountedPrice).toLocaleString("en-IN")}
                              <small> total</small>
                            </span>
                          </div>
                          <span className={`${styles["sub-status"]} ${sm.cls}`}>
                            {sm.icon}{sm.label}
                          </span>
                        </div>

                        {/* Meta chips */}
                        <div className={styles["sub-meta"]}>
                          <span>
                            <CalendarDays size={13} />
                            {fmt(sub.start_date)}
                            {sub.end_date && <> → {fmt(sub.end_date)}</>}
                          </span>
                          <span>
                            <CalendarCheck2 size={13} />
                            {scheduleLabel(sub)}
                          </span>
                          <span>
                            <MapPin size={13} />
                            {sub.address.townOrcity}, {sub.address.postcode}
                          </span>
                        </div>

                        {/* Selected days pills */}
                        {sub.selectedDays && sub.selectedDays.length > 0 && (
                          <div className={styles["sub-days"]}>
                            {sub.selectedDays.map((d) => (
                              <span key={d} className={styles["sub-day-chip"]}>{DAY_SHORT[d] ?? d}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer: address + plan per-day price */}
                    <div className={styles["sub-card-footer"]}>
                      <span className={styles["sub-address-line"]}>
                        <MapPin size={12} />
                        {sub.address.name} · {sub.address.street}, {sub.address.townOrcity}
                      </span>
                      <span className={styles["sub-per-day"]}>
                        ₹{Number(sub.plan.price).toLocaleString("en-IN")}/{sub.plan.isMonthlyPlan ? "month" : "day"}
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
