import { useEffect, useState } from "react";
import SEO from "../../components/shared/SEO/SEO";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  CreditCard,
  Home,
  Loader2,
  Utensils,
  Wallet,
} from "lucide-react";
import { getPlanById } from "../../services/messApi";
import { choosePlan, getPlanPrice } from "../../services/bookingService";
import { getAddresses, createAddress } from "../../services/addressService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { PlanDetail } from "../../types/mess";
import type { ScheduleType, ApiWeekday, ChoosePlanPayload, PlanPriceResponse } from "../../types/booking";
import type { Address, AddressPayload } from "../../types/address";
import styles from "./BookPlan.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_WEEKDAYS: ApiWeekday[] = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
];

const DAY_SHORT: Record<ApiWeekday, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const today = () => new Date().toISOString().slice(0, 10);

const SCHEDULE_LABELS: Record<ScheduleType, string> = {
  CUSTOM: "Custom days",
  DAILY: "Every day",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  EVERYDAY: "Everyday",
};

const addMonthsToDate = (dateStr: string, numMonths: number) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + numMonths);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookPlan() {
  const [searchParams] = useSearchParams();
  const planIdParam = searchParams.get("planId");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // ── wizard step ──────────────────────────────────────────────────────────

  const [step, setStep] = useState(1);

  // ── plan detail ──────────────────────────────────────────────────────────
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  // ── step-1 schedule ──────────────────────────────────────────────────────
  const [scheduleType, setScheduleType] = useState<ScheduleType>("DAILY");
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState("");
  const [months, setMonths] = useState(1);
  const [selectedDays, setSelectedDays] = useState<ApiWeekday[]>([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ]);

  const computedEndDate = scheduleType === "MONTHLY" ? addMonthsToDate(startDate, months) : endDate;

  // ── step-2 address ───────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState<AddressPayload>({
    name: user?.name || "",
    street: "",
    townOrcity: "",
    country: "India",
    postcode: "",
    landmark: "",
    latitudeLogitude: "",
    phone: user?.phone || "",
    email: "",
    locationLink: "",
  });

  // ── step-3 submit ────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // ── price estimate ───────────────────────────────────────────────────────
  const [priceData, setPriceData] = useState<PlanPriceResponse | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // ── auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: location.pathname + location.search } });
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  // ── load plan via GET /plans/:id ─────────────────────────────────────────
  useEffect(() => {
    if (!planIdParam) { toast.error("No plan selected."); navigate(-1 as any); return; }
    setPlanLoading(true);
    getPlanById(planIdParam)
      .then((data: PlanDetail) => {
        setPlan(data);
        if (data.isMonthlyPlan) setScheduleType("MONTHLY");
        else setScheduleType("DAILY");
      })
      .catch(() => toast.error("Failed to load plan details."))
      .finally(() => setPlanLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planIdParam]);

  // ── fetch price estimate ─────────────────────────────────────────────────
  useEffect(() => {
    if (!plan || !startDate || !user?.token) return;
    const pricePayload: ChoosePlanPayload = {
      addressId: selectedAddressId || "00000000-0000-0000-0000-000000000000",
      planId: plan.id,
      start_date: startDate,
      scheduleType,
      successUrl: `${window.location.origin}/booking/success`,
      cancelUrl: `${window.location.origin}/booking/cancel`,
    };
    if (computedEndDate) pricePayload.end_date = computedEndDate;
    if (scheduleType === "DAILY" && selectedDays.length > 0) pricePayload.selectedDays = selectedDays;

    const timer = setTimeout(async () => {
      setPriceLoading(true);
      try {
        const data = await getPlanPrice(user.token!, pricePayload);
        setPriceData(data);
      } catch {
        // silently ignore — price is informational
        setPriceData(null);
      } finally {
        setPriceLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, startDate, computedEndDate, scheduleType, selectedDays, user?.token]);

  // ── load addresses on step-2 entry ────────────────────────────────────────
  const fetchAddresses = async () => {
    if (!user?.token) return;
    setAddrLoading(true);
    try {
      const data = await getAddresses(user.token);
      setAddresses(data);
      if (data.length > 0 && !selectedAddressId) setSelectedAddressId(data[0].id);
    } catch { toast.error("Failed to load addresses."); }
    finally { setAddrLoading(false); }
  };

  const toggleDay = (day: ApiWeekday) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const step1Valid = () => {
    if (!plan || !startDate) return false;
    if (scheduleType === "MONTHLY") {
      if (!months || months < 1) return false;
    } else {
      if (!endDate) return false;
      if (new Date(endDate) < new Date(startDate)) return false;
      if (selectedDays.length === 0) return false;
    }
    return true;
  };

  const step2Valid = () => !!selectedAddressId;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    setSavingAddr(true);
    try {
      const created = await createAddress(user.token, newAddr);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowNewAddr(false);
      toast.success("Address saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save address.");
    } finally { setSavingAddr(false); }
  };

  const goNext = () => {
    if (step === 1 && step1Valid()) { setStep(2); fetchAddresses(); }
    else if (step === 2 && step2Valid()) setStep(3);
  };

  const goBack = () => step > 1 ? setStep((s) => s - 1) : navigate(-1 as any);

  const handleSubmit = async () => {
    if (!plan || !user?.token || !selectedAddressId) return;
    setSubmitting(true);
    try {
      const payload: ChoosePlanPayload = {
        addressId: selectedAddressId,
        planId: plan.id,
        start_date: startDate,
        scheduleType,
        successUrl: `${window.location.origin}/booking/success`,
        cancelUrl: `${window.location.origin}/booking/cancel`,
      };
      if (computedEndDate) payload.end_date = computedEndDate;
      if (scheduleType === "DAILY") payload.selectedDays = selectedDays;

      const res = await choosePlan(user.token, payload);
      const paymentUrl = res.data.payment.paymentUrl;
      if (paymentUrl) { window.location.href = paymentUrl; }
      else { toast.error("No payment URL received. Please try again."); setSubmitting(false); }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment. Please try again.");
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (planLoading) {
    return (
      <main className={styles["bp-page"]}>
        <SEO title="Book a Meal Plan | MessMeals" noindex={true} />
        <div className={styles["bp-loader"]}>
          <Loader2 size={32} className={styles["bp-spin"]} />
          <span>Loading plan details…</span>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className={styles["bp-page"]}>
        <SEO title="Book a Meal Plan | MessMeals" noindex={true} />
        <div className={styles["bp-loader"]}>Plan not found.</div>
      </main>
    );
  }

  const backLabel = plan.mess?.name ? `Back to ${plan.mess.name}` : "Back";
  const priceDisplay = `₹${Number(plan.price).toLocaleString("en-IN")}`;
  const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className={styles["bp-page"]}>
      <SEO title="Book a Meal Plan | MessMeals" noindex={true} />

      {/* Back */}
      <button className={styles["bp-back"]} onClick={goBack}>
        <ChevronLeft size={18} />
        {step === 1 ? backLabel : step === 2 ? "Back to Schedule" : "Back to Address"}
      </button>

      {/* Progress stepper */}
      <div className={styles["bp-stepper"]}>
        {["Schedule", "Address", "Review & Pay"].map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={label} className={styles["bp-step-wrap"]}>
              <div className={`${styles["bp-step"]} ${active ? styles["bp-step--active"] : ""} ${done ? styles["bp-step--done"] : ""}`}>
                <span className={styles["bp-step-dot"]}>
                  {done ? <CheckCircle2 size={16} /> : num}
                </span>
                <span className={styles["bp-step-label"]}>{label}</span>
              </div>
              {i < 2 && <div className={`${styles["bp-step-line"]} ${done ? styles["bp-step-line--done"] : ""}`} />}
            </div>
          );
        })}
      </div>

      <div className={styles["bp-layout"]}>

        {/* ═══ MAIN (form) ═══════════════════════════════════════════════════ */}
        <div className={styles["bp-main"]}>

          {/* ── Plan detail card (above the form steps) ─────────────────── */}
          <div className={styles["bp-plan-detail-card"]}>
            {plan.images.length > 0 && (
              <div className={styles["bp-img-carousel"]}>
                <img src={plan.images[activeImg]?.url} alt={plan.images[activeImg]?.altText || `${plan.planName} meal`}
                  className={styles["bp-img"]} />
                {plan.images.length > 1 && (
                  <>
                    <button
                      className={`${styles["bp-img-nav"]} ${styles["bp-img-nav--left"]}`}
                      onClick={() => setActiveImg((i) => (i - 1 + plan.images.length) % plan.images.length)}>
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className={`${styles["bp-img-nav"]} ${styles["bp-img-nav--right"]}`}
                      onClick={() => setActiveImg((i) => (i + 1) % plan.images.length)}>
                      <ChevronRight size={16} />
                    </button>
                    <div className={styles["bp-img-dots"]}>
                      {plan.images.map((_, i) => (
                        <button key={i}
                          className={`${styles["bp-img-dot"]} ${i === activeImg ? styles["bp-img-dot--active"] : ""}`}
                          onClick={() => setActiveImg(i)} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className={styles["bp-plan-detail-body"]}>
              <p className={styles["bp-mess-name"]}>{plan.mess.name}</p>
              <div className={styles["bp-plan-title-row"]}>
                <h3 className={styles["bp-plan-title"]}>{plan.planName}</h3>
                <div className={styles["bp-plan-price-wrap"]}>
                  <span className={styles["bp-plan-price"]}>{priceDisplay}</span>
                  <span className={styles["bp-plan-price-unit"]}>/{plan.isMonthlyPlan ? "month" : "day"}</span>
                </div>
              </div>
              {plan.description && <p className={styles["bp-plan-desc"]}>{plan.description}</p>}
              {plan.Variation.length > 0 && (
                <div className={styles["bp-variations"]}>
                  <p className={styles["bp-variations-label"]}><Utensils size={13} /> Includes</p>
                  <div className={styles["bp-variation-chips"]}>
                    {plan.Variation.map((v) => (
                      <span key={v.id} className={styles["bp-variation-chip"]}>{v.title}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles["bp-plan-badges"]}>
                {plan.isMonthlyPlan && <span className={styles["bp-badge"]}>Monthly</span>}
                {plan.isDailyPlan && <span className={styles["bp-badge"]}>Daily</span>}
                {plan.minPrice && (
                  <span className={`${styles["bp-badge"]} ${styles["bp-badge--muted"]}`}>
                    From ₹{Number(plan.minPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── STEP 1: Schedule ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className={styles["bp-card"]}>
              <div className={styles["bp-card-header"]}>
                <CalendarDays size={20} />
                <div>
                  <h2>Set your schedule</h2>
                  <p>Choose dates and frequency for your meal deliveries</p>
                </div>
              </div>

              <div className={styles["bp-grid-2"]}>
                <div className={styles["bp-field"]}>
                  <label className={styles["bp-label"]}>Start date *</label>
                  <input type="date" className={styles["bp-input"]} min={today()} value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                {scheduleType === "MONTHLY" ? (
                  <div className={styles["bp-field"]}>
                    <label className={styles["bp-label"]}>Duration (Months) *</label>
                    <select
                      className={styles["bp-input"]}
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                        <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={styles["bp-field"]}>
                    <label className={styles["bp-label"]}>End date *</label>
                    <input type="date" className={styles["bp-input"]} min={startDate || today()} value={endDate}
                      onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                )}
              </div>

              {scheduleType === "DAILY" && (
                <div className={styles["bp-field"]}>
                  <label className={styles["bp-label"]}>Delivery days *</label>
                  <div className={styles["bp-weekdays"]}>
                    {API_WEEKDAYS.map((day) => (
                      <button key={day} type="button"
                        className={`${styles["bp-day-btn"]} ${selectedDays.includes(day) ? styles["bp-day-btn--active"] : ""}`}
                        onClick={() => toggleDay(day)}>
                        {DAY_SHORT[day]}
                      </button>
                    ))}
                  </div>
                  {selectedDays.length === 0 && <span style={{ fontSize: 13, color: "#DC3B3B", marginTop: 4 }}>Please select at least one day.</span>}
                </div>
              )}

              {/* Price estimate */}
              {(priceLoading || priceData) && (
                <div className={styles["bp-price-estimate"]}>
                  {priceLoading ? (
                    <span className={styles["bp-price-fetching"]}>
                      <Loader2 size={14} className={styles["bp-spin"]} /> Calculating price…
                    </span>
                  ) : priceData ? (
                    <>
                      {/* Left: icon + label + days */}
                      <div className={styles["bp-pe-left"]}>
                        <div className={styles["bp-pe-icon"]}>
                          <Wallet size={18} />
                        </div>
                        <div className={styles["bp-pe-meta"]}>
                          <span className={styles["bp-pe-label"]}>Estimated total</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className={styles["bp-pe-divider"]} />

                      {/* Right: price + days badge */}
                      <div className={styles["bp-pe-right"]}>
                        <span className={styles["bp-pe-price"]}>
                          ₹{Number(priceData.price).toLocaleString("en-IN")}
                        </span>
                        <span className={styles["bp-pe-badge"]}>
                          <CalendarDays size={12} />
                          {priceData.chargeableDays} day{priceData.chargeableDays !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              <button className={styles["bp-next-btn"]} onClick={goNext} disabled={!step1Valid()}>
                Continue to Address <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Address ──────────────────────────────────────────── */}
          {step === 2 && (
            <div className={styles["bp-card"]}>
              <div className={styles["bp-card-header"]}>
                <MapPin size={20} />
                <div>
                  <h2>Delivery address</h2>
                  <p>Where should we deliver your meals?</p>
                </div>
              </div>

              {addrLoading ? (
                <div className={styles["bp-addr-loading"]}>
                  <Loader2 size={22} className={styles["bp-spin"]} /> Loading addresses…
                </div>
              ) : (
                <>
                  {addresses.length === 0 && !showNewAddr && (
                    <div className={styles["bp-no-addr"]}>
                      <Home size={36} />
                      <p>No saved addresses yet.</p>
                      <button className={styles["bp-add-addr-btn"]} onClick={() => setShowNewAddr(true)}>
                        <Plus size={16} /> Add your first address
                      </button>
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <div className={styles["bp-addr-list"]}>
                      {addresses.map((addr) => (
                        <button key={addr.id} type="button"
                          className={`${styles["bp-addr-card"]} ${selectedAddressId === addr.id ? styles["bp-addr-card--selected"] : ""}`}
                          onClick={() => setSelectedAddressId(addr.id)}>
                          <div className={styles["bp-addr-radio"]}>
                            <div className={styles["bp-addr-radio-dot"]} />
                          </div>
                          <div className={styles["bp-addr-info"]}>
                            <span className={styles["bp-addr-name"]}>{addr.name}</span>
                            <span className={styles["bp-addr-street"]}>{addr.street}{addr.landmark ? `, ${addr.landmark}` : ""}</span>
                            <span className={styles["bp-addr-city"]}>{addr.townOrcity}, {addr.postcode} · {addr.country}</span>
                            {addr.phone && <span className={styles["bp-addr-phone"]}>{addr.phone}</span>}
                          </div>
                        </button>
                      ))}
                      {!showNewAddr && (
                        <button className={styles["bp-add-addr-btn"]} onClick={() => setShowNewAddr(true)}>
                          <Plus size={16} /> Add new address
                        </button>
                      )}
                    </div>
                  )}

                  {showNewAddr && (
                    <form className={styles["bp-new-addr-form"]} onSubmit={handleSaveAddress}>
                      <h3 className={styles["bp-new-addr-title"]}>New address</h3>
                      <div className={styles["bp-grid-2"]}>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Contact Name *</label>
                          <input className={styles["bp-input"]} type="text" required placeholder="Your name"
                            value={newAddr.name} onChange={(e) => setNewAddr((p) => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Phone *</label>
                          <input className={styles["bp-input"]} type="tel" required placeholder="9876543210"
                            value={newAddr.phone} onChange={(e) => setNewAddr((p) => ({ ...p, phone: e.target.value }))} />
                        </div>
                      </div>
                      <div className={styles["bp-field"]}>
                        <label className={styles["bp-label"]}>Email *</label>
                        <input className={styles["bp-input"]} type="email" required placeholder="email@example.com"
                          value={newAddr.email} onChange={(e) => setNewAddr((p) => ({ ...p, email: e.target.value }))} />
                      </div>
                      <div className={styles["bp-field"]}>
                        <label className={styles["bp-label"]}>Street / Flat No. *</label>
                        <input className={styles["bp-input"]} type="text" required placeholder="123 Main St, Apt 4B"
                          value={newAddr.street} onChange={(e) => setNewAddr((p) => ({ ...p, street: e.target.value }))} />
                      </div>
                      <div className={styles["bp-grid-2"]}>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Town / City *</label>
                          <input className={styles["bp-input"]} type="text" required placeholder="Kochi"
                            value={newAddr.townOrcity} onChange={(e) => setNewAddr((p) => ({ ...p, townOrcity: e.target.value }))} />
                        </div>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Postcode *</label>
                          <input className={styles["bp-input"]} type="text" required placeholder="682001"
                            value={newAddr.postcode} onChange={(e) => setNewAddr((p) => ({ ...p, postcode: e.target.value }))} />
                        </div>
                      </div>
                      <div className={styles["bp-grid-2"]}>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Landmark</label>
                          <input className={styles["bp-input"]} type="text" placeholder="Near central mall"
                            value={newAddr.landmark} onChange={(e) => setNewAddr((p) => ({ ...p, landmark: e.target.value }))} />
                        </div>
                        <div className={styles["bp-field"]}>
                          <label className={styles["bp-label"]}>Country *</label>
                          <input className={styles["bp-input"]} type="text" required value={newAddr.country}
                            onChange={(e) => setNewAddr((p) => ({ ...p, country: e.target.value }))} />
                        </div>
                      </div>
                      <div className={styles["bp-addr-form-actions"]}>
                        <button type="button" className={styles["bp-cancel-btn"]} onClick={() => setShowNewAddr(false)}>Cancel</button>
                        <button type="submit" className={styles["bp-save-btn"]} disabled={savingAddr}>
                          {savingAddr ? "Saving…" : "Save Address"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {!showNewAddr && (
                <button className={styles["bp-next-btn"]} onClick={goNext} disabled={!step2Valid()} style={{ marginTop: 8 }}>
                  Review & Pay <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}

          {/* ── STEP 3: Review & Pay ─────────────────────────────────────── */}
          {step === 3 && (
            <div className={styles["bp-card"]}>
              <div className={styles["bp-card-header"]}>
                <CreditCard size={20} />
                <div>
                  <h2>Review your order</h2>
                  <p>Double-check everything before paying</p>
                </div>
              </div>

              <div className={styles["bp-review-grid"]}>
                {[
                  { label: "Mess", value: plan.mess.name },
                  { label: "Plan", value: plan.planName },
                  { label: "Schedule", value: SCHEDULE_LABELS[scheduleType] },
                  { label: "Start date", value: startDate },
                  ...(computedEndDate ? [{ label: "End date", value: computedEndDate }] : []),
                  ...(scheduleType === "DAILY" && selectedDays.length > 0 ? [{ label: "Days", value: selectedDays.map((d) => DAY_SHORT[d]).join(", "), full: true as const }] : []),
                  ...(priceData
                    ? [
                      { label: "Chargeable days", value: `${priceData.chargeableDays} day${priceData.chargeableDays !== 1 ? "s" : ""}` },
                      { label: "Total price", value: `₹${Number(priceData.price).toLocaleString("en-IN")}` },
                    ]
                    : [{ label: "Price", value: `${priceDisplay} / ${plan.isMonthlyPlan ? "month" : "day"}` }]),
                  ...(selectedAddr
                    ? [{ label: "Deliver to", value: `${selectedAddr.name} · ${selectedAddr.street}, ${selectedAddr.townOrcity} ${selectedAddr.postcode}`, full: true }]
                    : []),
                ].map(({ label, value, full }) => (
                  <div key={label} className={styles["bp-review-item"]} style={full ? { gridColumn: "1 / -1" } : {}}>
                    <span className={styles["bp-review-label"]}>{label}</span>
                    <span className={styles["bp-review-value"]}>{value}</span>
                  </div>
                ))}
              </div>

              <div className={styles["bp-pay-btn-wrap"]}>
                <button className={styles["bp-razorpay-btn"]} onClick={handleSubmit} disabled={submitting}>
                  {submitting
                    ? <><Loader2 size={18} className={styles["bp-spin"]} /> Redirecting to payment…</>
                    : <><span className={styles["bp-rzp-logo"]}>₹</span> Pay</>
                  }
                </button>
                <p className={styles["bp-pay-note"]}>
                  You'll be redirected to Razorpay's secure checkout.
                  Deliveries start after payment confirmation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ═══ SIDEBAR ══════════════════════════════════════════════════════════ */}
        <aside className={styles["bp-sidebar"]}>

          {/* Mini order summary */}
          <div className={styles["bp-summary-card"]}>
            <h3>Order Summary</h3>
            <div className={styles["bp-summary-row"]}>
              <span>Schedule</span><strong>{SCHEDULE_LABELS[scheduleType]}</strong>
            </div>
            {startDate && (
              <div className={styles["bp-summary-row"]}>
                <span>Start</span><strong>{startDate}</strong>
              </div>
            )}
            {computedEndDate && (
              <div className={styles["bp-summary-row"]}>
                <span>End</span><strong>{computedEndDate}</strong>
              </div>
            )}
            {scheduleType === "DAILY" && selectedDays.length > 0 && (
              <div className={styles["bp-summary-row"]}>
                <span>Days</span>
                <strong>{selectedDays.map((d) => DAY_SHORT[d]).join(", ")}</strong>
              </div>
            )}
            {selectedAddr && (
              <div className={styles["bp-summary-row"]}>
                <span>Deliver to</span><strong>{selectedAddr.townOrcity}</strong>
              </div>
            )}
            <div className={styles["bp-summary-divider"]} />
            <div className={styles["bp-summary-price"]}>
              <span>Total</span>
              {priceLoading ? (
                <strong><Loader2 size={13} className={styles["bp-spin"]} /> …</strong>
              ) : priceData ? (
                <strong>
                  ₹{Number(priceData.price).toLocaleString("en-IN")}
                  <small> · {priceData.chargeableDays}d</small>
                </strong>
              ) : (
                <strong>{priceDisplay}<small>/{plan.isMonthlyPlan ? "month" : "day"}</small></strong>
              )}
            </div>
            {step < 3 && (
              <button
                className={styles["bp-sidebar-next-btn"]}
                onClick={goNext}
                disabled={step === 1 ? !step1Valid() : !step2Valid()}>
                {step === 1 ? "Next: Address" : "Next: Review"}
              </button>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}
