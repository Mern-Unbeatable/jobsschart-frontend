import React, { useState } from "react";
import { ChevronDown, Ticket } from "lucide-react";
import { useGetFaqsQuery } from "../../../../features/api/faqApi";

const FaqSection = () => {
  const [openFaqId, setOpenFaqId] = useState(null);
  const { data, isLoading } = useGetFaqsQuery();
  const faqs = data?.faqs || [];

  if (isLoading) {
    return (
      <section className="space-y-4 mb-4">
        <div className="flex items-center gap-2 text-2xl font-semibold text-[#5c3d91] ">
          <Ticket size={18} aria-hidden="true" />
          Frequently Asked Questions
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c3d91]" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 mb-4">
      <div className="flex items-center gap-2 text-2xl font-semibold text-[#5c3d91] ">
        <Ticket size={18} aria-hidden="true" />
        Frequently Asked Questions
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white px-4 py-8 text-center text-base text-gray-500 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
            No FAQs added by organizer.
          </div>
        ) : (
          faqs.map((item) => {
            const isOpen = openFaqId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                className="w-full rounded-lg border border-gray-100 bg-white px-4 py-4 text-left shadow-[0_1px_8px_rgba(15,23,42,0.04)] transition-all hover:border-[#e3d7f7]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-[#2f2f2f] sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#b39ddb] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 max-w-3xl text-base leading-6 text-gray-500">
                    {item.answer}
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};

export default FaqSection;
