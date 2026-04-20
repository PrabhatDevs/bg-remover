import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

function AuthForm({
  mode,
  form,
  onChange,
  onSubmit,
  loading = false,
  errorMessage = "",
  otpEmail = "",
  onResendOtp,
  resendLoading = false,
}) {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isRegisterOtp = mode === "register-otp";
  const isForgotOtpReset = mode === "forgot-otp-reset";

  const title = isForgot
    ? "Forgot Password"
    : isRegisterOtp
      ? "Verify OTP"
      : isForgotOtpReset
        ? "Reset Your Password"
        : isRegister
          ? "Create your account"
          : "Welcome back";

  const subtitle = isForgot
    ? "Enter your email to get reset instructions"
    : isRegisterOtp
      ? "Enter the 6 digit OTP sent to your email"
      : isForgotOtpReset
        ? "Enter OTP and set your new password"
        : isRegister
          ? "Start removing backgrounds for free"
          : "Sign in to continue to PixelCut";

  const submitLabel = isForgot
    ? "Send reset instructions"
    : isRegisterOtp
      ? "Verify OTP"
      : isForgotOtpReset
        ? "Reset Password"
        : isRegister
          ? "Create Account"
          : "Sign In";

  return (
    <section className="relative z-10 mx-auto w-full max-w-[500px] rounded-[28px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] px-6 pb-8 pt-8 backdrop-blur-xl md:px-10">
      <h1 className="font-syne text-[32px] font-extrabold text-[#F0EEFF]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[#8B85A8]">{subtitle}</p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit}>
        {isRegister && (
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your full name"
          />
        )}

        {!isRegisterOtp && !isForgotOtpReset ? (
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
          />
        ) : (
          <p className="rounded-xl border border-violet-500/30 bg-white/5 px-4 py-3 text-sm text-[#CFCBE7]">
            OTP sent to{" "}
            <span className="font-semibold text-[#F0EEFF]">{otpEmail}</span>
          </p>
        )}

        {!isForgot && !isRegisterOtp && (
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter your password"
          />
        )}

        {(isRegister || isForgotOtpReset) && (
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={onChange}
            placeholder="Re-enter your password"
          />
        )}

        {(isRegisterOtp || isForgotOtpReset) && (
          <Input
            label="OTP"
            name="otp"
            value={form.otp}
            onChange={onChange}
            placeholder="Enter 6 digit OTP"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        )}

        {errorMessage ? (
          <p className="text-sm text-rose-300">{errorMessage}</p>
        ) : null}

        {!isRegister && !isForgot && !isRegisterOtp && !isForgotOtpReset ? (
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-[13px] text-violet-300 hover:text-violet-200"
            >
              Forgot password?
            </Link>
          </div>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Please wait..." : submitLabel}
        </Button>

        {(isRegisterOtp || isForgotOtpReset) && onResendOtp ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onResendOtp}
            disabled={resendLoading || loading}
          >
            {resendLoading ? "Sending OTP..." : "Resend OTP"}
          </Button>
        ) : null}
      </form>

      {isForgot ? (
        <p className="mt-5 text-center text-sm text-[#8B85A8]">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Sign In
          </Link>
        </p>
      ) : isRegisterOtp ? (
        <p className="mt-5 text-center text-sm text-[#8B85A8]">
          Wrong email?{" "}
          <Link
            to="/register"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Go back
          </Link>
        </p>
      ) : isForgotOtpReset ? (
        <p className="mt-5 text-center text-sm text-[#8B85A8]">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Sign In
          </Link>
        </p>
      ) : (
        <p className="mt-5 text-center text-sm text-[#8B85A8]">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      )}
    </section>
  );
}

export default AuthForm;
