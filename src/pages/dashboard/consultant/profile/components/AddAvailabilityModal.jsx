import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const DAYS = [
  { value: "SUNDAY", label: "Sunday" },
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

const INITIAL_FORM = {
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "17:00",
};

export default function AddAvailabilityModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode = "add",
  initialValues = null,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialValues) {
      setForm({
        dayOfWeek: initialValues.dayOfWeek || "MONDAY",
        startTime: (initialValues.startTime || initialValues.from || "09:00").slice(0, 5),
        endTime: (initialValues.endTime || initialValues.to || "17:00").slice(0, 5),
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setError("");
  }, [open, isEdit, initialValues]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.dayOfWeek || !form.startTime || !form.endTime) {
      setError("Please select day, start time, and end time.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }

    await onSubmit({
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
    });
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#1d1d1d]">
            {isEdit ? "Edit Time Slot" : "Add Time Slot"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4a5565]">
              Day
            </label>
            <select
              value={form.dayOfWeek}
              onChange={(event) => handleChange("dayOfWeek", event.target.value)}
              className="h-11 w-full rounded-lg border border-[#b9b9b9] bg-white px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#4a5565]">
                Start Time
              </label>
              <input
                type="time"
                value={form.startTime}
                step="900"
                onChange={(event) =>
                  handleChange("startTime", event.target.value)
                }
                className="h-11 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#4a5565]">
                End Time
              </label>
              <input
                type="time"
                value={form.endTime}
                step="900"
                onChange={(event) => handleChange("endTime", event.target.value)}
                className="h-11 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#6e35ae] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5f2f98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                  ? "Update Slot"
                  : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
