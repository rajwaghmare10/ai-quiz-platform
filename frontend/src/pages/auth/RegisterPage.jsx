import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .otp-register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .otp-register-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 60%);
    pointer-events: none;
  }

  .otp-card {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  .otp-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }

  .otp-logo-icon {
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.35);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }

  .otp-logo-name {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin: 0;
  }

  .otp-panel {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 36px 36px 32px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.5);
  }

  .otp-panel-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 6px;
    letter-spacing: -0.3px;
  }

  .otp-panel-subtitle {
    font-size: 13.5px;
    color: #6b7280;
    margin: 0 0 28px;
    line-height: 1.5;
  }

  .otp-field {
    margin-bottom: 18px;
  }

  .otp-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  .otp-input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fff;
    box-sizing: border-box;
  }

  .otp-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .otp-input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
  }

  .otp-select {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fff;
    box-sizing: border-box;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;
    padding-right: 38px;
  }

  .otp-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .otp-error-text {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
    font-weight: 500;
  }

  .otp-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #fff;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    letter-spacing: 0.1px;
    margin-top: 6px;
  }

  .otp-btn:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  }

  .otp-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .otp-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── OTP Digit Boxes ── */
  .otp-digit-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 8px 0 20px;
  }

  .otp-digit-box {
    width: 52px;
    height: 60px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    color: #4338ca;
    text-align: center;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    background: #fafafa;
    caret-color: #6366f1;
  }

  .otp-digit-box:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
  }

  .otp-digit-box.filled {
    border-color: #6366f1;
    background: #f0f0ff;
  }

  .otp-digit-box.otp-error {
    border-color: #ef4444;
    background: #fff5f5;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
  }

  /* ── Email badge ── */
  .otp-email-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f0f0ff;
    border: 1px solid #c7d2fe;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 24px;
    font-size: 13.5px;
    color: #4338ca;
    font-weight: 500;
  }

  .otp-email-badge svg {
    flex-shrink: 0;
    color: #6366f1;
  }

  /* ── Resend ── */
  .otp-resend-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 18px;
    font-size: 13px;
    color: #6b7280;
  }

  .otp-resend-btn {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #6366f1;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
  }

  .otp-resend-btn:disabled {
    color: #9ca3af;
    cursor: default;
  }

  .otp-resend-btn:hover:not(:disabled) {
    text-decoration: underline;
  }

  .otp-change-email {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    margin-top: 10px;
    display: block;
    width: 100%;
    text-align: center;
    transition: color 0.2s;
  }

  .otp-change-email:hover {
    color: #374151;
  }

  /* ── Step indicator ── */
  .otp-steps {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .otp-step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e5e7eb;
    transition: all 0.3s;
  }

  .otp-step-dot.active {
    background: #6366f1;
    width: 24px;
    border-radius: 4px;
  }

  .otp-step-dot.done {
    background: #a5b4fc;
  }

  /* ── Login link ── */
  .otp-login-link {
    text-align: center;
    font-size: 13.5px;
    color: #6b7280;
    margin-top: 22px;
  }

  .otp-login-link a {
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
  }

  .otp-login-link a:hover {
    text-decoration: underline;
  }

  /* ── Spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .otp-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
`;

// ─── OTP Digit Input Component ────────────────────────────────────────────────
const OtpDigitInput = ({ length = 6, value, onChange, hasError }) => {
  const inputRefs = useRef([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e, index) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;

    // Handle paste of full OTP
    if (raw.length > 1) {
      const pasted = raw.slice(0, length);
      onChange(pasted.padEnd(length, "").slice(0, length));
      const focusIdx = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = raw;
    onChange(newDigits.join(""));
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length).trimEnd());
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="otp-digit-group">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`otp-digit-box${digit ? " filled" : ""}${hasError ? " otp-error" : ""}`}
          aria-label={`OTP digit ${i + 1}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

// ─── Main RegisterPage ────────────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate();

  // step: "form" | "otp"
  const [step, setStep] = useState("form");
  const [pendingData, setPendingData] = useState(null); // { name, email, password, role }
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Resend cooldown
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef(null);

  const startCooldown = (seconds = 60) => {
    setResendCountdown(seconds);
    timerRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const onFormSubmit = async (formData) => {
    try {
      const { name, email, password, role } = formData;
      await authService.sendOtp({ name, email, password, role });
      setPendingData({ name, email, password, role });
      setStep("otp");
      setOtpValue("");
      setOtpError("");
      startCooldown(60);
      toast.success("OTP sent! Check your inbox.");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otpValue.replace(/\s/g, "").length < 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setOtpError("");
    setIsVerifying(true);
    try {
      await authService.verifyOtp({ email: pendingData.email, otp: otpValue });
      toast.success("Account verified! Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Verification failed. Please try again.";
      setOtpError(message);
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await authService.sendOtp(pendingData);
      setOtpValue("");
      setOtpError("");
      startCooldown(60);
      toast.success("New OTP sent!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="otp-register-page">
        <div className="otp-card">
          {/* Logo */}
          <div className="otp-logo">
            <div className="otp-logo-icon">Q</div>
            <h1 className="otp-logo-name">QuizAI</h1>
          </div>

          <div className="otp-panel">
            {/* Step indicator */}
            <div className="otp-steps">
              <div className={`otp-step-dot ${step === "form" ? "active" : "done"}`} />
              <div className={`otp-step-dot ${step === "otp" ? "active" : ""}`} />
            </div>

            {/* ── STEP 1: Registration Form ─────────────────────────────── */}
            {step === "form" && (
              <>
                <h2 className="otp-panel-title">Create your account</h2>
                <p className="otp-panel-subtitle">
                  Fill in your details — we'll verify your email with a one-time code.
                </p>

                <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                  <div className="otp-field">
                    <label className="otp-label">Full Name</label>
                    <input
                      id="reg-name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`otp-input${errors.name ? " error" : ""}`}
                      placeholder="Jane Smith"
                    />
                    {errors.name && <p className="otp-error-text">{errors.name.message}</p>}
                  </div>

                  <div className="otp-field">
                    <label className="otp-label">Email Address</label>
                    <input
                      id="reg-email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                      })}
                      className={`otp-input${errors.email ? " error" : ""}`}
                      placeholder="jane@example.com"
                    />
                    {errors.email && <p className="otp-error-text">{errors.email.message}</p>}
                  </div>

                  <div className="otp-field">
                    <label className="otp-label">Password</label>
                    <input
                      id="reg-password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                      })}
                      className={`otp-input${errors.password ? " error" : ""}`}
                      placeholder="At least 6 characters"
                    />
                    {errors.password && <p className="otp-error-text">{errors.password.message}</p>}
                  </div>

                  <div className="otp-field">
                    <label className="otp-label">I am a</label>
                    <select
                      id="reg-role"
                      {...register("role", { required: "Please select a role" })}
                      className={`otp-select${errors.role ? " error" : ""}`}
                    >
                      <option value="">Select role…</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                    {errors.role && <p className="otp-error-text">{errors.role.message}</p>}
                  </div>

                  <button
                    id="reg-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="otp-btn"
                  >
                    {isSubmitting ? (
                      <><span className="otp-spinner" />Sending OTP…</>
                    ) : (
                      "Continue →"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── STEP 2: OTP Verification ──────────────────────────────── */}
            {step === "otp" && (
              <>
                <h2 className="otp-panel-title">Verify your email</h2>
                <p className="otp-panel-subtitle">
                  We sent a 6-digit code to:
                </p>

                <div className="otp-email-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {pendingData?.email}
                </div>

                <label className="otp-label" style={{ textAlign: "center", display: "block" }}>
                  Enter verification code
                </label>

                <OtpDigitInput
                  length={6}
                  value={otpValue}
                  onChange={(val) => { setOtpValue(val); setOtpError(""); }}
                  hasError={!!otpError}
                />

                {otpError && (
                  <p className="otp-error-text" style={{ textAlign: "center", marginBottom: "12px", marginTop: "-12px" }}>
                    {otpError}
                  </p>
                )}

                <button
                  id="otp-verify-btn"
                  className="otp-btn"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <><span className="otp-spinner" />Verifying…</>
                  ) : (
                    "Verify & Create Account"
                  )}
                </button>

                <div className="otp-resend-row">
                  <span>Didn't receive it?</span>
                  <button
                    id="otp-resend-btn"
                    className="otp-resend-btn"
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                  </button>
                </div>

                <button
                  className="otp-change-email"
                  onClick={() => { setStep("form"); setOtpValue(""); setOtpError(""); }}
                >
                  ← Change details
                </button>
              </>
            )}
          </div>

          <p className="otp-login-link">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;