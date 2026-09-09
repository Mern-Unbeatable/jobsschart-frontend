import React, { useState } from "react";

export const isRealAvatarUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return !url.includes("ui-avatars.com");
};

/** Solid user silhouette used when no real profile photo is available. */
export const UserAvatarPlaceholder = ({
  className = "h-60 w-full",
  iconClassName = "h-20 w-20",
}) => (
  <div
    className={`flex items-center justify-center bg-[#E8E0F5] ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      className={`text-[#555555] ${iconClassName}`}
      fill="currentColor"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21.5c0-3.5 3.1-6 7-6s7 2.5 7 6v.5H5z" />
    </svg>
  </div>
);

/**
 * Consultant photo with User icon fallback for missing / ui-avatars / broken images.
 */
const ConsultantAvatar = ({
  src,
  alt = "Consultant",
  className = "h-60 w-full object-cover object-top",
  placeholderClassName,
  placeholderIconClassName,
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = isRealAvatarUrl(src) && !failed;

  if (!showImage) {
    return (
      <UserAvatarPlaceholder
        className={placeholderClassName}
        iconClassName={placeholderIconClassName}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ConsultantAvatar;
