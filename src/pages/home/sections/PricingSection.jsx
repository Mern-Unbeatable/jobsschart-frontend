import React, { memo } from "react";
import { Check } from "lucide-react";
import { useGetAllPackagesQuery } from "../../../features/api/packageApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../features/slices/authSlice";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { resolveI18n, resolveI18nArray } from "../../../utils/resolveI18n";

const PricingSection = memo(() => {
  const { i18n } = useTranslation();
  const { data: packagesData, isLoading } = useGetAllPackagesQuery();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const plans = packagesData?.packages || [];

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl bg-white p-6 border border-[#00000033] animate-pulse flex flex-col gap-4"
              >
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl bg-white p-8 border border-[#E9D5FF] hover:border-[#6E35AE] hover:shadow-xl transition-all duration-350 flex flex-col justify-start h-full"
            >
              <div>
               
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-poppins font-bold text-gray-800">
                    {resolveI18n(plan.name, i18n.language)}
                  </h3>
                  {plan.credits !== undefined && (
                    <span className="px-3 py-1 bg-[#F5EFFE] text-[#6E35AE] text-xs font-semibold rounded-full border border-[#E9D5FF]">
                      {plan.credits} Credits
                    </span>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-bold text-gray-900">
                    €{plan.price}
                  </span>
                  {plan.minutes !== undefined && plan.minutes > 0 && (
                    <span className="text-gray-500 text-base ml-1 font-poppins">
                      /{plan.minutes} minutes
                    </span>
                  )}
                </div>

                {/* Secondary Pricing Text / Description */}
                <p className="text-base text-gray-600 mb-6 font-poppins line-clamp-2 h-12">
                  {resolveI18n(plan.description, i18n.language) ||
                    (plan.minutes > 0 ? `${plan.minutes} minutes session` : "")}
                </p>

                {/* Button */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      Swal.fire({
                        title: "Login Required",
                        text: "For buy credit you have to login first",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Login",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          navigate(ROUTES.LOGIN);
                        }
                      });
                      return;
                    }
                    navigate(ROUTES.CREDIT);
                  }}
                  className="w-full bg-[#E9D5FF] hover:bg-[#6E35AE] hover:text-white text-[#6E35AE] py-3 rounded-full font-bold mb-6 transition-all duration-300 shadow-xs hover:shadow-md active:scale-95 font-poppins cursor-pointer"
                >
                  Buy Credits
                </button>
              </div>

              <div>
                {/* Features List */}
                <ul className="space-y-4 pt-4 border-t border-[#F5EFFE]">
                  {(resolveI18nArray(plan.features, i18n.language)).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-600 text-base"
                    >
                      <Check
                        size={18}
                        className="text-[#6E35AE] shrink-0"
                        strokeWidth={3}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

PricingSection.displayName = "PricingSection";

export default PricingSection;
