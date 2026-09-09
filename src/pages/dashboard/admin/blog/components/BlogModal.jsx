import React, { useRef, useEffect } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import RichTextEditor from "../../../../../components/RichTextEditor";
import { resolveI18n } from "../../../../../utils/resolveI18n";

const BlogModal = ({
  isOpen,
  isClosing,
  isEditMode,
  formData,
  onChangeField,
  onChangeImage,
  onSave,
  onClose,
  categories = [],
  requireApproval = false,
  lastError = null,
  isSaving = false,
}) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-6 ${
        isClosing ? "animate-modal-overlay-out" : "animate-modal-overlay"
      } ${isClosing ? "pointer-events-none" : ""}`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`flex w-full max-w-160 max-h-[90vh] flex-col overflow-hidden rounded-lg bg-white shadow-2xl ${
          isClosing ? "animate-modal-panel-out" : "animate-modal-panel"
        }`}
      >
        {/* Sticky header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
          <h2 className="text-[32px] leading-9 font-medium text-[#333333]">
            {isEditMode ? "Edit Blog" : "Add Blog"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#545454] transition hover:bg-gray-100"
            aria-label="Close form"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={onSave}
        >
          {/* Scrollable body */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <div>
              <span className="mb-1 block text-base text-[#333333]">
                Upload Image
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex h-24 w-full items-center justify-center rounded bg-[#E0E0E0] text-[#8A8A8A] transition hover:bg-[#D6D6D6]"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Blog preview"
                    className="h-full w-full rounded object-cover"
                  />
                ) : (
                  <ImagePlus size={20} aria-hidden="true" />
                )}
              </button>
              <p className="mt-1.5 text-sm text-[#8A8A8A]">
                (Recommended): 1200 × 800 px (3:2). Please use landscape images for
                the best display.
              </p>
            </div>

            <label className="block">
              <span className="mb-1 block text-base text-[#333333]">Title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  onChangeField("title", e.target.value);
                  // Auto-generate slug from title if not in edit mode
                  if (!isEditMode) {
                    const generatedSlug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    onChangeField("slug", generatedSlug);
                  }
                }}
                placeholder="Enter blog title here"
                className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent placeholder:text-[#8A8A8A] focus:ring-green-500/60"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-base text-[#333333]">Slug</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  const cleanedSlug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "");
                  onChangeField("slug", cleanedSlug);
                }}
                placeholder="enter-blog-slug-here"
                className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent placeholder:text-[#8A8A8A] focus:ring-green-500/60"
                required
              />
            </label>

            <div
              className={`grid grid-cols-1 gap-3 ${
                requireApproval ? "" : "sm:grid-cols-2"
              }`}
            >
              <label className="block">
                <span className="mb-1 block text-base text-[#333333]">
                  Category
                </span>
                <select
                  value={formData.categoryId}
                  onChange={(e) => onChangeField("categoryId", e.target.value)}
                  className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent focus:ring-green-500/60"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {resolveI18n(category.name, "en")}
                    </option>
                  ))}
                </select>
              </label>

              {requireApproval ? (
                <p className="rounded-md bg-amber-50 px-3 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
                  Your blog will be submitted for admin approval. It will go live
                  only after an admin publishes it.
                </p>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-base text-[#333333]">
                    Status
                  </span>
                  <select
                    value={formData.status}
                    onChange={(e) => onChangeField("status", e.target.value)}
                    className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent focus:ring-green-500/60"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </label>
              )}
            </div>

            <div className="block">
              <span className="mb-1 block text-base text-[#333333]">Content</span>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => onChangeField("content", html)}
                placeholder="Write detailed blog content here"
              />
            </div>

            {lastError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                {lastError}
              </p>
            )}
          </div>

          {/* Sticky footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="inline-flex items-center rounded border border-[#D0D0D0] bg-white px-5 py-2 text-base font-medium text-[#545454] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded bg-green-500/60 px-5 py-2 text-base font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              )}
              {isSaving
                ? "Saving…"
                : requireApproval
                  ? isEditMode
                    ? "Update & Resubmit"
                    : "Submit for Approval"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
