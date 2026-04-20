import { useState } from "react";
import { FiMenu, FiStar, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { toast } from "react-toastify";

function Navbar({ onSignIn, onSignUp, currentUser, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ["Features", "Pricing", "Gallery", "API"];
  const routeMap = {
    Home: "/",
    Features: "/features",
    Pricing: "/pricing",
    Gallery: "/gallery",
    API: "/api",
  };

  const handleNavClick = (event, label) => {
    const target = routeMap[label];
    if (target) {
      event.preventDefault();
      navigate(target);
      setIsMenuOpen(false);
    }
  };

  const displayName = currentUser?.name || "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore API failure and still clear local auth state.
    }

    onLogout?.();
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-violet-500/15 bg-[#06050F]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-10">
        <button
          type="button"
          className="flex items-center gap-2.5"
          onClick={(event) => handleNavClick(event, "Home")}
        >
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-violet-600 to-blue-600 font-syne text-base font-extrabold text-white">
            <FiStar className="h-[18px] w-[18px]" />
          </div>
          <span className="font-syne text-lg font-extrabold text-[#F0EEFF]">
            PixoCut
            <span className="bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              AI
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((label) => (
            <a
              key={label}
              className="text-sm text-[#8B85A8] transition-colors hover:text-[#F0EEFF]"
              href="#"
              onClick={(event) => handleNavClick(event, label)}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 px-3.5 py-2 text-sm text-[#F0EEFF] transition hover:border-violet-400/60 hover:bg-violet-500/10"
              >
                {currentUser.photoUrl ? (
                  <img
                    src={currentUser.photoUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border border-violet-400/40 object-cover"
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white">
                    {initials || "U"}
                  </span>
                )}
                <span className="max-w-[130px] truncate">{displayName}</span>
              </button>
              <button
                type="button"
                className="rounded-full border border-violet-500/25 px-5 py-2.5 text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-full border border-violet-500/25 px-5 py-2.5 text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
                onClick={onSignIn}
              >
                Sign In
              </button>
              <button
                type="button"
                className="rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-[22px] py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
                onClick={onSignUp}
              >
                Sign Up Free
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/30 text-[#F0EEFF] lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMenu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-violet-500/20 px-10 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((label) => (
              <a
                key={label}
                className="text-sm text-[#8B85A8] transition-colors hover:text-[#F0EEFF]"
                href="#"
                onClick={(event) => handleNavClick(event, label)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="rounded-full border border-violet-500/25 px-5 py-2.5 text-sm font-medium text-[#F0EEFF] transition hover:border-violet-400/60 hover:bg-violet-500/10"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="rounded-full border border-violet-500/25 px-5 py-2.5 text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-full border border-violet-500/25 px-5 py-2.5 text-sm font-medium text-[#8B85A8] transition hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-[#F0EEFF]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignIn();
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-[22px] py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignUp();
                  }}
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
