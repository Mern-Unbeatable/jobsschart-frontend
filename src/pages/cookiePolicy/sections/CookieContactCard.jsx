import React from "react";
import { Info } from "lucide-react";

const CookieContactCard = () => {
  return (
    <div className="bg-green-100 text-white rounded-xl p-6 shadow-lg relative overflow-hidden mt-6">
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
      <Info className="mb-4 text-green-700" size={24} />
      <h4 className="font-bold text-lg mb-2 text-green-700">
        Vragen over cookies?
      </h4>
      <p className="text-green-700 text-sm mb-4 leading-relaxed">
        Neem contact op met DCAPZ voor meer informatie over hoe we cookies en vergelijkbare technieken gebruiken op ons platform.
      </p>
      <a
        href="mailto:info@netwerkmediums.nl"
        className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-green-950 px-4 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
      >
        <span>info@netwerkmediums.nl</span>
      </a>
    </div>
  );
};

export default CookieContactCard;
