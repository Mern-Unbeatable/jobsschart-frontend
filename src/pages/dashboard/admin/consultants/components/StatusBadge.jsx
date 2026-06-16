import React from "react";

const STATUS_STYLES = {
  Approved: { badge: "bg-[#eefff1] text-[#05bc27]" },
  Pending: { badge: "bg-[#fff8ed] text-[#f59e0b]" },
  Suspended: { badge: "bg-[#fff1f1] text-[#ef4444]" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${style.badge}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
