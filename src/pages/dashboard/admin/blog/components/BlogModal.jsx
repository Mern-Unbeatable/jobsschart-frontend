import React, { useRef, useEffect } from "react";
import { X, ImagePlus } from "lucide-react";

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
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 ${
        isClosing
          ? "animate-modal-overlay-out"
          : "animate-modal-overlay"
      } ${isClosing ? "pointer-events-none" : ""}`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full max-w-160 rounded-lg bg-white p-4 sm:p-5 shadow-2xl ${
          isClosing ? "animate-modal-panel-out" : "animate-modal-panel"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[32px] leading-9 font-medium text-[#333333]">
            {isEditMode ? "Edit Blog" : "Add Blog"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#545454] transition hover:bg-gray-100"
            aria-label="Close form"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSave}>
          <label className="block">
            <span className="mb-1 block text-base text-[#333333]">
              Title
            </span>
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
                    .replace(/(^-|-$)+/g, "");
                  onChangeField("slug", generatedSlug);
                }
              }}
              placeholder="Enter blog title here"
              className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent placeholder:text-[#8A8A8A] focus:ring-green-500/60"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-base text-[#333333]">
              Slug
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => onChangeField("slug", e.target.value)}
              placeholder="enter-blog-slug-here"
              className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent placeholder:text-[#8A8A8A] focus:ring-green-500/60"
              required
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-base text-[#333333]">
                Category
              </span>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  onChangeField("categoryId", e.target.value)
                }
                className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent focus:ring-green-500/60"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-base text-[#333333]">
                Status
              </span>
              <select
                value={formData.status}
                onChange={(e) =>
                  onChangeField("status", e.target.value)
                }
                className="w-full rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent focus:ring-green-500/60"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-base text-[#333333]">
              Content
            </span>
            <textarea
              value={formData.content}
              onChange={(e) =>
                onChangeField("content", e.target.value)
              }
              rows={4}
              placeholder="Write detailed blog content here"
              className="w-full resize-none rounded bg-[#E8E8E8] px-3 py-2.5 text-base text-[#333333] outline-none ring-1 ring-transparent placeholder:text-[#8A8A8A] focus:ring-green-500/60"
              required
            />
          </label>

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
          </div>

          <button
            type="submit"
            className="rounded bg-green-500/60 px-5 py-2 text-base font-medium text-white transition hover:brightness-95"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
