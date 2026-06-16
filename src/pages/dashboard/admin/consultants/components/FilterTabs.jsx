import React, { useRef } from "react";
import { gsap } from "gsap";

const FILTERS = ["All", "Approved", "Pending", "Suspended"];

function FilterTabs({ active, onChange }) {
  const btnRefs = useRef([]);
  return (
    <div className="bg-white border border-black/10 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-fit">
      {FILTERS.map((f, i) => (
        <button
          key={f}
          ref={(el) => (btnRefs.current[i] = el)}
          onClick={() => onChange(f)}
          onMouseEnter={() => {
            if (f !== active)
              gsap.to(btnRefs.current[i], { scale: 1.04, duration: 0.14 });
          }}
          onMouseLeave={() =>
            gsap.to(btnRefs.current[i], { scale: 1, duration: 0.14 })
          }
          className={`flex-1 sm:flex-none text-center px-3 py-1 rounded-md text-base font-normal transition-colors ${
            active === f
              ? "bg-[#FCF7E7] text-green-500/60"
              : "text-[#333] hover:text-green-500/60"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
