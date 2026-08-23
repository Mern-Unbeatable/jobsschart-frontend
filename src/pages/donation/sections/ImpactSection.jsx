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
    <div className="py-10 md:py-14 bg-[#F3FAF5]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-crimson text-gray-900 mb-4">
            {t("donation.grow.title")}
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mb-6 rounded-full"></div>
          <div className="space-y-4 text-lg md:text-xl text-gray-700 leading-relaxed font-poppins max-w-4xl">
            <p>{t("donation.grow.p1")}</p>
            <p>{t("donation.grow.p2")}</p>
            <p>{t("donation.grow.p3")}</p>
            <p>{t("donation.grow.p4")}</p>
          </div>
        </div>

        <div className="mb-10 md:mb-12 bg-emerald-50 rounded-2xl p-6 md:p-10 border border-emerald-100">
          <h3 className="text-2xl md:text-3xl font-bold font-crimson text-gray-900 mb-3">
            {t("donation.impact.title")}
          </h3>
          <p className="text-lg md:text-xl text-gray-700 font-medium font-poppins mb-5">
            {t("donation.impact.subtitle")}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {impacts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2
                  className="text-emerald-500 shrink-0 mt-1"
                  size={22}
                />
                <span className="text-base md:text-lg text-gray-800 font-poppins leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-100 rounded-2xl p-6 md:p-10 border border-emerald-200 text-emerald-950 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Megaphone size={28} className="text-emerald-600" />
          </div>
          <div>
            <span className="text-sm uppercase tracking-wider font-semibold font-poppins text-emerald-800 mb-1 block">
              {t("donation.benefit.eyebrow")}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-crimson mb-3 text-gray-900">
              {t("donation.benefit.title")}
            </h3>
            <div className="space-y-3 text-base md:text-lg leading-relaxed font-poppins text-gray-800">
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
