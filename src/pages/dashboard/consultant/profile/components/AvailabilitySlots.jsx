import React from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";

export default function AvailabilitySlots({ slots, onAdd, onRemove, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#4a5565]">
          <CalendarClock size={14} />
          <span>Availability</span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#6e35ae] px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#5f2f98]"
        >
          <Plus size={12} />
          Add Time Slot
        </button>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex flex-col gap-3 lg:flex-row lg:items-center"
          >
            <div className="lg:min-w-0 lg:flex-1">
              <input
                type="text"
                value={slot.day || ""}
                onChange={(event) =>
                  onChange(slot.id, "day", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-[#b9b9b9] px-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              />
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

            <span className="hidden text-sm text-[#616874] lg:block">
              -
            </span>

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
    </div>
  );
}
