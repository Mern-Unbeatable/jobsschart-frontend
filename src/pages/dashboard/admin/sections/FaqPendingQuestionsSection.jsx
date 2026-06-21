import React from "react";
import { HelpCircle, MessageSquareText } from "lucide-react";

const FaqPendingQuestionsSection = ({ items, onAnswer }) => {
  return (
    <div className="rounded-xl border border-[#ece8f6] bg-white shadow-[0_10px_30px_rgba(17,12,46,0.06)]">
      <div className="border-b border-[#ede7f6] px-6 py-4 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1f1f2a]">
          Pending Community Questions
        </h2>
      </div>

      <div className="px-6 py-5 sm:px-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 rounded-xl border border-[#efeaf8] bg-[#fcfbff] p-4 sm:p-5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ece3ff] text-[#8b6ac1]">
              <HelpCircle size={16} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold leading-6 text-[#33334a]">
                {item.subject}
              </h4>
              <p className="mt-1 text-sm text-[#6f6a81] leading-relaxed">
                {item.question}
              </p>
              
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8b84a3]">
                <span className="font-medium bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600 uppercase">
                  {item.questionType || "USER"}
                </span>
                {item.topic && (
                  <span className="font-medium bg-[#ece3ff] px-2.5 py-0.5 rounded-full text-[#8b6ac1]">
                    {item.topic}
                  </span>
                )}
                <span>•</span>
                <span>Asked by <strong className="text-gray-700">{item.user?.name || "Anonymous"}</strong> ({item.user?.email})</span>
                <span>•</span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={() => onAnswer(item)}
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-green-500/60 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95"
              >
                <MessageSquareText size={16} aria-hidden="true" />
                Answer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPendingQuestionsSection;
