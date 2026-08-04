import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const INPUT_CLASS =
  "w-full h-12 rounded-lg border border-gray-100 px-4 pr-12 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "..........",
  visible,
  onToggle,
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-base text-[#464646]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={INPUT_CLASS}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-700"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm({
  passwordForm,
  onChange,
  onSubmit,
}) {
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-[#4c515b]">Change Password</h3>

      <div className="space-y-5">
        <PasswordField
          id="current-password"
          label="Current Password"
          value={passwordForm.currentPassword}
          onChange={(value) => onChange("currentPassword", value)}
          visible={visibility.currentPassword}
          onToggle={() => toggleVisibility("currentPassword")}
        />

        <div className="grid grid-cols-1 gap-5">
          <PasswordField
            id="new-password"
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(value) => onChange("newPassword", value)}
            visible={visibility.newPassword}
            onToggle={() => toggleVisibility("newPassword")}
          />

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(value) => onChange("confirmPassword", value)}
            placeholder="........."
            visible={visibility.confirmPassword}
            onToggle={() => toggleVisibility("confirmPassword")}
          />
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
