import React, { useRef, useState, useEffect } from "react";
import { User, Camera } from "lucide-react";

export default function ProfileAvatar({
  name = "Suima",
  email = "suimlt61799@gmail.com",
  avatar,
  onAvatarChange,
}) {
  const fileInputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  // Reset local preview when the updated avatar URL comes in from backend
  useEffect(() => {
    setLocalPreview(null);
  }, [avatar]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      if (onAvatarChange) {
        onAvatarChange(file);
      }
    }
  };

  const displayImage = localPreview || avatar;

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-22.25">
        <div className="size-full rounded-full overflow-hidden border border-gray-100 bg-[#e9eaeb] flex items-center justify-center">
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={54} className="text-[#8a8a8a]" />
          )}
        </div>

        {/* Camera Badge Button at bottom-right */}
        <button
          type="button"
          onClick={handleCameraClick}
          className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="Upload avatar"
        >
          <Camera size={14} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#0c0c0c]">{name}</h2>
        <p className="text-base text-[#464646]">{email}</p>
      </div>
    </div>
  );
}
