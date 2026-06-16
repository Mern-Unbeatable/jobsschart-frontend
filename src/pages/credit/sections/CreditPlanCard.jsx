import React, { memo } from "react";
import { Check, Loader2 } from "lucide-react";

const CreditPlanCard = memo(({ plan, onBuyCredits, isCheckingOut }) => {
  return (
    <div className="rounded-xl p-6 border border-[#00000033] flex flex-col">
      {/* Plan Name & Credits Badge */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
        {plan.credits !== undefined && (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            {plan.credits} Credits
          </span>
        )}
      </div>

      {/* Pricing Section */}
      <div className="flex items-baseline mb-2">
        <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
        {plan.minutes !== undefined && plan.minutes > 0 && (
          <span className="text-gray-500 text-base ml-1">
            /{plan.minutes} minutes
          </span>
        )}
      </div>

      {/* Secondary Pricing Text / Description */}
      <p className="text-base text-gray-600 mb-4 h-12 line-clamp-2">
        {plan.description ||
          (plan.minutes > 0 ? `${plan.minutes} minutes session` : "")}
      </p>

      {/* Button */}
      <button
        onClick={() => onBuyCredits(plan.id)}
        disabled={isCheckingOut}
        className="w-full bg-green-500/60 hover:bg-green-500/80 text-white py-3 rounded-md font-semibold mb-4 transition duration-200 shadow-sm mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCheckingOut ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5 text-white" />
            Processing...
          </span>
        ) : (
          "Buy Credits"
        )}
      </button>

      {/* Features List */}
      <ul className="space-y-4 border-gray-100">
        {(plan.features || []).map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 text-gray-600 text-base"
          >
            <Check size={18} className="text-[#10B981] shrink-0" strokeWidth={3} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

CreditPlanCard.displayName = "CreditPlanCard";

export default CreditPlanCard;
