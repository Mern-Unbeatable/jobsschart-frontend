import React, { memo } from "react";
import { Plus } from "lucide-react";

const AdminActivitiesHeader = memo(({ onAddClick }) => {
  return (
    <div data-reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-extrabold text-[#050609] tracking-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
          Activities Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, update, and manage your spiritual events and interactive workshops.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#6E35AE] hover:bg-[#562590] text-white text-sm font-bold shadow-md transition-all duration-200 cursor-pointer w-fit"
      >
        <Plus size={16} />
        <span>Add New Activity</span>
      </button>
    </div>
  );
});

AdminActivitiesHeader.displayName = "AdminActivitiesHeader";

export default AdminActivitiesHeader;
