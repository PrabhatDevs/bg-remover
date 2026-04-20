import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ApiPage from "./pages/ApiPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FeaturesPage from "./pages/FeaturesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordOtpReset from "./pages/ForgotPasswordOtpReset";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import RegisterOtp from "./pages/RegisterOtp";

const LOCAL_USER_KEY = "pixelcut_user";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserFromAuthResponse = (payload) => {
  const userCandidate =
    payload?.user ||
    payload?.data?.user ||
    payload?.data ||
    payload?.result?.user ||
    payload?.result;

  if (!userCandidate || typeof userCandidate !== "object") {
    return null;
  }

  return {
    id: userCandidate.id || userCandidate.user_id || null,
    name: userCandidate.name || "New User",
    email: userCandidate.email || "",
    photoUrl: userCandidate.photoUrl || userCandidate.avatar || "",
    phone: userCandidate.phone || "",
    bio: userCandidate.bio || "",
  };
};

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  const persistUser = (user) => {
    if (!user) {
      localStorage.removeItem(LOCAL_USER_KEY);
      setCurrentUser(null);
      return;
    }

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleAuthSuccess = (payload, fallbackEmail) => {
    const apiUser = getUserFromAuthResponse(payload);
    const defaultName = fallbackEmail?.split("@")[0] || "User";

    persistUser(
      apiUser || {
        id: null,
        name: defaultName,
        email: fallbackEmail || "",
        photoUrl: "",
        phone: "",
        bio: "",
      },
    );
  };

  const pageProps = useMemo(
    () => ({
      onSignIn: () => navigate("/login"),
      onSignUp: () => navigate("/register"),
      currentUser,
      onLogout: () => persistUser(null),
    }),
    [currentUser, navigate],
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage {...pageProps} />} />
        <Route path="/gallery" element={<GalleryPage {...pageProps} />} />
        <Route path="/features" element={<FeaturesPage {...pageProps} />} />
        <Route path="/pricing" element={<PricingPage {...pageProps} />} />
        <Route path="/api" element={<ApiPage {...pageProps} />} />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login {...pageProps} onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Register {...pageProps} />
            )
          }
        />
        <Route
          path="/register/verify-otp"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterOtp {...pageProps} onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <ForgotPassword {...pageProps} />
            )
          }
        />
        <Route
          path="/forgot-password/verify-otp"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <ForgotPasswordOtpReset {...pageProps} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            currentUser ? (
              <ProfilePage
                {...pageProps}
                user={currentUser}
                onUserUpdate={persistUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ScrollToTopButton />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss={false}
        draggable
        style={{ zIndex: 999999 }}
      />
    </>
  );
}
