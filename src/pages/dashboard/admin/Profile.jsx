import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { selectUser } from "../../../features/slices/authSlice";
import { useGetMeQuery, useUpdateProfileMutation } from "../../../features/api/userApi";
import { useChangePasswordMutation } from "../../../features/api/authApi";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Component ────────────────────────────────────────────────────────────────

const Profile = () => {
  const { data: apiUserData, isLoading, refetch } = useGetMeQuery();
  const reduxUser = useSelector(selectUser);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const currentUser = apiUserData?.user || apiUserData || reduxUser;

  const [infoForm, setInfoForm] = useState({
    fullName: "",
    email: "",
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

  // Sync user details to info form state
  useEffect(() => {
    if (currentUser) {
      setInfoForm({
        fullName: currentUser.name || "",
        email: currentUser.email || "",
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

    if (!infoForm.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
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
        name: infoForm.fullName.trim(),
        email: infoForm.email.trim(),
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="dashboard-page-title">{currentUser?.name || "Admin User"}</h1>
        <p className="dashboard-page-subtitle mt-1">
          {currentUser?.role || "Super Administrator"} &bull; Full Access
        </p>
      </div>

      {/* Account Details card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>

        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Admin User"
              value={infoForm.fullName}
              onChange={handleInfoChange("fullName")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-white focus:outline-none"
            />
            {infoErrors.fullName && (
              <p className="text-xs text-red-500">{infoErrors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@proconsult.com"
              value={infoForm.email}
              onChange={handleInfoChange("email")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-white focus:outline-none"
            />
            {infoErrors.email && (
              <p className="text-xs text-red-500">{infoErrors.email}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleUpdateInfo}
            disabled={isUpdatingProfile}
            className="px-6 py-2.5 bg-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold rounded-lg transition-colors"
          >
            Update Info
          </button>
        </div>
      </div>

      {/* Change Password card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>

        <div className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative w-full">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange("currentPassword")}
                autoComplete="current-password"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-white focus:outline-none"
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
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700">
              New Password
            </label>
            <div className="relative w-full">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange("newPassword")}
                autoComplete="new-password"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-white focus:outline-none"
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
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange("confirmPassword")}
                autoComplete="new-password"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-white focus:outline-none"
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

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={isChangingPassword}
            className="px-6 py-2.5 bg-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold rounded-lg transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
