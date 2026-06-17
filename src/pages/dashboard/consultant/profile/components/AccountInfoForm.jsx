import React from "react";
import { ImagePlus } from "lucide-react";

const INPUT_CLASS =
  "w-full h-12 rounded-lg border border-gray-100 px-4 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-gray-100 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#989da1] focus:outline-none focus:ring-2 focus:ring-green-500/60";

export default function AccountInfoForm({ profile, onChange, onUpdate }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-[#4c515b]">
        Account Information
      </h3>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="profile-name" className="block text-base text-[#464646]">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={profile.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="profile-email" className="block text-base text-[#464646]">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={profile.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="profile-phone" className="block text-base text-[#464646]">
          Phone Number
        </label>
        <input
          id="profile-phone"
          type="text"
          value={profile.phone || ""}
          onChange={(e) => onChange("phone", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="profile-about" className="block text-base text-[#464646]">
          About Me
        </label>
        <textarea
          id="profile-about"
          rows={5}
          value={profile.about || ""}
          onChange={(e) => onChange("about", e.target.value)}
          className={TEXTAREA_CLASS}
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="profile-expertise" className="block text-base text-[#464646]">
          Areas Of Expertise
        </label>
        <textarea
          id="profile-expertise"
          rows={5}
          value={profile.expertise || ""}
          onChange={(e) => onChange("expertise", e.target.value)}
          className={TEXTAREA_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-3">
          <label htmlFor="profile-experience" className="block text-base text-[#464646]">
            Experience
          </label>
          <input
            id="profile-experience"
            type="text"
            value={profile.experience || ""}
            onChange={(e) => onChange("experience", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="profile-language" className="block text-base text-[#464646]">
            Language
          </label>
          <input
            id="profile-language"
            type="text"
            value={profile.language || ""}
            onChange={(e) => onChange("language", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="profile-location" className="block text-base text-[#464646]">
            Location
          </label>
          <input
            id="profile-location"
            type="text"
            value={profile.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onUpdate}
          className="h-8 rounded bg-green-500/60 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#ce9c0a]"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
