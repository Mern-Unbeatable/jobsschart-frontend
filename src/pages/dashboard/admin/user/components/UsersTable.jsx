import React, { memo } from "react";
import { MoreVertical } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ActionsDropdown from "./ActionsDropdown";

const UsersTable = memo(({
  paginated,
  page,
  pageSize,
  btnRefs,
  openMenuId,
  setOpenMenuId,
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
                "#",
                "Name",
                "Email",
                "Phone Number",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-base font-medium text-gray-800 whitespace-nowrap ${
                    h === "Actions" ? "text-center" : "text-left"
                  }`}
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
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((u, idx) => (
                <tr
                  key={u.id}
                  className="border-b border-[#e4e4e4] hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-5 py-4 text-base text-gray-400">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-5 py-4 text-base font-medium text-[#0c0c0c]">
                    {u.name}
                  </td>
                  <td className="px-5 py-4 text-base text-[#0c0c0c]">
                    {u.email}
                  </td>
                  <td className="px-5 py-4 text-base text-[#373737] whitespace-nowrap">
                    {u.phone}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-4 text-center align-middle">
                    <button
                      ref={(el) => (btnRefs.current[u.id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === u.id ? null : u.id,
                        );
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Open actions menu"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>
                    {openMenuId === u.id && (
                      <ActionsDropdown
                        anchorEl={btnRefs.current[u.id]}
                        currentStatus={u.status}
                        onStatusChange={(s) => handleStatusChange(u.id, s)}
                        onDelete={() => {
                          setDeleteTarget({ id: u.id, name: u.name });
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
            No users found.
          </p>
        ) : (
          paginated.map((u) => (
            <div
              key={u.id}
              className="px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-base font-semibold text-[#0c0c0c] truncate">
                  {u.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{u.email}</p>
                <p className="text-sm text-gray-500 mt-0.5">{u.phone}</p>
                <div className="mt-2">
                  <StatusBadge status={u.status} />
                </div>
              </div>
              <div className="shrink-0">
                <button
                  ref={(el) => (btnRefs.current[`m-${u.id}`] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === `m-${u.id}` ? null : `m-${u.id}`,
                    );
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Open actions menu"
                >
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
                {openMenuId === `m-${u.id}` && (
                  <ActionsDropdown
                    anchorEl={btnRefs.current[`m-${u.id}`]}
                    currentStatus={u.status}
                    onStatusChange={(s) => handleStatusChange(u.id, s)}
                    onDelete={() => {
                      setDeleteTarget({ id: u.id, name: u.name });
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

UsersTable.displayName = "UsersTable";

export default UsersTable;
