import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreatePostMutation } from "../../../features/api/postApi";

const ShareExperienceModal = memo(({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "spiritual-development",
    subcategory: "meditation",
  });

  const categories = [
    {
      value: "spiritual-development",
      label: t("community.categories.spiritualDevelopment"),
    },
    { value: "meditation", label: t("community.categories.meditation") },
    { value: "love-life", label: t("community.categories.loveLife") },
    { value: "energy-healing", label: t("community.categories.energyHealing") },
  ];

  const subcategories = [
    {
      value: "meditation",
      label: t("community.modal.subcategories.meditation"),
    },
    {
      value: "mindfulness",
      label: t("community.modal.subcategories.mindfulness"),
    },
    { value: "awakening", label: t("community.modal.subcategories.awakening") },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter the content for your post.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.description.trim(),
      category: formData.category,
      subCategory: formData.subcategory,
      postType: "THOUGHT",
      sourceLang: i18n.language?.startsWith('nl') ? 'nl' : 'en',
    };

    const loadingToast = toast.loading("Creating post...");
    try {
      await createPost(payload).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Post created successfully");
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "spiritual-development",
        subcategory: "meditation",
      });
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to create post");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-modal-overlay">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 animate-modal-panel">
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">
            {t("community.modal.title")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              {t("community.modal.fields.title")}
            </label>
            <input
              type="text"
              placeholder={t("community.modal.placeholders.title")}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[#EAEAEA] border-none rounded-lg text-sm placeholder-gray-500 focus:ring-1 focus:ring-green-500/60 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              {t("community.modal.fields.description")}
            </label>
            <textarea
              placeholder={t("community.modal.placeholders.description")}
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#EAEAEA] border-none rounded-lg text-sm placeholder-gray-500 focus:ring-1 focus:ring-green-500/60 outline-none resize-none"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              {t("community.modal.fields.categories")}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: cat.value })
                  }
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    formData.category === cat.value
                      ? "bg-green-500/60 text-white "
                      : "bg-[#F5F1FD] text-[#1C1C1C] hover:bg-[#E9D5FF]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              {t("community.modal.fields.subcategory")}
            </label>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, subcategory: sub.value })
                  }
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    formData.subcategory === sub.value
                      ? "bg-green-500/60 text-white "
                      : "bg-[#F5F1FD] text-[#1C1C1C] hover:bg-[#E9D5FF]"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Post Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500/60 text-white py-3 rounded-lg text-base font-bold transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                Posting...
              </>
            ) : (
              t("community.modal.button")
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

ShareExperienceModal.displayName = "ShareExperienceModal";

export default ShareExperienceModal;
