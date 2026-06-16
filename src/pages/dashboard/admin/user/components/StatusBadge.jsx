import React from "react";

const STATUS_STYLES = {
  Active: { badge: "bg-[#eefff1] text-[#05bc27]" },
  Suspended: { badge: "bg-[#fff1f1] text-[#ef4444]" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Active;
  return (
    <span
      className={`inline-flex items-center px-4 py-0.5 rounded-full text-base font-normal ${style.badge}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
