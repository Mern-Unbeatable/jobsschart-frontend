import React from "react";
import { ArrowRight } from "lucide-react";

const TermsSidebar = ({ articles, filteredArticles, activeArticle, scrollToArticle }) => {
  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">
          Inhoudsopgave
        </h3>
        <nav className="space-y-1">
          {articles.map((art) => {
            const isFilteredOut = !filteredArticles.some((f) => f.id === art.id);
            return (
              <button
                key={art.id}
                onClick={() => scrollToArticle(art.id)}
                disabled={isFilteredOut}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between text-base font-semibold group ${
                  activeArticle === art.id
                    ? "bg-green-50 text-green-700"
                    : isFilteredOut
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="truncate">
                  {art.title.replace("Artikel ", "Art. ")}
                </span>
                <ArrowRight
                  size={14}
                  className={`transition-transform duration-300 ${
                    activeArticle === art.id
                      ? "translate-x-0 opacity-100 text-green-600"
                      : "translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default TermsSidebar;
