import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

const ActivitiesHero = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E9D5FF]/60 via-white to-[#FAF8FD] py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,53,174,0.05),transparent_40%)]" />
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9D5FF] text-[#6E35AE] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles size={14} />
          <span>{t("common.activities")}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          {t("activities.title")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
          {t("activities.subtitle")}
        </p>
      </div>
    </section>
  );
});

ActivitiesHero.displayName = "ActivitiesHero";

export default ActivitiesHero;
