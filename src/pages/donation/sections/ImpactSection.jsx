import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Megaphone } from "lucide-react";

const ImpactSection = memo(() => {
  const { t } = useTranslation();

  const impacts = [
    t("donation.impact.list.grow"),
    t("donation.impact.list.support"),
    t("donation.impact.list.awareness"),
    t("donation.impact.list.assist"),
    t("donation.impact.list.improve"),
  ];

  return (
    <div className="py-14 md:py-20 bg-[#FBFDFF]">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section 15: Help Our Community Grow */}
        <div className="mb-14 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-crimson text-gray-900 mb-6">
            {t("donation.grow.title")}
          </h2>
          <div className="w-16 h-1 bg-[#6E35AE] mb-8 rounded-full"></div>
          <div className="space-y-6 text-base md:text-lg text-gray-600 leading-relaxed font-poppins">
            <p>{t("donation.grow.p1")}</p>
            <p>{t("donation.grow.p2")}</p>
            <p>{t("donation.grow.p3")}</p>
            <p>{t("donation.grow.p4")}</p>
          </div>
        </div>

        {/* Section 16: The Impact of Your Donation */}
        <div className="mb-14 md:mb-20 bg-[#F8F3FD] rounded-2xl p-8 md:p-12 border border-[#DFC2FF]/30">
          <h3 className="text-2xl md:text-4xl font-bold font-crimson text-gray-900 mb-4">
            {t("donation.impact.title")}
          </h3>
          <p className="text-base md:text-lg text-gray-600 font-medium font-poppins mb-6">
            {t("donation.impact.subtitle")}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impacts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#6E35AE] shrink-0 mt-1" size={20} />
                <span className="text-base text-gray-700 font-poppins leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 17: Additional Benefit for Donators */}
        <div className="bg-[#E9D5FF] rounded-2xl p-8 md:p-12 border border-purple-200 text-[#6E35AE] flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <Megaphone size={32} className="text-[#6E35AE]" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold font-poppins text-[#6E35AE]/80 mb-1 block">
              {t("donation.benefit.eyebrow")}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-crimson mb-3">
              {t("donation.benefit.title")}
            </h3>
            <div className="space-y-4 text-base leading-relaxed font-poppins text-[#6E35AE]/90">
              <p>{t("donation.benefit.p1")}</p>
              <p>{t("donation.benefit.p2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ImpactSection.displayName = "ImpactSection";

export default ImpactSection;
