import React, { memo, useCallback, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ProfileAvatar from "./components/ProfileAvatar";
import AccountInfoForm from "./components/AccountInfoForm";
import AvailabilitySlots from "./components/AvailabilitySlots";
import VerificationSection from "./components/VerificationSection";
import ChangePasswordForm from "./components/ChangePasswordForm";
import {
  useGetMyConsultantProfileQuery,
  useUpdateMyConsultantProfileMutation,
  useGetMyAvailabilitySlotsQuery,
  useAddAvailabilitySlotsMutation,
  useUpdateAvailabilitySlotMutation,
  useDeleteAvailabilitySlotMutation,
} from "../../../../features/api/consultantApi";
import { useChangePasswordMutation } from "../../../../features/api/authApi";
import { useUpdateProfileMutation } from "../../../../features/api/userApi";
import { getApiErrorMessage } from "../../../../utils/apiErrorUtils";

const INITIAL_PROFILE = {
  name: "",
  email: "",
  phone: "",
  about: "",
  expertise: "",
  experience: "",
  language: "",
  location: "",
};

const ConsultantProfile = memo(() => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [slots, setSlots] = useState([]);

  // API Queries & Mutations
  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useGetMyConsultantProfileQuery();
  const { data: slotsData, isLoading: isSlotsLoading } = useGetMyAvailabilitySlotsQuery();

  const [updateMyConsultantProfile] = useUpdateMyConsultantProfileMutation();
  const [addAvailabilitySlots] = useAddAvailabilitySlotsMutation();
  const [updateAvailabilitySlot] = useUpdateAvailabilitySlotMutation();
  const [deleteAvailabilitySlot] = useDeleteAvailabilitySlotMutation();
  const [changePassword] = useChangePasswordMutation();
  const [updateProfile] = useUpdateProfileMutation();

  // Initialize profile state from API response
  useEffect(() => {
    if (profileData?.profile) {
      const p = profileData.profile;
      setProfile({
        name: p.user?.name || "",
        email: p.user?.email || "",
        phone: p.user?.phone || "",
        about: p.bio || "",
        expertise: p.specialization?.join(", ") || "",
        experience: p.experience || "",
        language: p.user?.language || "",
        location: p.user?.location || "",
      });
    }
  }, [profileData]);

  // Initialize slots state from API response
  useEffect(() => {
    if (slotsData?.slots) {
      setSlots(slotsData.slots.map(s => ({
        id: s.id,
        day: s.dayLabel || s.dayOfWeek || s.day || 'Monday',
        from: s.startTime || s.from || '09:00',
        to: s.endTime || s.to || '21:00',
        dayOfWeek: s.dayOfWeek,
      })));
    } else if (Array.isArray(slotsData)) {
      setSlots(slotsData);
    }
  }, [slotsData]);

  const handleProfileChange = useCallback((field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordChange = useCallback((field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddTimeSlot = useCallback(async () => {
    const loadingToast = toast.loading("Adding time slot...");
    const newSlot = { day: "Sunday", from: "09:00", to: "21:00" };
    try {
      // Try array payload format first
      await addAvailabilitySlots({ slots: [newSlot] }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("New time slot added.");
    } catch (err) {
      try {
        // Fallback to flat payload format
        await addAvailabilitySlots(newSlot).unwrap();
        toast.dismiss(loadingToast);
        toast.success("New time slot added.");
      } catch (err2) {
        toast.dismiss(loadingToast);
        toast.error(getApiErrorMessage(err, "Failed to add time slot."));
      }
    }
  }, [addAvailabilitySlots]);

  const handleRemoveTimeSlot = useCallback(async (id) => {
    const loadingToast = toast.loading("Removing time slot...");
    try {
      await deleteAvailabilitySlot(id).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Time slot removed.");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getApiErrorMessage(err, "Failed to remove time slot."));
    }
  }, [deleteAvailabilitySlot]);

  const handleSlotChange = useCallback(async (id, field, value) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)),
    );

    const dayMap = {
      Sunday: 'SUNDAY', Monday: 'MONDAY', Tuesday: 'TUESDAY',
      Wednesday: 'WEDNESDAY', Thursday: 'THURSDAY', Friday: 'FRIDAY', Saturday: 'SATURDAY',
    };

    try {
      const payload = {};
      if (field === 'day') payload.dayOfWeek = dayMap[value] || value.toUpperCase();
      if (field === 'from') payload.startTime = value;
      if (field === 'to') payload.endTime = value;
      if (Object.keys(payload).length > 0) {
        await updateAvailabilitySlot({ slotId: id, ...payload }).unwrap();
      }
    } catch {
      // Silent fail on debounced edits — user can retry
    }
  }, [updateAvailabilitySlot]);

  const handleAvatarChange = useCallback(async (file) => {
    const loadingToast = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateProfile(formData).unwrap();
      refetchProfile();
      toast.dismiss(loadingToast);
      toast.success("Avatar updated successfully.");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getApiErrorMessage(err, "Failed to upload avatar."));
    }
  }, [updateProfile, refetchProfile]);

  const handleUpdateProfile = useCallback(async () => {
    const loadingToast = toast.loading("Updating profile...");
    try {
      const consultantPayload = {
        bio: profile.about,
        specialization: profile.expertise
          ? profile.expertise.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const userPayload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        language: profile.language,
      };

      await Promise.all([
        updateMyConsultantProfile(consultantPayload).unwrap(),
        updateProfile(userPayload).unwrap(),
      ]);

      refetchProfile();

      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getApiErrorMessage(err, "Failed to update profile."));
    }
  }, [profile, updateMyConsultantProfile, updateProfile, refetchProfile]);

  const handleChangePassword = useCallback(async () => {
    if (!passwordForm.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!passwordForm.newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match.");
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
      toast.success("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(getApiErrorMessage(err, "Failed to update password."));
    }
  }, [passwordForm, changePassword]);

  if (isProfileLoading || isSlotsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="dashboard-page-title">My Profile</h1>
        <p className="dashboard-page-subtitle ">
          Manage your account and store preferences.
        </p>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-8 lg:px-10 lg:py-12">
        <div className="space-y-8">
          <ProfileAvatar
            name={profileData?.profile?.user?.name || "Suima"}
            email={profileData?.profile?.user?.email || "suimlt61799@gmail.com"}
            avatar={profileData?.profile?.user?.avatar}
            onAvatarChange={handleAvatarChange}
          />

          <AccountInfoForm
            profile={profile}
            onChange={handleProfileChange}
            onUpdate={handleUpdateProfile}
          />

          <AvailabilitySlots
            slots={slots}
            onAdd={handleAddTimeSlot}
            onRemove={handleRemoveTimeSlot}
            onChange={handleSlotChange}
          />
        </div>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-8 lg:px-10 lg:py-12">
        <VerificationSection profile={profileData?.profile} />
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-8 lg:px-10 lg:py-12">
        <ChangePasswordForm
          passwordForm={passwordForm}
          onChange={handlePasswordChange}
          onSubmit={handleChangePassword}
        />
      </div>
    </section>
  );
});

ConsultantProfile.displayName = "ConsultantProfile";

export default ConsultantProfile;
