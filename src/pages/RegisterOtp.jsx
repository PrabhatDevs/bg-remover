import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthForm from "../components/Auth/AuthForm";
import {
  loginUser,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "../api/authApi";

const PENDING_REGISTER_KEY = "pending_register_payload";

const getPendingRegister = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_REGISTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function RegisterOtp({
  onSignIn,
  onSignUp,
  currentUser,
  onLogout,
  onAuthSuccess,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState(() => getPendingRegister());
  const [form, setForm] = useState({
    email: getPendingRegister()?.email || "",
    otp: "",
  });

  useEffect(() => {
    const latest = getPendingRegister();
    setPending(latest);

    if (!latest) {
      toast.info("Pehle register karo, phir OTP verify karo");
      navigate("/register", { replace: true });
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

    if (!pending) {
      setErrorMessage("Session expired. Please register again.");
      navigate("/register", { replace: true });
      return;
    }

    try {
      setLoading(true);
      await verifyRegistrationOtp({
        email: pending.email,
        otp: form.otp.trim(),
      });

      const loginResponse = await loginUser({
        email: pending.email,
        password: pending.password,
      });

      sessionStorage.removeItem(PENDING_REGISTER_KEY);
      toast.success("Account created successfully");
      onAuthSuccess?.(loginResponse, pending.email);
      navigate("/profile");
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");

    if (!pending) {
      setErrorMessage("Session expired. Please register again.");
      navigate("/register", { replace: true });
      return;
    }

    try {
      setResendLoading(true);
      await resendRegistrationOtp({ email: pending.email });
      toast.success("Naya OTP aapke email par bhej diya gaya hai");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!pending) {
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
          mode="register-otp"
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          errorMessage={errorMessage}
          otpEmail={pending.email}
          onResendOtp={handleResendOtp}
          resendLoading={resendLoading}
        />

        <p className="mt-6 text-center text-sm text-[#8B85A8]">
          Wrong details?{" "}
          <Link
            to="/register"
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            Register again
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
