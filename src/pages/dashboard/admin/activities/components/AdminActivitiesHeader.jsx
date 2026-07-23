import React, { memo } from "react";
import { Plus } from "lucide-react";

const AdminActivitiesHeader = memo(({ onAddClick }) => {
  return (
    <div data-reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="dashboard-page-title">
          Activities Management
        </h1>
        <p className="max-w-3xl text-base text-[#464646] leading-6">
          Create, update, and manage your spiritual events and interactive workshops.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-500/60 text-white text-sm  cursor-pointer w-fit"
      >
        <Plus size={16} />
        <span>Add New Activity</span>
      </button>
    </div>
  );
});

AdminActivitiesHeader.displayName = "AdminActivitiesHeader";

export default AdminActivitiesHeader;
