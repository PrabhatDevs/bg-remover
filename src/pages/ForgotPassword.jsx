import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthForm from "../components/Auth/AuthForm";
import { forgotPassword } from "../api/authApi";

const PENDING_FORGOT_EMAIL_KEY = "pending_forgot_email";

export default function ForgotPassword({
  onSignIn,
  onSignUp,
  currentUser,
  onLogout,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.email) {
      setErrorMessage("Email is required");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword({ email: form.email });
      sessionStorage.setItem(PENDING_FORGOT_EMAIL_KEY, form.email);
      toast.success(
        "OTP sent to your email. Please verify and set new password.",
      );
      navigate("/forgot-password/verify-otp");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
          mode="forgot"
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          errorMessage={errorMessage}
        />
      </main>

      <Footer />
    </div>
  );
}
