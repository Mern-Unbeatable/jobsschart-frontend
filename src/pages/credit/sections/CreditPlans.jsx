import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useGetAllPackagesQuery } from "../../../features/api/packageApi";

const CreditPlans = memo(() => {
  const { t } = useTranslation();
  const { data: packagesData, isLoading } = useGetAllPackagesQuery();

  const creditPlans = packagesData?.packages || [];

  return (
    <div className="mb-12 ">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-12 md:mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-white border border-[#00000033] text-sm text-gray-500 font-medium mb-4">
          {t("creditPlans.badge")}
        </span>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 ">
          {t("creditPlans.title")}
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          {t("creditPlans.description")}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto  px-4 lg:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-xl p-6 border border-[#00000033] animate-pulse flex flex-col gap-4">
                <div className="h-7 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded w-full my-2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {creditPlans.map((plan) => (
              <div
                key={plan.id}
                className=" rounded-xl p-6 border border-[#00000033] flex flex-col"
              >
                {/* Plan Name & Credits Badge */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  {plan.credits !== undefined && (
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                      {plan.credits} Credits
                    </span>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    €{plan.price}
                  </span>
                  {plan.minutes !== undefined && plan.minutes > 0 && (
                    <span className="text-gray-500 text-base ml-1">
                      /{plan.minutes} minutes
                    </span>
                  )}
                </div>

                {/* Secondary Pricing Text / Description */}
                <p className="text-base text-gray-600 mb-4 h-12 line-clamp-2">
                  {plan.description || (plan.minutes > 0 ? `${plan.minutes} minutes session` : '')}
                </p>

                {/* Button */}
                <button className="w-full bg-[#D4A017] hover:bg-[#B88A14] text-white py-3 rounded-md font-semibold mb-4 transition duration-200 shadow-sm mt-auto">
                  Buy Credits
                </button>

                {/* Features List */}
                <ul className="space-y-4  border-gray-100 ">
                  {(plan.features || []).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-600 text-base"
                    >
                      <Check
                        size={18}
                        className="text-[#10B981] shrink-0"
                        strokeWidth={3}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

CreditPlans.displayName = "CreditPlans";

export default CreditPlans;
