import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCreateCommunityQuestionMutation } from "../../../features/api/faqApi";

const CtaContact = () => {
  const { i18n } = useTranslation();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");

  const [createCommunityQuestion, { isLoading }] = useCreateCommunityQuestionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim() || !subject.trim() || !question.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await createCommunityQuestion({
        topic,
        subject,
        question,
        sourceLang: i18n.language?.startsWith('nl') ? 'nl' : 'en',
      }).unwrap();

      toast.success("Question submitted successfully!");
      setTopic("");
      setSubject("");
      setQuestion("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit question. Please try again.");
    }
  };

  return (
    <section className="mt-14 lg:mt-20">
      {/* Main Background Container */}
      <div className="bg-gradient-to-br from-[#7B5EA7] to-[#9B7DC7] rounded-lg overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:px-20 lg:py-16 gap-10">
          {/* Left Text Content */}
          <div className="flex-1 text-white max-w-md">
            <h3 className="text-3xl lg:text-4xl  mb-4 leading-snug">
              Still need help? Ask our admin team.
            </h3>
            <p className="text-base text-white/80 leading-relaxed font-light">
              Our dedicated support experts are available to ensure your
              experience remains premium and uninterrupted.
            </p>
          </div>

          {/* Right Form Card */}
          <div className="w-full lg:w-[620px]">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium">
                      Topic
                    </label>
                    <input
                      className="w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="Billing Inquiry"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium">
                      Subject
                    </label>
                    <input
                      className="w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="Summary of issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-base text-white/70 uppercase tracking-widest mb-1.5 font-medium">
                    Question
                  </label>
                  <textarea
                    className="w-full rounded-md bg-white/10 border-none text-white text-sm placeholder-white/40 px-3 py-2.5 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-white/30"
                    placeholder="Describe your inquiry in detail..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full rounded-md bg-green-500/60 px-4 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaContact;
