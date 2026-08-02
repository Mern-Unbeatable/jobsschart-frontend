import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllPackagesQuery } from "../../../features/api/packageApi";
import { useCreateCheckoutMutation } from "../../../features/api/paymentApi";
import toast from "react-hot-toast";
import CreditPlanCard from "./CreditPlanCard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../features/slices/authSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";
import { redirectToMollieCheckout } from "../../../utils/mollieCheckout";

const CreditPlans = memo(() => {
  const { t } = useTranslation();
  const { data: packagesData, isLoading } = useGetAllPackagesQuery();
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();
  const [activePackageId, setActivePackageId] = useState(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const creditPlans = packagesData?.packages || [];

  const handleBuyCredits = async (packageId) => {
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

    setActivePackageId(packageId);
    try {
      const payload = {
        type: 'PACKAGE',
        packageId: packageId,
      };
      const result = await createCheckout(payload).unwrap();
      if (!redirectToMollieCheckout(result)) {
        toast.error('Could not initiate payment. Please try again.');
      }
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Payment failed. Please try again.'
      );
    } finally {
      setActivePackageId(null);
    }
  };

  return (
    <div className="mb-12 ">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-8">
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {creditPlans.map((plan) => (
              <CreditPlanCard
                key={plan.id}
                plan={plan}
                onBuyCredits={handleBuyCredits}
                isCheckingOut={isCheckingOut && activePackageId === plan.id}
              />
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
});

CreditPlans.displayName = "CreditPlans";

export default CreditPlans;
