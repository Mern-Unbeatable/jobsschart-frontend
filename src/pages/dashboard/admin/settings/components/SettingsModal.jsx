import React from "react";
import { X } from "lucide-react";

const SettingsModal = ({
  isPriceModal,
  editingPlanId,
  priceForm,
  setPriceForm,
  priceErrors,
  handleSavePrice,
  tagConfig,
  tagInput,
  setTagInput,
  tagError,
  setTagError,
  tagSaveHandler,
  handleCloseModal,
  overlayClass,
  panelClass,
  isModalClosing,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${overlayClass} ${isModalClosing ? "pointer-events-none" : ""}`}
      onClick={handleCloseModal}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isPriceModal ? (
          /* ── Price / Edit Price modal ── */
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPlanId !== null ? "Edit Price" : "Add Price"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={priceForm.name}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {priceErrors.name && (
                <p className="text-xs text-red-500">{priceErrors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={priceForm.price}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {priceErrors.price && (
                <p className="text-xs text-red-500">{priceErrors.price}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={priceForm.minutes}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    minutes: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {priceErrors.minutes && (
                <p className="text-xs text-red-500">{priceErrors.minutes}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Credits
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={priceForm.credits}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    credits: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {priceErrors.credits && (
                <p className="text-xs text-red-500">{priceErrors.credits}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                placeholder="Description"
                value={priceForm.description}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {priceErrors.description && (
                <p className="text-xs text-red-500">
                  {priceErrors.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-700">
                Features (One per line)
              </label>
              <textarea
                placeholder="Write Features"
                rows={4}
                value={priceForm.featured}
                onChange={(e) =>
                  setPriceForm((prev) => ({
                    ...prev,
                    featured: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
              {priceErrors.featured && (
                <p className="text-xs text-red-500">{priceErrors.featured}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSavePrice}
              className="w-full py-2.5 bg-green-500/60 hover:brightness-95 text-white text-base font-semibold rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          /* ── Tag modal (Category / Topics / Blog Category) ── */
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {tagConfig?.title}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder={tagConfig?.placeholder}
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  if (tagError) setTagError("");
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {tagError && <p className="text-xs text-red-500">{tagError}</p>}
            </div>

            <button
              type="button"
              onClick={tagSaveHandler}
              className="w-full py-2.5 bg-green-500/60 hover:brightness-95 text-white text-base font-semibold rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
