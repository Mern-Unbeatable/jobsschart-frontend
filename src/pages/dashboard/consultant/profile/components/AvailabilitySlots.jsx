import React, { useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import AddAvailabilityModal from "./AddAvailabilityModal";

const DAYS = [
  { value: "SUNDAY", label: "Sunday" },
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

export default function AvailabilitySlots({
  slots = [],
  onAdd,
  onRemove,
  onChange,
  isAdding = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (payload) => {
    const success = await onAdd(payload);
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#4a5565]">
          <CalendarClock size={14} />
          <span>Availability</span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#6e35ae] px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#5f2f98]"
        >
          <Plus size={12} />
          Add Time Slot
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            No availability slots yet. Add your weekly schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col gap-3 lg:flex-row lg:items-center"
            >
              <div className="lg:min-w-0 lg:flex-1">
                <select
                  value={slot.dayOfWeek || ""}
                  onChange={(event) =>
                    onChange(slot.id, "day", event.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-[#b9b9b9] bg-white px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
                >
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative lg:w-38 lg:shrink-0">
                <input
                  type="time"
                  value={slot.from || ""}
                  onChange={(event) =>
                    onChange(slot.id, "from", event.target.value)
                  }
                  step="900"
                  className="h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
                />
              </div>

              <span className="hidden text-sm text-[#616874] lg:block">-</span>

              <div className="relative lg:w-38 lg:shrink-0">
                <input
                  type="time"
                  value={slot.to || ""}
                  onChange={(event) =>
                    onChange(slot.id, "to", event.target.value)
                  }
                  step="900"
                  className="h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
                />
              </div>

              <button
                type="button"
                onClick={() => onRemove(slot.id)}
                className="mx-auto p-0.5 text-[#ef4444] transition-colors duration-200 hover:text-[#dc2626] lg:mx-0 lg:ml-2 lg:shrink-0"
                aria-label="Remove time slot"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AddAvailabilityModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isAdding}
      />
    </div>
  );
}
