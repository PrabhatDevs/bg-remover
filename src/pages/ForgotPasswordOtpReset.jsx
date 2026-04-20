import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthForm from "../components/Auth/AuthForm";
import { resetPassword, resendForgotPasswordOtp } from "../api/authApi";

const PENDING_FORGOT_EMAIL_KEY = "pending_forgot_email";

const getPendingEmail = () =>
  sessionStorage.getItem(PENDING_FORGOT_EMAIL_KEY) || "";

export default function ForgotPasswordOtpReset({
  onSignIn,
  onSignUp,
  currentUser,
  onLogout,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState(() => getPendingEmail());
  const [form, setForm] = useState({
    email: getPendingEmail(),
    otp: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    const pendingEmail = getPendingEmail();
    setEmail(pendingEmail);

    if (!pendingEmail) {
      toast.info("Please send OTP first from Forgot Password page.");
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.otp || form.otp.trim().length !== 6) {
      setErrorMessage("Please enter a valid 6 digit OTP");
      return;
    }

    if (!form.password || !form.confirm) {
      setErrorMessage("Please enter new password and confirm password");
      return;
    }

    if (form.password !== form.confirm) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!email) {
      setErrorMessage("Session expired. Please try forgot password again.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    try {
      setLoading(true);
      await resetPassword({
        email,
        otp: form.otp.trim(),
        password: form.password,
        password_confirmation: form.confirm,
      });

      sessionStorage.removeItem(PENDING_FORGOT_EMAIL_KEY);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Session expired. Please try forgot password again.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    try {
      setResendLoading(true);
      await resendForgotPasswordOtp({ email });
      toast.success("OTP sent again to your email");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06050F] font-plus text-[#F0EEFF]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,rgba(79,70,229,.18)_0%,transparent_70%),radial-gradient(ellipse_60%_50%_at_85%_20%,rgba(124,58,237,.14)_0%,transparent_65%),radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(37,99,235,.12)_0%,transparent_65%),radial-gradient(ellipse_50%_40%_at_90%_90%,rgba(168,85,247,.10)_0%,transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.04)_1px,transparent_0)] bg-[length:12px_12px] opacity-20" />

      <Navbar
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
        <AuthForm
          mode="forgot-otp-reset"
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          errorMessage={errorMessage}
          otpEmail={email}
          onResendOtp={handleResendOtp}
          resendLoading={resendLoading}
        />

        <p className="mt-6 text-center text-sm text-[#8B85A8]">
          Wrong email?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Go back
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
