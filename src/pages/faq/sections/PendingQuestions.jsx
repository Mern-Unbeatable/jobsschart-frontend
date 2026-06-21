import React from "react";
import { HelpCircle } from "lucide-react";
import { useGetMyQuestionsQuery } from "../../../features/api/faqApi";

const PendingQuestions = () => {
  const { data, isLoading } = useGetMyQuestionsQuery();

  const questions = data?.questions || [];
  const pendingQuestions = questions.filter((q) => q.status === "PENDING");

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  if (pendingQuestions.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-[#2b2540] mb-3">
        Pending Community Questions
      </h3>
      <div className="rounded-lg border border-[#efeaf8] bg-white p-4 shadow-sm space-y-4">
        {pendingQuestions.map((it) => (
          <div key={it.id} className="flex gap-4 border-b border-[#efeaf8] last:border-0 pb-4 last:pb-0">
            <div className="shrink-0 w-12 h-12 rounded-full bg-[#ece3ff] flex items-center justify-center text-[#8b6ac1]">
              <HelpCircle size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <p className="text-base font-semibold text-[#2b2540]">{it.subject}</p>
                {it.topic && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6E35AE]/10 text-[#6E35AE]">
                    {it.topic}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-[#6b6b78]">{it.question}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                  Pending Answer
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(it.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingQuestions;
