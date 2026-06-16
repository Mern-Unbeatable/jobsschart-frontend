import React from "react";

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FCF7E7]">
          <Icon size={18} className="text-green-500/60" />
        </span>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default InfoCard;
