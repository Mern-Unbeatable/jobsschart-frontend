import React, { memo, useCallback, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
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
  const [addAvailabilitySlots, { isLoading: isAddingSlot }] =
    useAddAvailabilitySlotsMutation();
  const [updateAvailabilitySlot, { isLoading: isEditingSlot }] =
    useUpdateAvailabilitySlotMutation();
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

  // Initialize slots state from /availability/my-slots response
  useEffect(() => {
    const apiSlots = slotsData?.slots;
    if (!Array.isArray(apiSlots)) return;

    setSlots(
      apiSlots.map((s) => ({
        id: s.id,
        day: s.dayLabel || s.dayOfWeek || "Monday",
        dayOfWeek: s.dayOfWeek,
        from: (s.startTime || "09:00").slice(0, 5),
        to: (s.endTime || "17:00").slice(0, 5),
      })),
    );
  }, [slotsData]);

  const handleProfileChange = useCallback((field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordChange = useCallback((field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddTimeSlot = useCallback(async ({ dayOfWeek, startTime, endTime }) => {
    try {
      await addAvailabilitySlots({
        slots: [
          {
            dayOfWeek,
            startTime,
            endTime,
          },
        ],
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Time Slot Added",
        text: "Your availability slot has been saved successfully.",
        confirmButtonColor: "#6e35ae",
      });

      return true;
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Add Slot",
        text: getApiErrorMessage(err, "Failed to add time slot."),
        confirmButtonColor: "#6e35ae",
      });
      return false;
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

  const handleEditTimeSlot = useCallback(async (slotId, { dayOfWeek, startTime, endTime }) => {
    try {
      await updateAvailabilitySlot({
        slotId,
        dayOfWeek,
        startTime,
        endTime,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Time Slot Updated",
        text: "Your availability slot has been updated successfully.",
        confirmButtonColor: "#6e35ae",
      });

      return true;
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Update Slot",
        text: getApiErrorMessage(err, "Failed to update time slot."),
        confirmButtonColor: "#6e35ae",
      });
      return false;
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
            onEdit={handleEditTimeSlot}
            onRemove={handleRemoveTimeSlot}
            isAdding={isAddingSlot}
            isEditing={isEditingSlot}
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
