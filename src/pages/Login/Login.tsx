import { useRef, useState } from "react";
import SEO from "../../components/shared/SEO/SEO";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, ShieldCheck, ArrowLeft, BadgeCheck, User, Mail } from "lucide-react";
import { sendLoginOtp, sendRegOtp, verifyOtp, OTP_LENGTH } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import styles from "./Login.module.css";

type Step = "phone" | "otp";
type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  const isValidEmail = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
  const isRegisterValid = isValidPhone && name.trim().length > 0 && isValidEmail && email.trim().length > 0;
  const isFormValid = mode === "login" ? isValidPhone : isRegisterValid;

  const startResendTimer = () => {
    setResendIn(30);
    const t = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.warning("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (mode === "login") {
        res = await sendLoginOtp(phone);
      } else {
        res = await sendRegOtp({ name, email, phone });
      }

      if (res.success) {
        toast.success(res.message || "OTP sent successfully");
        setStep("otp");
        startResendTimer();
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
      } else {
        toast.error(res.message || "Could not send OTP. Try again.");
      }
    } catch {
      toast.error("Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;

    setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      if (res.success && res.user) {
        toast.success("Verified successfully!");
        login(res.user);
        navigate(redirectTo, { replace: true });
      } else {
        toast.error(res.message || "Invalid OTP. Try again.");
      }
    } catch {
      toast.error("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (mode === "login") {
      await sendLoginOtp(phone);
    } else {
      await sendRegOtp({ name, email, phone });
    }
    toast.info("OTP resent successfully.");
    startResendTimer();
  };

  return (
    <main className={styles["login-page"]}>
      <SEO title="Login | MessMeals" noindex={true} />
      <div className={styles["login-visual"]}>
        <div className={styles["login-badge"]}>
          <BadgeCheck size={16} />
          Secure &amp; Private
        </div>
        <h2 className={styles["login-visual-title"]}>
          Good food.
          <br />
          Made simple.
        </h2>
        <p className={styles["login-visual-sub"]}>
          {mode === "login"
            ? "Login to your account and discover the best mess around you."
            : "Create an account to discover and book the best mess around you."}
        </p>
      </div>

      <div className={styles["login-card-wrap"]}>
        <div className={styles["login-card"]}>
          <div className={styles["login-brand"]}>
            <img src="/logo.png" alt="MessMeals" className={styles["logo-image"]} />
          </div>

          {step === "phone" ? (
            <>
              <h1>{mode === "login" ? "Login with your phone" : "Create an account"}</h1>
              <p className={styles["login-sub"]}>
                We'll send a one-time password to verify it's you.
              </p>

              <form onSubmit={handleSendOtp} className={styles["login-form"]}>
                {mode === "register" && (
                  <>
                    <label className={styles["login-label"]}>Full Name</label>
                    <div className={styles["phone-input-wrap"]}>
                      <span className={styles["phone-prefix"]} style={{ padding: "0 14px", borderRight: "none" }}>
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ paddingLeft: 0 }}
                      />
                    </div>

                    <label className={styles["login-label"]} style={{ marginTop: "4px" }}>Email Address</label>
                    <div className={styles["phone-input-wrap"]}>
                      <span className={styles["phone-prefix"]} style={{ padding: "0 14px", borderRight: "none" }}>
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ paddingLeft: 0 }}
                      />
                    </div>
                  </>
                )}

                <label className={styles["login-label"]} style={{ marginTop: mode === "register" ? "4px" : "0" }}>Phone number</label>
                <div className={styles["phone-input-wrap"]}>
                  <span className={styles["phone-prefix"]}>
                    <Phone size={16} /> +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    autoFocus={mode === "login"}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles["login-btn"]}
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <div className={styles["login-mode-toggle"]}>
                {mode === "login" ? (
                  <p>Don't have an account? <button type="button" onClick={() => setMode("register")}>Register here</button></p>
                ) : (
                  <p>Already have an account? <button type="button" onClick={() => setMode("login")}>Login here</button></p>
                )}
              </div>
            </>
          ) : (
            <>
              <button className={styles["login-back"]} onClick={() => setStep("phone")}>
                <ArrowLeft size={16} /> Change {mode === "login" ? "number" : "details"}
              </button>

              <h1>Enter OTP</h1>
              <p className={styles["login-sub"]}>
                We've sent a {OTP_LENGTH}-digit code to +91 {phone}
              </p>

              <form onSubmit={handleVerify} className={styles["login-form"]}>
                <div className={styles["otp-input-wrap"]}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={styles["otp-box"]}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className={styles["login-btn"]}
                  disabled={otp.some((d) => !d) || loading}
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <button
                  type="button"
                  className={styles["resend-btn"]}
                  disabled={resendIn > 0}
                  onClick={handleResend}
                >
                  {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
                </button>
              </form>
            </>
          )}

          <div className={styles["login-trust"]}>
            <ShieldCheck size={14} />
            Your information is safe with us and used only for booking updates.
          </div>
        </div>
      </div>
    </main>
  );
}
