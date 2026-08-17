import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";

// ─── OTP Digit Input ──────────────────────────────────────────────────────────
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
    if (raw.length > 1) {
      const pasted = raw.slice(0, length);
      onChange(pasted.padEnd(length, "").slice(0, length));
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = raw;
    onChange(newDigits.join(""));
    if (index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-3">
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
          autoComplete="one-time-code"
          aria-label={`OTP digit ${i + 1}`}
          className={`w-10 h-12 text-center text-lg font-bold rounded-lg border outline-none transition
            ${hasError
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : digit
                ? "border-primary-500 bg-primary-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
        />
      ))}
    </div>
  );
};

// ─── RegisterPage ─────────────────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate();

  // step: "form" | "otp"
  const [step, setStep] = useState("form");
  const [pendingData, setPendingData] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef(null);

  const startCooldown = (seconds = 60) => {
    setResendCountdown(seconds);
    timerRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";
  const errorClass = "mt-1 text-xs text-red-600";

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const onSubmit = async (formData) => {
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

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
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

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await authService.sendOtp(pendingData);
      setOtpValue("");
      setOtpError("");
      startCooldown(60);
      toast.success("New OTP sent!");
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo — identical to original */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-2xl font-bold text-white">
            Q
          </div>
          <h1 className="text-xl font-semibold text-gray-800">QuizAI</h1>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          {/* ── STEP 1: Registration form (original UI) ── */}
          {step === "form" && (
            <>
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Create your account
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={inputClass}
                  />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className={inputClass}
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className={inputClass}
                  />
                  {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className={inputClass}
                  />
                  {errors.confirmPassword && (
                    <p className={errorClass}>{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>I am a</label>
                  <select
                    {...register("role", { required: "Please select a role" })}
                    className={inputClass}
                  >
                    <option value="">Select role</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                  {errors.role && <p className={errorClass}>{errors.role.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending OTP..." : "Register"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP verification (same card style) ── */}
          {step === "otp" && (
            <>
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Verify your email
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-700">{pendingData?.email}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Enter OTP</label>
                  <OtpDigitInput
                    length={6}
                    value={otpValue}
                    onChange={(val) => { setOtpValue(val); setOtpError(""); }}
                    hasError={!!otpError}
                  />
                  {otpError && <p className={errorClass + " text-center"}>{otpError}</p>}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? "Verifying..." : "Verify & Create Account"}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <button
                    onClick={() => { setStep("form"); setOtpValue(""); setOtpError(""); }}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    ← Change details
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    className="font-medium text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline transition"
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;