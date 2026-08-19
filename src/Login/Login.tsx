import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { sendOtp, verifyOtp, OTP_LENGTH } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

type Step = "phone" | "otp";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || "/";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

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
    if (!isValidPhone) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep("otp");
      startResendTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch {
      setError("Could not send OTP. Try again.");
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
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      if (res.success && res.user) {
        login({ phone, name: res.user.name });
        navigate(redirectTo, { replace: true });
      } else {
        setError(res.message || "Invalid OTP. Try again.");
      }
    } catch {
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo">🍽️</span>
          <span>MESS MEALS</span>
        </div>

        {step === "phone" ? (
          <>
            <h1>Login with your phone</h1>
            <p className="login-sub">
              We'll send a one-time password to verify it's you.
            </p>

            <form onSubmit={handleSendOtp} className="login-form">
              <label className="login-label">Phone number</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">
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
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-btn"
                disabled={!isValidPhone || loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <button className="login-back" onClick={() => setStep("phone")}>
              <ArrowLeft size={16} /> Change number
            </button>

            <h1>Enter OTP</h1>
            <p className="login-sub">
              We've sent a {OTP_LENGTH}-digit code to +91 {phone}
            </p>

            <form onSubmit={handleVerify} className="login-form">
              <div className="otp-input-wrap">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-btn"
                disabled={otp.some((d) => !d) || loading}
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                className="resend-btn"
                disabled={resendIn > 0}
                onClick={async () => {
                  await sendOtp(phone);
                  startResendTimer();
                }}
              >
                {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
              </button>
            </form>
          </>
        )}

        <div className="login-trust">
          <ShieldCheck size={14} />
          Your number is safe with us and used only for booking updates.
        </div>
      </div>
    </div>
  );
}
