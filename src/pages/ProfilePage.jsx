import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { updateUser, updateUserPassword, updateUserPhoto } from "../api/authApi";

export default function ProfilePage({
  user,
  onUserUpdate,
  onSignIn,
  onSignUp,
  currentUser,
  onLogout,
}) {
  const [detailsForm, setDetailsForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.photoUrl || "");

  const initials = useMemo(() => {
    const source = detailsForm.name || user?.name || "User";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [detailsForm.name, user?.name]);

  const handleDetailsUpdate = async (event) => {
    event.preventDefault();

    if (!detailsForm.name || !detailsForm.email) {
      toast.warning("Name and email are required");
      return;
    }

    const nextUser = {
      ...user,
      ...detailsForm,
      photoUrl: avatarPreview || user?.photoUrl || "",
    };

    onUserUpdate(nextUser);

    try {
      await updateUser(detailsForm);
      toast.success("Profile details updated");
    } catch (error) {
      toast.info("Profile updated locally. API sync failed for now.");
      console.log(error.response?.data || error);
    }
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.warning("Please fill new password and confirm password");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warning("New password and confirm password do not match");
      return;
    }

    try {
      await updateUserPassword({
        current_password: passwordForm.currentPassword,
        password: passwordForm.newPassword,
        password_confirmation: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
      console.log(error.response?.data || error);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const nextUser = {
      ...user,
      ...detailsForm,
      photoUrl: previewUrl,
    };
    onUserUpdate(nextUser);

    try {
      const response = await updateUserPhoto(file);
      const serverPhoto =
        response?.data?.avatar || response?.avatar || response?.data?.photoUrl;

      if (serverPhoto) {
        onUserUpdate({
          ...nextUser,
          photoUrl: serverPhoto,
        });
      }

      toast.success("Profile picture updated");
    } catch (error) {
      toast.info("Profile picture updated locally. API sync failed for now.");
      console.log(error.response?.data || error);
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

      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
        <div className="mb-8 rounded-[26px] border border-violet-500/25 bg-[rgba(18,15,40,.74)] p-6 backdrop-blur-xl md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300/90">
            Your Account
          </p>
          <h1 className="mt-2 font-syne text-[clamp(28px,4vw,46px)] font-extrabold">
            Profile Settings
          </h1>
          <p className="mt-2 max-w-[680px] text-sm text-[#A9A2C8] md:text-base">
            Login ke baad yahan se aap apni profile details, password aur photo
            update kar sakte ho.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-[24px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] p-6 backdrop-blur-xl">
            <h2 className="font-syne text-xl font-bold">Profile Picture</h2>

            <div className="mt-5 flex flex-col items-center rounded-2xl border border-violet-500/25 bg-[#0f0c22]/70 p-5">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="h-28 w-28 rounded-full border border-violet-400/40 object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-3xl font-bold text-white">
                  {initials || "U"}
                </div>
              )}

              <p className="mt-4 text-sm font-semibold text-[#F0EEFF]">
                {detailsForm.name || "New User"}
              </p>
              <p className="mt-1 text-xs text-[#8B85A8]">
                {detailsForm.email || "No email"}
              </p>

              <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                Upload Profile Pic
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <form
              onSubmit={handleDetailsUpdate}
              className="rounded-[24px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] p-6 backdrop-blur-xl"
            >
              <h2 className="font-syne text-xl font-bold">Update Details</h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Full name"
                  value={detailsForm.name}
                  onChange={(event) =>
                    setDetailsForm({ ...detailsForm, name: event.target.value })
                  }
                />

                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Email"
                  type="email"
                  value={detailsForm.email}
                  onChange={(event) =>
                    setDetailsForm({ ...detailsForm, email: event.target.value })
                  }
                />

                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Phone"
                  value={detailsForm.phone}
                  onChange={(event) =>
                    setDetailsForm({ ...detailsForm, phone: event.target.value })
                  }
                />

                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Short bio"
                  value={detailsForm.bio}
                  onChange={(event) =>
                    setDetailsForm({ ...detailsForm, bio: event.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="mt-5 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
              >
                Save Details
              </button>
            </form>

            <form
              onSubmit={handlePasswordUpdate}
              className="rounded-[24px] border border-violet-500/25 bg-[rgba(18,15,40,.72)] p-6 backdrop-blur-xl"
            >
              <h2 className="font-syne text-xl font-bold">Update Password</h2>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Current password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: event.target.value,
                    })
                  }
                />

                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="New password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: event.target.value,
                    })
                  }
                />

                <input
                  className="w-full rounded-xl border border-violet-500/30 bg-white/5 px-4 py-[13px] text-[15px] text-[#F0EEFF] outline-none transition placeholder:text-[#8B85A8] focus:border-violet-500/80 focus:bg-violet-500/10"
                  placeholder="Confirm new password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: event.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="mt-5 rounded-full border border-violet-500/35 px-6 py-3 text-sm font-semibold text-[#F0EEFF] transition hover:border-violet-400/60 hover:bg-violet-500/10"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
