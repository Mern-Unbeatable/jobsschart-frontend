import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ConsultantCard from "../../../components/ConsultantCard";
import { useGetAllConsultantsQuery } from "../../../features/api/consultantApi";
import { ROUTES } from "../../../config";

const ConsultantsSection = memo(() => {
  const { t } = useTranslation();
  const { data: consultantsData, isLoading } = useGetAllConsultantsQuery({});

  const consultants = consultantsData?.consultants || [];
  // Slice to show only the first 4 or 8 consultants on the home page
  const featuredConsultants = consultants.slice(0, 4);

  const sectionHeader = (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 font-crimson">
          {t("home.consultantsSection.title")}
        </h2>
        <p className="text-base text-gray-500 font-poppins max-w-2xl">
          {t("home.consultantsSection.description")}
        </p>
      </div>
      <Link
        to={ROUTES.CONSULTANTS}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#6E35AE] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#562590]"
      >
        {t("home.consultantsSection.viewAll", "View All")}
        <ArrowRight size={16} />
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 bg-linear-to-b from-white to-[#F8F3FD]">
        <div className="container mx-auto px-4 lg:px-6">
          {sectionHeader}
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
        {sectionHeader}

        <ConsultantCard consultantsData={{ consultants: featuredConsultants }} />
      </div>
    </section>
  );
});

ConsultantsSection.displayName = "ConsultantsSection";

export default ConsultantsSection;
