import React, { memo } from "react";
import { MoreVertical } from "lucide-react";
import ActionsDropdown from "./ActionsDropdown";

const OrdersTable = memo(
  ({
    paginated,
    STATUS_STYLES,
    anchorRefs,
    handleToggle,
    openId,
    handleClose,
    handleSeeDetails,
    handleStatusChange,
    children,
  }) => {
    return (
      <div
        data-reveal
        className="bg-white rounded-xl overflow-hidden shadow-sm"
      >
        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Price",
                  "Date",
                  "Status",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className={`px-6 py-4 text-base font-medium text-[#050609] ${
                      col === "Action" ? "text-center" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-base text-[#8A8A8A]"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr
                    key={order.id + order.status}
                    className="border-b border-[#F0F0F0] last:border-0"
                  >
                    <td className="px-6 py-4 text-[#333]">{order.id}</td>
                    <td className="px-6 py-4 text-[#333]">{order.customer}</td>
                    <td className="px-6 py-4 text-[#333]">{order.product}</td>
                    <td className="px-6 py-4 text-[#333]">{order.price}</td>
                    <td className="px-6 py-4 text-[#545454]">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-base font-medium ${
                          STATUS_STYLES[order.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center align-middle">
                      <button
                        ref={(el) => {
                          anchorRefs.current[order.id] = el;
                        }}
                        type="button"
                        onClick={() => handleToggle(order.id)}
                        aria-label="Order actions"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-[#545454]"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openId === order.id && anchorRefs.current[order.id] && (
                        <ActionsDropdown
                          anchorEl={anchorRefs.current[order.id]}
                          onClose={handleClose}
                          onSeeDetails={() => handleSeeDetails(order)}
                          onStatusChange={(s) =>
                            handleStatusChange(order.id, s)
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <p className="py-12 text-center text-base text-[#8A8A8A]">
              No orders found.
            </p>
          ) : (
            paginated.map((order) => (
              <div
                key={order.id + order.status + "m"}
                className="px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-[#333]">
                    {order.id}
                  </p>
                  <p className="text-base text-[#333] mt-0.5">
                    {order.customer}
                  </p>
                  <p className="text-base text-[#333]">{order.product}</p>
                  <p className="text-base text-[#333]">{order.price}</p>
                  <p className="text-base text-[#545454]">{order.date}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-base font-medium ${
                        STATUS_STYLES[order.status] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    ref={(el) => {
                      anchorRefs.current[`m-${order.id}`] = el;
                    }}
                    type="button"
                    onClick={() => handleToggle(`m-${order.id}`)}
                    aria-label="Order actions"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-[#545454]"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openId === `m-${order.id}` &&
                    anchorRefs.current[`m-${order.id}`] && (
                      <ActionsDropdown
                        anchorEl={anchorRefs.current[`m-${order.id}`]}
                        onClose={handleClose}
                        onSeeDetails={() => handleSeeDetails(order)}
                        onStatusChange={(s) => handleStatusChange(order.id, s)}
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
  },
);

OrdersTable.displayName = "OrdersTable";

export default OrdersTable;
