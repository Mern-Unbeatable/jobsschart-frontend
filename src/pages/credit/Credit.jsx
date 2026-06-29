import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../../hooks/useSEO";
import { ROUTES } from "../../config";

import CreditPlans from "./sections/CreditPlans";
import CreditBenefits from "./sections/CreditBenefits";
import CommonAdsSection from "../../components/CommonAdsSection";

const Credit = memo(() => {
  useSEO({
    title: "Buy Credits",
    description:
      "Purchase consultation credits to start instant sessions with expert consultants",
    keywords: ["credits", "consultation", "pricing", "packages"],
  });

  return (
    <div className="min-h-screen bg-[#FBFDFF] py-14 md:py-20">
      <CreditPlans />
      <CreditBenefits />
      {/* <CommonAdsSection
        containerClassName="container mx-auto px-4 lg:px-6"
        boxClassName="w-full h-44 md:h-56 lg:h-72 bg-[#F1F5F9] rounded-3xl border border-dashed border-gray-300 flex items-center justify-center group"
        title="Advertisement Area"
        titleClassName="text-black font-bold text-2xl tracking-widest uppercase"
        placement="GLOBAL"
      /> */}
      <div className="container mx-auto px-4 lg:px-6 mt-14 md:mt-20">
        <Link
          to={ROUTES.DONATION}
          className="block w-full py-8 md:py-12 px-6 md:px-12 bg-[#E9D5FF] rounded-xl text-center text-[#6E35AE] shadow-sm border border-purple-100 flex flex-col items-center justify-center cursor-pointer hover:no-underline"
        >
          <h3 className="text-xl md:text-3xl font-bold font-crimson mb-2 md:mb-3">
            Donate to Our Organization
          </h3>
          <p className="text-base md:text-lg font-medium font-poppins mb-4 md:mb-6 max-w-2xl text-[#6E35AE]/90">
            Help us grow while helping to reduce poverty.
          </p>
          <div className="flex flex-col items-center border-t border-[#6E35AE]/20 pt-4 w-full max-w-md">
            <span className="text-sm md:text-base italic font-serif mb-1 text-[#6E35AE]/85">
              "The law of giving and receiving."
            </span>
            <span className="text-xs md:text-sm font-semibold tracking-wider font-poppins">
              — Deepak Chopra
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
});

Credit.displayName = "Credit";

export default Credit;
