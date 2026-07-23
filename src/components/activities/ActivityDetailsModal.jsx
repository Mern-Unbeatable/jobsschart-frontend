import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { X, User, Calendar, Clock, Video, ArrowRight } from "lucide-react";

const ActivityDetailsModal = memo(({ activity, onClose, onOpenRegister }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  if (!activity) return null;

  const title = currentLang === "nl" ? activity.titleNl : activity.titleEn;
  const desc = currentLang === "nl" ? activity.descriptionNl : activity.descriptionEn;
  const price = currentLang === "nl" ? activity.priceNl : activity.price;
  const duration = currentLang === "nl" ? activity.durationNl : activity.durationEn;
  const location = currentLang === "nl" ? activity.locationNl : activity.locationEn;
  const hostTitle = currentLang === "nl" ? activity.hostTitleNl : activity.hostTitleEn;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 shadow-md border border-gray-100 z-10 cursor-pointer"
        >
          <X size={18} />
        </button>
        <div className="h-48 overflow-hidden relative">
          <img
            src={activity.image}
            alt="Selected"
            className="w-full h-full object-cover"
          />
          <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase text-white ${
            activity.type === "event" ? "bg-purple-600" : "bg-orange-500"
          }`}>
            {activity.type === "event" ? t("activities.events") : t("activities.workshops")}
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
            {title}
          </h3>
          
          <div className="flex items-center gap-3 mb-6 bg-purple-50/50 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] font-bold">
              <User size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{activity.host}</h4>
              <p className="text-xs text-gray-500">{hostTitle}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {desc}
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-purple-50/50 pt-4 mb-6">
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.date")}</h5>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Calendar size={15} className="text-[#6E35AE]" />
                <span>{activity.date}</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.time")}</h5>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Clock size={15} className="text-[#6E35AE]" />
                <span>{activity.time} ({duration})</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.location")}</h5>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                <Video size={15} className="text-[#6E35AE]" />
                <span>{location}</span>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.price")}</h5>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#6E35AE]">
                <span>{price}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-[#FAF8FD] transition-colors duration-200 cursor-pointer"
            >
              {t("activities.close")}
            </button>
            <button
              onClick={onOpenRegister}
              className="flex-1 px-4 py-3.5 rounded-xl bg-[#6E35AE] text-white text-sm font-bold hover:bg-[#562590] transition-colors duration-200 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{t("activities.registerNow")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ActivityDetailsModal.displayName = "ActivityDetailsModal";

export default ActivityDetailsModal;
