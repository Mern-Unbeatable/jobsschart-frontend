import React, { memo } from "react";
import { Edit, Trash2 } from "lucide-react";
import Pagination from "./Pagination";

const AdminActivitiesTable = memo(({ 
  activities, 
  onEditClick, 
  onDeleteClick,
  page,
  totalResults,
  pageSize,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-purple-100/50 shadow-sm overflow-hidden" data-reveal>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 border-b border-purple-100">
              <th className="p-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="p-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Host</th>
              <th className="p-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date &amp; Time</th>
              <th className="p-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="p-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {activities.length > 0 ? (
              activities.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/20 transition-colors duration-150">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.titleEn}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.titleNl}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-800 text-base">{item.host}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{item.hostTitleEn}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-700 font-semibold">{item.date}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{item.time}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-sm font-medium uppercase tracking-wider ${
                      item.type === "event" ? "bg-purple-100 text-[#6E35AE]" : "bg-orange-100 text-orange-600"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-[#6E35AE] transition-all cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(item.id)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400 font-semibold">
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalResults={totalResults}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

AdminActivitiesTable.displayName = "AdminActivitiesTable";

export default AdminActivitiesTable;
