import React, { useState } from "react";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
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

const getDayLabel = (slot) => {
  if (slot.day) return slot.day;
  const match = DAYS.find((day) => day.value === slot.dayOfWeek);
  return match?.label || slot.dayOfWeek || "—";
};

export default function AvailabilitySlots({
  slots = [],
  onAdd,
  onEdit,
  onRemove,
  isAdding = false,
  isEditing = false,
}) {
  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    slot: null,
  });

  const closeModal = () => {
    setModalState({ open: false, mode: "add", slot: null });
  };

  const handleSubmit = async (payload) => {
    if (modalState.mode === "edit" && modalState.slot?.id) {
      const success = await onEdit(modalState.slot.id, payload);
      if (success) closeModal();
      return;
    }

    const success = await onAdd(payload);
    if (success) closeModal();
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
          onClick={() =>
            setModalState({ open: true, mode: "add", slot: null })
          }
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
                <div className="flex h-10 w-full items-center rounded-lg border border-[#b9b9b9] bg-gray-50 px-3 text-sm text-[#1d1d1d]">
                  {getDayLabel(slot)}
                </div>
              </div>

              <div className="relative lg:w-38 lg:shrink-0">
                <div className="flex h-10 w-full items-center rounded-lg border border-[#b9b9b9] bg-gray-50 px-3 text-sm text-[#1d1d1d]">
                  {slot.from || "—"}
                </div>
              </div>

              <span className="hidden text-sm text-[#616874] lg:block">-</span>

              <div className="relative lg:w-38 lg:shrink-0">
                <div className="flex h-10 w-full items-center rounded-lg border border-[#b9b9b9] bg-gray-50 px-3 text-sm text-[#1d1d1d]">
                  {slot.to || "—"}
                </div>
              </div>

              <div className="mx-auto flex items-center gap-2 lg:mx-0 lg:ml-2 lg:shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setModalState({ open: true, mode: "edit", slot })
                  }
                  className="p-0.5 text-[#6e35ae] transition-colors duration-200 hover:text-[#5f2f98]"
                  aria-label="Edit time slot"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(slot.id)}
                  className="p-0.5 text-[#ef4444] transition-colors duration-200 hover:text-[#dc2626]"
                  aria-label="Remove time slot"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddAvailabilityModal
        open={modalState.open}
        mode={modalState.mode}
        initialValues={modalState.slot}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={modalState.mode === "edit" ? isEditing : isAdding}
      />
    </div>
  );
}
