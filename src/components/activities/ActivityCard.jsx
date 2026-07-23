import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const ActivityCard = memo(({ activity, onOpenDetails, onRegister }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const title = currentLang === "nl" ? activity.titleNl : activity.titleEn;
  const desc = currentLang === "nl" ? activity.descriptionNl : activity.descriptionEn;
  const price = currentLang === "nl" ? activity.priceNl : activity.price;
  const duration = currentLang === "nl" ? activity.durationNl : activity.durationEn;
  const location = currentLang === "nl" ? activity.locationNl : activity.locationEn;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-purple-100/50 shadow-sm hover:shadow-lg  flex flex-col justify-between">
      <div>
        {/* Header Image / Badge */}
        <div className="relative h-40 sm:h-44 overflow-hidden">
          <img
            src={activity.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
            activity.type === "event" 
              ? "bg-[#6E35AE]" 
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          }`}>
            {activity.type === "event" ? t("activities.events") : t("activities.workshops")}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#6E35AE] transition-colors duration-200 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-500 text-base mb-4 line-clamp-2">
            {desc}
          </p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 border-t border-purple-50/50 pt-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <Calendar size={13} className="text-purple-600 shrink-0" />
              <span className="truncate">{activity.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <Clock size={13} className="text-purple-600 shrink-0" />
              <span className="truncate">{duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <MapPin size={13} className="text-purple-600 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
              <span className="text-[#6E35AE] font-bold">{price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={onOpenDetails}
          className="flex-1 px-3 py-2.5 rounded-lg border border-purple-200 text-gray-700 text-sm font-bold hover:bg-[#FAF8FD] transition-colors duration-200 cursor-pointer"
        >
          {t("activities.viewDetails")}
        </button>
        <button
          onClick={onRegister}
          className="flex-1 px-3 py-2.5 rounded-lg bg-[#6E35AE] text-white text-sm font-bold hover:bg-[#562590] transition-colors duration-200 flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>{t("activities.registerNow")}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
});

ActivityCard.displayName = "ActivityCard";

export default ActivityCard;
