import React, { memo } from "react";
import { MoreVertical } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ActionsDropdown from "./ActionsDropdown";

const ConsultantsTable = memo(({
  paginated,
  btnRefs,
  openMenuId,
  setOpenMenuId,
  setDetailConsultant,
  handleStatusChange,
  setDeleteTarget,
  children
}) => {
  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F6FBFF]">
              {[
                "Name",
                "Email",
                "Phone Number",
                "Category",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-base font-medium text-gray-800 whitespace-nowrap ${h === "Actions" ? "text-center" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-base text-gray-400"
                >
                  No consultants found.
                </td>
              </tr>
            ) : (
              paginated.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#e4e4e4] hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 hidden lg:block"
                      />
                      <span className="text-base font-medium text-[#0c0c0c] whitespace-nowrap">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-base text-[#0c0c0c]">
                    {c.email}
                  </td>
                  <td className="px-5 py-4 text-base text-[#373737] whitespace-nowrap">
                    {c.phone}
                  </td>
                  <td className="px-5 py-4 text-base text-[#333]">
                    {c.category}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-4 text-center align-middle">
                    <button
                      ref={(el) => (btnRefs.current[c.id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === c.id ? null : c.id,
                        );
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Open actions menu"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>
                    {openMenuId === c.id && (
                      <ActionsDropdown
                        anchorEl={btnRefs.current[c.id]}
                        onSeeDetails={() => {
                          setOpenMenuId(null);
                          setDetailConsultant(c);
                        }}
                        onStatusChange={(s) => handleStatusChange(c.id, s)}
                        onDelete={() => {
                          setDeleteTarget({ id: c.id, userId: c.userId, name: c.name });
                          setOpenMenuId(null);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-100">
        {paginated.length === 0 ? (
          <p className="py-12 text-center text-base text-gray-400">
            No consultants found.
          </p>
        ) : (
          paginated.map((c) => (
            <div
              key={c.id}
              className="px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-[#0c0c0c] truncate">
                    {c.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{c.email}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{c.category}</p>
                  <div className="mt-1.5">
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  ref={(el) => (btnRefs.current[`m-${c.id}`] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === `m-${c.id}` ? null : `m-${c.id}`,
                    );
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Open actions menu"
                >
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
                {openMenuId === `m-${c.id}` && (
                  <ActionsDropdown
                    anchorEl={btnRefs.current[`m-${c.id}`]}
                    onSeeDetails={() => {
                      setOpenMenuId(null);
                      setDetailConsultant(c);
                    }}
                    onStatusChange={(s) => handleStatusChange(c.id, s)}
                    onDelete={() => {
                      setDeleteTarget({ id: c.id, userId: c.userId, name: c.name });
                      setOpenMenuId(null);
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {children}
    </div>
  );
});

ConsultantsTable.displayName = "ConsultantsTable";

export default ConsultantsTable;
