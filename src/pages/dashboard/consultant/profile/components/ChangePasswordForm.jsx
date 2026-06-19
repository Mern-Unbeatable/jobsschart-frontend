import React from "react";

const INPUT_CLASS =
  "w-full h-12 rounded-lg border border-gray-100 px-4 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";

export default function ChangePasswordForm({
  passwordForm,
  onChange,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-[#4c515b]">Change Password</h3>

      <div className="space-y-5">
        <div className="space-y-3">
          <label
            htmlFor="current-password"
            className="block text-base text-[#464646]"
          >
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={passwordForm.currentPassword || ""}
            onChange={(e) => onChange("currentPassword", e.target.value)}
            placeholder=".........."
            className={INPUT_CLASS}
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-3">
            <label
              htmlFor="new-password"
              className="block text-base text-[#464646]"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={passwordForm.newPassword || ""}
              onChange={(e) => onChange("newPassword", e.target.value)}
              placeholder=".........."
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="confirm-password"
              className="block text-base text-[#464646]"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={passwordForm.confirmPassword || ""}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="........."
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          className="h-8 rounded bg-green-500/60 px-4 text-sm font-medium text-white transition-colors duration-200 "
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
