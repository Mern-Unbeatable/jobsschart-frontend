import React, { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Phone, Video, MessageSquare, Star } from "lucide-react";
import AudioCallModal from "../pages/consultants/sections/AudioCallModal";
import VideoCallModal from "../pages/consultants/sections/VideoCallModal";
import { usePresence } from "../hooks/usePresence";
import { getStatusStyle, toDisplayStatus } from "../utils/status";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
} from "../features/slices/authSlice";
import {
  canUserContactConsultant,
  getConsultantUserId,
} from "../utils/consultantList";
import { redirectToLogin } from "../utils/authLoginRedirect";

const ConsultantCard = memo(({ consultantsData }) => {
  const navigate = useNavigate();
  const { getStatus } = usePresence();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);

  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  const getContactPermission = (consultant) =>
    canUserContactConsultant({
      viewerRole: userRole,
      viewerUserId: user?.id,
      consultant,
    });

  const ensureCanContact = (consultant, { returnTo } = {}) => {
    if (!isAuthenticated) {
      toast.error("Please log in to use this service.", { position: "top-center" });
      redirectToLogin(navigate, {
        from: returnTo || `/consultants/${consultant.id}`,
      });
      return false;
    }

    const permission = getContactPermission(consultant);
    if (!permission.allowed) {
      if (permission.reason === "restricted_role") {
        toast.error("This action is only available for regular users.", {
          position: "top-center",
        });
      } else if (permission.reason === "self") {
        toast.error("You cannot contact yourself.", { position: "top-center" });
      }
      return false;
    }

    return true;
  };

  const handleCardClick = (consultantId) => {
    navigate(`/consultants/${consultantId}`);
  };

  const handleAudioCall = (e, consultant) => {
    e.stopPropagation();
    if (!ensureCanContact(consultant)) return;

    setSelectedConsultant({
      ...consultant,
      userId: getConsultantUserId(consultant),
      pricePerMinute: parseFloat(consultant.pricePerMinute || 2.5),
      name: consultant.user?.name || consultant.name,
      image: consultant.user?.avatar || consultant.avatar,
    });
    setShowAudio(true);
  };

  const handleVideoCall = (e, consultant) => {
    e.stopPropagation();
    if (!ensureCanContact(consultant)) return;

    setSelectedConsultant({
      ...consultant,
      userId: getConsultantUserId(consultant),
      pricePerMinute: parseFloat(consultant.pricePerMinute || 2.5),
      name: consultant.user?.name || consultant.name,
      image: consultant.user?.avatar || consultant.avatar,
    });
    setShowVideo(true);
  };

  const handleChat = (e, consultant) => {
    e.stopPropagation();
    if (!ensureCanContact(consultant, { returnTo: `/consultants/${consultant.id}/chat` })) return;
    navigate(`/consultants/${consultant.id}/chat`);
  };

  const consultants = consultantsData?.consultants || [];
  if (consultants.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {consultants.map((consultant) => {
          const consultantUserId = getConsultantUserId(consultant);
          const rawStatus = getStatus(
            consultantUserId,
            consultant.onlineStatus,
          );
          const displayStatus = toDisplayStatus(rawStatus);
          const canContact = getContactPermission(consultant).allowed;

          return (
            <div
              key={consultant.id}
              onClick={() => handleCardClick(consultant.id)}
              className="bg-[#F5F1FD] rounded-2xl overflow-hidden shadow-sm p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-md duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={
                      consultant.user?.avatar ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop"
                    }
                    alt={consultant.user?.name || "Consultant"}
                    className="w-full h-60 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop";
                    }}
                  />

                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5 ${getStatusStyle(displayStatus)}`}
                  >
                    {displayStatus === "Online" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                    )}
                    {displayStatus}
                  </div>
                </div>

                <div className="px-1 pt-4">
                  <div className="flex justify-between items-center gap-2 mb-1 h-8">
                    <h3 className="text-xl md:text-2xl font-crimson font-medium text-gray-900 truncate flex-1">
                      {consultant.user?.name || "Unknown"}
                    </h3>
                    <div className="flex items-center gap-1 text-green-500/60 font-bold text-lg font-crimson shrink-0">
                      <Star size={18} fill="currentColor" />
                      <span>
                        {parseFloat(
                          consultant.rating || consultant.averageRating || 0,
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-base text-gray-500 mb-4 font-poppins h-6 truncate">
                    {consultant.specialization?.length > 0
                      ? consultant.specialization[0]
                      : "Consultant"}
                  </p>

                  <div className="mb-4">
                    <span className="text-2xl font-semibold text-gray-900">
                      €{parseFloat(consultant.pricePerMinute || 2.5).toFixed(2)}
                    </span>
                    <span className="text-gray-800 text-lg font-semibold ml-1 font-crimson">
                      per minute
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-1 pb-1">
                <div className="flex gap-3 pt-4 border-t border-[#DFC2FF]">
                  <button
                    type="button"
                    onClick={(e) => handleAudioCall(e, consultant)}
                    disabled={!canContact}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      canContact
                        ? "bg-[#D2C0E6] text-[#6E35AE] hover:bg-[#D4C4E5] cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    aria-label="Audio call"
                  >
                    <Phone size={20} className="stroke-[1.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleVideoCall(e, consultant)}
                    disabled={!canContact}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      canContact
                        ? "bg-[#D2C0E6] text-[#6E35AE] hover:bg-[#D4C4E5] cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    aria-label="Video call"
                  >
                    <Video size={20} className="stroke-[1.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleChat(e, consultant)}
                    disabled={!canContact}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      canContact
                        ? "bg-[#D2C0E6] text-[#6E35AE] hover:bg-[#D4C4E5] cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    aria-label="Chat"
                  >
                    <MessageSquare size={20} className="stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedConsultant && (
        <>
          <AudioCallModal
            isOpen={showAudio}
            onClose={() => {
              setShowAudio(false);
              setSelectedConsultant(null);
            }}
            consultant={selectedConsultant}
          />
          <VideoCallModal
            isOpen={showVideo}
            onClose={() => {
              setShowVideo(false);
              setSelectedConsultant(null);
            }}
            consultant={selectedConsultant}
          />
        </>
      )}
    </>
  );
});

ConsultantCard.displayName = "ConsultantCard";
export default ConsultantCard;
