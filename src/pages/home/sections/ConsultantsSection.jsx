import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import ConsultantCard from "../../../components/ConsultantCard";
import { useGetAllConsultantsQuery } from "../../../features/api/consultantApi";

const ConsultantsSection = memo(() => {
  const { t } = useTranslation();
  const { data: consultantsData, isLoading } = useGetAllConsultantsQuery({});

  const consultants = consultantsData?.consultants || [];
  // Slice to show only the first 4 or 8 consultants on the home page
  const featuredConsultants = consultants.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 bg-linear-to-b from-white to-[#F8F3FD]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 font-crimson">
              {t("home.consultantsSection.title")}
            </h2>
            <p className="text-base text-gray-500 font-poppins">
              {t("home.consultantsSection.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-[#F5F1FD] rounded-2xl p-4 h-96 animate-pulse flex flex-col justify-between"
              >
                <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-linear-to-b from-white to-[#F8F3FD]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 font-crimson">
            {t("home.consultantsSection.title")}
          </h2>
          <p className="text-base text-gray-500 font-poppins">
            {t("home.consultantsSection.description")}
          </p>
        </div>

        <ConsultantCard consultantsData={{ consultants: featuredConsultants }} />
      </div>
    </section>
  );
});

ConsultantsSection.displayName = "ConsultantsSection";

export default ConsultantsSection;
