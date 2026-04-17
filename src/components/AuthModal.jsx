import {
  deleteUser,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from "../api/authApi";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { toast } from "react-toastify";
import { FaApple, FaGoogle } from "react-icons/fa";
import { FiStar, FiX } from "react-icons/fi";

function AuthModal({ mode, onClose, onSwitch, onLoginSuccess }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const isSignUp = mode === "signup";
  const isForgot = mode === "forgot";

  // ✅ Signup Function
  const handleSignup = async () => {
    try {
      if (!form.name || !form.email || !form.password || !form.confirm) {
        toast.warning("All fields are required");
        return;
      }

      if (form.password !== form.confirm) {
        toast.warning("Passwords do not match");
        return;
      }

      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log(res);
      toast.success("Account created successfully");
      onSwitch("signin");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // ✅ Login Function
  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        toast.warning("Email and password are required");
        return;
      }

      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log(res);
      onLoginSuccess?.(res, form.email);
      toast.success("Login successful");
      onClose();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Forgot Password Function

  const handleForgot = async () => {
    try {
      if (!form.email) {
        toast.warning("Email is required");
        return;
      }

      const res = await forgotPassword({
        email: form.email,
      });

      console.log(res);
      toast.success("Reset link sent");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };

  // ✅ Reset Password Function

  const handleReset = async () => {
    try {
      if (!form.password || !form.confirm) {
        toast.warning("All fields are required");
        return;
      }

      if (form.password !== form.confirm) {
        toast.warning("Passwords do not match");
        return;
      }

      const res = await resetPassword({
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });

      console.log(res);
      toast.success("Password reset successfully");
      onSwitch("signin");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      console.log(res);
      toast.success("Logged out successfully");
      onClose();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  // Get User Function
  const handleGetUser = async () => {
    try {
      const res = await getUser();
      console.log(res);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to get user");
    }
  };

  // Update User Function
  const handleUpdateUser = async () => {
    try {
      const res = await updateUser({
        name: form.name,
        email: form.email,
      });
      console.log(res);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  // Delete User Function
  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser();
      console.log(res);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 },
    ).fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" },
      "-=0.1",
    );
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(cardRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      duration: 0.25,
    }).to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06050F]/85 px-4 backdrop-blur-md"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[460px] rounded-[28px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] px-10 pb-9 pt-10 backdrop-blur-xl"
      >
        <button
          onClick={handleClose}
          type="button"
          className="absolute right-[18px] top-[18px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-lg text-[#8B85A8]"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* HEADER */}
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-600 to-blue-600 text-lg">
              <FiStar className="h-4.5 w-4.5" />
            </div>
            <span className="font-syne text-[17px] font-bold text-[#F0EEFF]">
              PixelCut AI
            </span>
          </div>

          <h2 className="mb-1 font-syne text-[26px] font-extrabold text-[#F0EEFF]">
            {isForgot
              ? "Forgot Password?"
              : isSignUp
                ? "Create your account"
                : "Welcome back"}
          </h2>

          <p className="text-sm text-[#8B85A8]">
            {isForgot
              ? "Enter your email to reset password"
              : isSignUp
                ? "Start removing backgrounds for free"
                : "Sign in to continue to PixelCut"}
          </p>
        </div>

        {/* SOCIAL */}
        {!isForgot && (
          <>
            <div className="mb-5 grid grid-cols-2 gap-2.5">
              {[
                { label: "Google", icon: <FaGoogle className="h-3.5 w-3.5" /> },
                { label: "Apple", icon: <FaApple className="h-3.5 w-3.5" /> },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-violet-500/25 py-[11px] text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-violet-500/25" />
              <span className="text-xs text-[#8B85A8]">or</span>
              <div className="h-px flex-1 bg-violet-500/25" />
            </div>
          </>
        )}

        {/* INPUTS */}
        <div className="flex flex-col gap-3">
          {isSignUp && (
            <input
              className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {!isForgot && (
            <input
              className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          {isSignUp && (
            <input
              className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
              placeholder="Confirm password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          )}
        </div>

        {/* FORGOT LINK */}
        {!isSignUp && !isForgot && (
          <div className="mt-2 text-right">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitch("forgot");
              }}
              className="text-[13px] text-violet-300"
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* BUTTON */}
        <button
          type="button"
          onClick={
            isSignUp ? handleSignup : isForgot ? handleForgot : handleLogin
          }
          className="mt-5 w-full rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
        >
          {isForgot
            ? "Send reset instructions"
            : isSignUp
              ? "Create Account"
              : "Sign In"}
        </button>

        {/* SWITCH */}
        {isForgot ? (
          <p className="mt-[18px] text-center text-sm text-[#8B85A8]">
            Remember your password?{" "}
            <span
              onClick={() => onSwitch("signin")}
              className="cursor-pointer font-medium text-violet-300"
            >
              Sign In
            </span>
          </p>
        ) : (
          <p className="mt-[18px] text-center text-sm text-[#8B85A8]">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => onSwitch(isSignUp ? "signin" : "signup")}
              className="cursor-pointer font-medium text-violet-300"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
