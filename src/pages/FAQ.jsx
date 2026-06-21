import React from "react";
import FaqHero from "./faq/sections/FaqHero";
import FaqList from "./faq/sections/FaqList";
import PendingQuestions from "./faq/sections/PendingQuestions";
import CtaContact from "./faq/sections/CtaContact";
import { useGetFaqsQuery } from "../features/api/faqApi";

const stats = [
  { label: "Questions Answered", value: "3,200+" },
  { label: "Satisfaction Rate", value: "98%" },
  { label: "Support Available", value: "24/7" },
  { label: "Avg. Response Time", value: "< 2h" },
];


const FAQ = () => {
  const { data, isLoading } = useGetFaqsQuery({ limit: 100 });
  const faqs = data?.faqs || [];

  return (
    <div className="min-h-screen bg-white  ">
      <FaqHero stats={stats} />

      <main className="container mx-auto px-4 py-14 lg:py-20">
        <div className="flex items-center gap-3 text-[#6E35AE] mb-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-lg text-gray-500 border border-dashed border-gray-200 rounded-xl my-4">
            No FAQs found.
          </div>
        ) : (
          <FaqList faqs={faqs} />
        )}
        
        <PendingQuestions />
        <CtaContact />
      </main>
    </div>
  );
};

export default FAQ;
