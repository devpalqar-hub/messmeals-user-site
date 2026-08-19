import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  User,
  Phone,
  CheckCircle2,
  ChevronLeft,
  CalendarPlus,
} from "lucide-react";
import { getMessById } from "../services/messApi";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import { WEEKDAYS } from "../types/booking";
import type { MessDetails, MessPlan } from "../types/mess";
import type { PlanType, Weekday, DeliveryAddress } from "../types/booking";
import ExtraDatesModal from "./ExtraDatesModal";
import "./BookPlan.css";

const today = () => new Date().toISOString().slice(0, 10);

export default function BookPlan() {
  const { messId } = useParams();
  const [searchParams] = useSearchParams();
  const planIdParam = searchParams.get("planId");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [mess, setMess] = useState<MessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<MessPlan | null>(null);

  const [planType, setPlanType] = useState<PlanType>("monthly");

  // Monthly
  const [startDate, setStartDate] = useState(today());
  const [months, setMonths] = useState(1);

  // Daily
  const [endDate, setEndDate] = useState("");
  const [weekdays, setWeekdays] = useState<Weekday[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [extraDates, setExtraDates] = useState<string[]>([]);
  const [extraDatesOpen, setExtraDatesOpen] = useState(false);

  // Address & contact
  const [address, setAddress] = useState<DeliveryAddress>({
    line1: "",
    line2: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [useProfile, setUseProfile] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Require login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: location.pathname + location.search } });
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  // Prefill contact from profile
  useEffect(() => {
    if (useProfile && user) {
      setContactName(user.name || "");
      setContactPhone(user.phone || "");
    }
  }, [useProfile, user]);

  useEffect(() => {
    if (messId) fetchMess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messId]);

  const fetchMess = async () => {
    setLoading(true);
    try {
      const data = await getMessById(messId!);
      setMess(data);
      const chosen =
        data.plans?.find((p: MessPlan) => p.id === planIdParam) ||
        data.plans?.[0] ||
        null;
      setPlan(chosen);
      if (chosen) {
        const isDaily = chosen.planName.toLowerCase().includes("day");
        setPlanType(isDaily ? "daily" : "monthly");
      }
    } catch (err) {
      console.error("Failed to load mess for booking", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekday = (day: Weekday) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const dailyDayCount = useMemo(() => {
    if (planType !== "daily" || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    let count = 0;
    const cursor = new Date(start);
    while (cursor <= end) {
      const dow = WEEKDAYS[(cursor.getDay() + 6) % 7]; // Mon-first index
      if (weekdays.includes(dow)) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    // extra dates outside the range/pattern still count
    const inRangeExtras = extraDates.filter((d) => {
      const dt = new Date(d);
      return dt < start || dt > end;
    });
    return count + inRangeExtras.length;
  }, [planType, startDate, endDate, weekdays, extraDates]);

  const estimatedTotal = useMemo(() => {
    const price = Number(plan?.price || 0);
    if (!price) return 0;
    if (planType === "monthly") return price * (months || 0);
    return price * dailyDayCount;
  }, [plan, planType, months, dailyDayCount]);

  const isFormValid = () => {
    if (!plan) return false;
    if (!address.line1 || !address.city || !address.pincode) return false;
    if (!contactName || !/^\d{10}$/.test(contactPhone)) return false;
    if (planType === "monthly") return !!startDate && months >= 1;
    return !!startDate && !!endDate && weekdays.length > 0 && new Date(endDate) >= new Date(startDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mess || !plan || !isFormValid()) return;

    setSubmitting(true);
    try {
      await createBooking({
        messId: mess.id,
        messName: mess.name,
        planId: plan.id,
        planName: plan.planName,
        price: plan.price,
        planType,
        startDate,
        months: planType === "monthly" ? months : undefined,
        endDate: planType === "daily" ? endDate : undefined,
        weekdays: planType === "daily" ? weekdays : undefined,
        extraDates: planType === "daily" ? extraDates : undefined,
        address,
        contactName,
        contactPhone,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Booking failed", err);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="book-plan-page">
        <div className="bp-loading">Loading plan details...</div>
      </div>
    );
  }

  if (!mess || !plan) {
    return (
      <div className="book-plan-page">
        <div className="bp-loading">Plan not found.</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="book-plan-page">
        <div className="bp-success">
          <CheckCircle2 size={56} />
          <h1>Booking confirmed!</h1>
          <p>
            Your {planType} plan with <strong>{mess.name}</strong> has been booked.
            Manage deliveries anytime from your profile.
          </p>
          <div className="bp-success-actions">
            <button className="bp-secondary-btn" onClick={() => navigate(`/mess/${mess.id}`)}>
              Back to Mess
            </button>
            <button className="bp-primary-btn" onClick={() => navigate("/profile")}>
              Go to My Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-plan-page">
      <button className="bp-back" onClick={() => navigate(`/mess/${mess.id}`)}>
        <ChevronLeft size={18} /> Back to {mess.name}
      </button>

      <div className="bp-layout">
        <form className="bp-form" id="book-plan-form" onSubmit={handleSubmit}>
          {/* Plan type */}
          <section className="bp-section">
            <h2>Choose plan type</h2>
            <div className="bp-plantype-toggle">
              <button
                type="button"
                className={planType === "monthly" ? "active" : ""}
                onClick={() => setPlanType("monthly")}
              >
                Monthly Plan
              </button>
              <button
                type="button"
                className={planType === "daily" ? "active" : ""}
                onClick={() => setPlanType("daily")}
              >
                Daily Plan
              </button>
            </div>
          </section>

          {/* Schedule */}
          <section className="bp-section">
            <h2>
              <CalendarDays size={18} /> Schedule
            </h2>

            {planType === "monthly" ? (
              <div className="bp-grid-2">
                <div className="bp-field">
                  <label>Starting date</label>
                  <input
                    type="date"
                    min={today()}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="bp-field">
                  <label>Number of months</label>
                  <div className="bp-stepper">
                    <button
                      type="button"
                      onClick={() => setMonths((m) => Math.max(1, m - 1))}
                    >
                      −
                    </button>
                    <span>{months}</span>
                    <button type="button" onClick={() => setMonths((m) => Math.min(12, m + 1))}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bp-grid-2">
                  <div className="bp-field">
                    <label>Start date</label>
                    <input
                      type="date"
                      min={today()}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="bp-field">
                    <label>End date</label>
                    <input
                      type="date"
                      min={startDate || today()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="bp-field">
                  <label>Delivery days</label>
                  <div className="bp-weekdays">
                    {WEEKDAYS.map((day) => (
                      <button
                        type="button"
                        key={day}
                        className={weekdays.includes(day) ? "active" : ""}
                        onClick={() => toggleWeekday(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="bp-extra-dates-btn"
                  onClick={() => setExtraDatesOpen(true)}
                >
                  <CalendarPlus size={16} />
                  {extraDates.length > 0
                    ? `${extraDates.length} extra date${extraDates.length > 1 ? "s" : ""} added`
                    : "Add extra one-off dates"}
                </button>
              </>
            )}
          </section>

          {/* Address */}
          <section className="bp-section">
            <h2>
              <MapPin size={18} /> Delivery address
            </h2>
            <div className="bp-field">
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="House / Flat no, Street"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                required
              />
            </div>
            <div className="bp-field">
              <label>Address line 2 (optional)</label>
              <input
                type="text"
                placeholder="Area, Landmark"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              />
            </div>
            <div className="bp-grid-2">
              <div className="bp-field">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Kochi"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
              </div>
              <div className="bp-field">
                <label>Pincode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="682001"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                  }
                  required
                />
              </div>
            </div>
            <div className="bp-field">
              <label>Landmark (optional)</label>
              <input
                type="text"
                placeholder="Near..."
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
              />
            </div>
          </section>

          {/* Contact */}
          <section className="bp-section">
            <h2>
              <User size={18} /> Contact details
            </h2>

            <label className="bp-checkbox">
              <input
                type="checkbox"
                checked={useProfile}
                onChange={(e) => setUseProfile(e.target.checked)}
              />
              Use details from my profile
            </label>

            <div className="bp-grid-2">
              <div className="bp-field">
                <label>Full name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  disabled={useProfile}
                  required
                />
              </div>
              <div className="bp-field">
                <label>
                  <Phone size={13} /> Contact number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={contactPhone}
                  onChange={(e) =>
                    setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  disabled={useProfile}
                  required
                />
              </div>
            </div>
          </section>
        </form>

        {/* Summary sidebar */}
        <aside className="bp-summary">
          <div className="bp-summary-card">
            <h3>Order Summary</h3>

            <div className="bp-summary-row">
              <span>Mess</span>
              <strong>{mess.name}</strong>
            </div>
            <div className="bp-summary-row">
              <span>Plan</span>
              <strong>{plan.planName}</strong>
            </div>
            <div className="bp-summary-row">
              <span>Type</span>
              <strong className="bp-capitalize">{planType}</strong>
            </div>
            <div className="bp-summary-row">
              <span>Price</span>
              <strong>₹{plan.price} {planType === "monthly" ? "/mo" : "/day"}</strong>
            </div>

            {planType === "monthly" ? (
              <div className="bp-summary-row">
                <span>Duration</span>
                <strong>{months} month{months > 1 ? "s" : ""}</strong>
              </div>
            ) : (
              <div className="bp-summary-row">
                <span>Meal days</span>
                <strong>{dailyDayCount} day{dailyDayCount !== 1 ? "s" : ""}</strong>
              </div>
            )}

            <div className="bp-summary-divider" />

            <div className="bp-summary-total">
              <span>Estimated total</span>
              <strong>₹{estimatedTotal.toLocaleString("en-IN")}</strong>
            </div>

            <button
              type="submit"
              form="book-plan-form"
              className="bp-submit-btn"
              disabled={!isFormValid() || submitting}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
            <p className="bp-summary-note">
              No payment integration yet — this reserves your plan.
            </p>
          </div>
        </aside>
      </div>

      <ExtraDatesModal
        isOpen={extraDatesOpen}
        onClose={() => setExtraDatesOpen(false)}
        dates={extraDates}
        onChange={setExtraDates}
        minDate={today()}
      />
    </div>
  );
}
