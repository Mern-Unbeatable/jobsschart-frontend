import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { selectUser, updateUser } from "../../../features/slices/authSlice";
import { useGetMeQuery, useUpdateProfileMutation } from "../../../features/api/userApi";
import { useChangePasswordMutation } from "../../../features/api/authApi";
import ProfileAvatar from "../consultant/profile/components/ProfileAvatar";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { data: apiUserData, isLoading, refetch } = useGetMeQuery();
  const reduxUser = useSelector(selectUser);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const currentUser = apiUserData?.user || apiUserData || reduxUser;

  // Forms state
  const [infoForm, setInfoForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [infoErrors, setInfoErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Show/Hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync user details to form
  useEffect(() => {
    if (currentUser) {
      setInfoForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  const handleInfoChange = (field) => (e) => {
    setInfoForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (infoErrors[field]) {
      setInfoErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdateInfo = async () => {
    const nextErrors = {};

    if (!infoForm.name.trim()) {
      nextErrors.name = "Username is required";
    }

    if (!infoForm.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(infoForm.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (Object.keys(nextErrors).length > 0) {
      setInfoErrors(nextErrors);
      return;
    }

    const loadingToast = toast.loading("Updating profile details...");
    try {
      await updateProfile({
        name: infoForm.name.trim(),
        email: infoForm.email.trim(),
        phone: infoForm.phone.trim(),
      }).unwrap();
      refetch();
      toast.dismiss(loadingToast);
      toast.success("Profile details updated successfully");
      setInfoErrors({});
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to update profile details");
    }
  };

  const handleAvatarChange = useCallback(async (file) => {
    const loadingToast = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const result = await updateProfile(formData).unwrap();
      const updatedUser = result?.user || result;
      if (updatedUser) {
        dispatch(updateUser(updatedUser));
      }
      refetch();
      toast.dismiss(loadingToast);
      toast.success("Avatar updated successfully.");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to upload avatar.");
    }
  }, [updateProfile, refetch, dispatch]);

  const handleUpdatePassword = async () => {
    const nextErrors = {};

    if (!passwordForm.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword.trim()) {
      nextErrors.newPassword = "New password is required";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return;
    }

    const loadingToast = toast.loading("Updating password...");
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="dashboard-page-title">
          {t("dashboard.user.profile.title")}
        </h1>
        <p className="dashboard-page-subtitle">
          {t("dashboard.user.profile.subtitle")}
        </p>
      </header>

      <div className="space-y-6">
        {/* Profile Details Card */}
        <section className="rounded-[20px] border border-gray-100 bg-white px-5 py-8 md:px-10 md:py-12 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              name={currentUser?.name || "User"}
              email={currentUser?.email || ""}
              avatar={currentUser?.avatar}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-[#4c515b]">
              {t("dashboard.user.profile.accountInformationTitle")}
            </h2>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <label className="space-y-3 block">
                <span className="block text-base text-[#464646]">
                  {t("dashboard.user.profile.usernameLabel")}
                </span>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={handleInfoChange("name")}
                  className="h-12 w-full rounded-lg border border-gray-100 px-4 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
                />
                {infoErrors.name && (
                  <p className="text-xs text-red-500">{infoErrors.name}</p>
                )}
              </label>

              <label className="space-y-3 block">
                <span className="block text-base text-[#464646]">
                  {t("dashboard.user.profile.emailLabel")}
                </span>
                <input
                  type="email"
                  value={infoForm.email}
                  onChange={handleInfoChange("email")}
                  className="h-12 w-full rounded-lg border border-gray-100 px-4 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
                />
                {infoErrors.email && (
                  <p className="text-xs text-red-500">{infoErrors.email}</p>
                )}
              </label>
            </div>

            <label className="space-y-3 block">
              <span className="block text-base text-[#464646]">
                {t("dashboard.user.profile.phoneLabel")}
              </span>
              <input
                type="tel"
                value={infoForm.phone}
                onChange={handleInfoChange("phone")}
                className="h-12 w-full rounded-lg border border-gray-100 px-4 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
              />
            </label>
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleUpdateInfo}
              disabled={isUpdatingProfile}
              className="px-6 py-2.5 bg-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold rounded-lg transition-colors"
            >
              {t("dashboard.user.profile.updateProfileButton")}
            </button>
          </div>
        </section>

        {/* Change Password Card */}
        <section className="rounded-[20px] border border-gray-100 bg-white px-5 py-8 md:px-10 md:py-12 flex flex-col gap-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-[#4c515b]">
              {t("dashboard.user.profile.changePasswordTitle")}
            </h2>

            <div className="flex flex-col gap-5">
              {/* Current Password */}
              <div className="flex flex-col gap-3">
                <span className="block text-base text-[#464646]">
                  Current Password
                </span>
                <div className="relative w-full">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
                    autoComplete="current-password"
                    className="h-12 w-full rounded-lg border border-gray-100 pl-4 pr-10 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-3">
                <span className="block text-base text-[#464646]">
                  {t("dashboard.user.profile.newPasswordLabel")}
                </span>
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange("newPassword")}
                    autoComplete="new-password"
                    className="h-12 w-full rounded-lg border border-gray-100 pl-4 pr-10 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-3">
                <span className="block text-base text-[#464646]">
                  {t("dashboard.user.profile.confirmPasswordLabel")}
                </span>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange("confirmPassword")}
                    autoComplete="new-password"
                    className="h-12 w-full rounded-lg border border-gray-100 pl-4 pr-10 text-sm text-[#4c515b] placeholder:text-[#989da1] outline-none transition-colors focus:border-green-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={isChangingPassword}
              className="px-6 py-2.5 bg-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold rounded-lg transition-colors"
            >
              {t("dashboard.user.profile.updatePasswordButton")}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserProfile;
