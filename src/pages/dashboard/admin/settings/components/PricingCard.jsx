import React from "react";
import { Check, PenLine, Trash2 } from "lucide-react";

const CURRENCY_SYMBOL = "€";

const PricingCard = ({ plan, onEdit, onDelete }) => (
  <div className="flex flex-col border border-gray-200 rounded-xl p-6 gap-5">
    <div className="flex justify-between items-start">
      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
      {plan.credits !== undefined && (
        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
          {plan.credits} Credits
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-gray-900">
        {CURRENCY_SYMBOL}
        {plan.price}
      </span>
      {plan.minutes !== undefined && plan.minutes > 0 && (
        <span className="text-base text-gray-500">/{plan.minutes} minutes</span>
      )}
    </div>
    {plan.description && (
      <p className="text-sm text-gray-500 italic">{plan.description}</p>
    )}
    <ul className="flex flex-col gap-2 flex-1">
      {plan.features.map((feature, index) => (
        <li
          key={index}
          className="flex items-center gap-2 text-base text-gray-700"
        >
          <Check size={15} className="text-green-500 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-green-500/60 hover:brightness-95 text-white text-base font-medium rounded-lg transition-colors"
      >
        <PenLine size={14} />
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-purple-200 text-purple-500 hover:bg-purple-50 text-base font-medium rounded-lg transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  </div>
);

export default PricingCard;
