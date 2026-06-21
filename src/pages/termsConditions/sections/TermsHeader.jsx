import React from "react";
import { ShieldCheck } from "lucide-react";

const TermsHeader = () => {
  return (
    <div className="bg-green-50 py-14 md:py-16  lg:py-20 text-center mb-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100/50 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-green-200/50">
        <ShieldCheck size={14} />
        <span>Juridische Documentatie</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
        Algemene Voorwaarden
      </h1>
      <p className="text-gray-500 font-medium">
        IlluminOracle.nl – DCAPZ &bull; Laatst bijgewerkt: juni 2026
      </p>
    </div>
  );
};

export default TermsHeader;
