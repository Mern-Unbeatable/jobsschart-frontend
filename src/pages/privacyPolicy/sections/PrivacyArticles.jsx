import React from "react";
import { Search } from "lucide-react";

const PrivacyArticles = ({ filteredSections, activeSection }) => {
  if (filteredSections.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
        <Search className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Geen resultaten gevonden
        </h3>
        <p className="text-gray-500">
          Probeer een andere zoekterm om specifieke artikelen te vinden.
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredSections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <article
            key={sec.id}
            id={sec.id}
            className={`bg-white rounded-xl border transition-all duration-300 p-8 shadow-sm ${
              isActive
                ? "border-green-600/30 ring-1 ring-green-600/30"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
              <span className="w-1.5 h-6 rounded-full bg-green-600 block" />
              {sec.title}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-600 font-medium">
              {sec.content.map((paragraph, index) => {
                const isBullet =
                  paragraph.trim().startsWith("•") ||
                  paragraph.trim().startsWith("*");
                return (
                  <p
                    key={index}
                    className={`${isBullet ? "pl-4 -indent-4 text-gray-600" : "text-gray-700"}`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        );
      })}
    </>
  );
};

export default PrivacyArticles;
