import { useRef, useState } from "react";
import SEO from "../../components/shared/SEO/SEO";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, ShieldCheck, ArrowLeft, BadgeCheck, User, Mail } from "lucide-react";
import { checkPhone, sendRegOtp, verifyLoginOtp, verifyRegOtp, OTP_LENGTH } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import styles from "./Login.module.css";

type Step = "phone" | "register_details" | "otp";
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
  const [sessionId, setSessionId] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  const isValidEmail = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
  const isRegisterValid = isValidPhone && name.trim().length > 0 && isValidEmail && email.trim().length > 0;

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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone) {
      toast.warning("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await checkPhone(phone);
      if (res.success) {
        if (res.hasAccount) {
          toast.success(res.message || "OTP sent successfully");
          if (res.sessionId) setSessionId(res.sessionId);
          setMode("login");
          setStep("otp");
          startResendTimer();
          setTimeout(() => otpRefs.current[0]?.focus(), 50);
        } else {
          toast.info(res.message || "No account found. Let's get you registered.");
          setMode("register");
          setStep("register_details");
        }
      } else {
        toast.error(res.message || "Could not process request. Try again.");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegisterValid) {
      toast.warning("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendRegOtp({ name, email, phone });
      if (res.success) {
        toast.success(res.message || "OTP sent successfully");
        if (res.sessionId) setSessionId(res.sessionId);
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
      let res;
      if (mode === "login") {
        res = await verifyLoginOtp(phone, code, sessionId);
      } else {
        res = await verifyRegOtp({ name, email, phone }, code, sessionId);
      }

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
    let res;
    setLoading(true);
    try {
      if (mode === "login") {
        res = await checkPhone(phone); // checkPhone sends OTP again for existing users
      } else {
        res = await sendRegOtp({ name, email, phone });
      }
      if (res.success) {
        if (res.sessionId) setSessionId(res.sessionId);
        toast.info(res.message || "OTP resent successfully.");
        startResendTimer();
      } else {
        toast.error(res.message || "Could not resend OTP. Try again.");
      }
    } catch {
      toast.error("Could not resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
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

          {step === "phone" && (
            <>
              <h1>Login or Register</h1>
              <p className={styles["login-sub"]}>
                Enter your phone number to get started. We'll check if you have an account.
              </p>

              <form onSubmit={handlePhoneSubmit} className={styles["login-form"]}>
                <label className={styles["login-label"]}>Phone number</label>
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
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles["login-btn"]}
                  disabled={!isValidPhone || loading}
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </form>
            </>
          )}

          {step === "register_details" && (
            <>
              <button className={styles["login-back"]} onClick={() => setStep("phone")}>
                <ArrowLeft size={16} /> Back
              </button>
              <h1>Create an account</h1>
              <p className={styles["login-sub"]}>
                Looks like you're new here. Tell us a bit about yourself.
              </p>

              <form onSubmit={handleSendRegOtp} className={styles["login-form"]}>
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

                <label className={styles["login-label"]} style={{ marginTop: "4px" }}>Phone number</label>
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
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles["login-btn"]}
                  disabled={!isRegisterValid || loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <button className={styles["login-back"]} onClick={() => setStep(mode === "login" ? "phone" : "register_details")}>
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
