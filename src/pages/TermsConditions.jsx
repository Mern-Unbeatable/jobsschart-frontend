import React, { useState, useEffect, useRef } from "react";
import { useSEO } from "../hooks/useSEO";
import {
  FileText,
  Search,
  Printer,
  ArrowRight,
  ShieldCheck,
  Mail,
  Info,
} from "lucide-react";
import articles from "../data/termsConditions.json";

const TermsConditions = () => {
  useSEO({
    title: "Algemene Voorwaarden - IlluminOracle",
    description:
      "Algemene voorwaarden voor het gebruik van het IlluminOracle platform door DCAPZ.",
    keywords: [
      "algemene voorwaarden",
      "voorwaarden",
      "terms",
      "conditions",
      "IlluminOracle",
      "DCAPZ",
    ],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(articles[0].id);
  const contentRefs = useRef({});

  // Setup refs dynamically
  articles.forEach((art) => {
    if (!contentRefs.current[art.id]) {
      contentRefs.current[art.id] = React.createRef();
    }
  });

  // Handle intersection observer to highlight current article in sidebar while scrolling
  useEffect(() => {
    const observers = [];
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setActiveArticle(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px",
      threshold: [0.2],
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    articles.forEach((art) => {
      const el = document.getElementById(art.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToArticle = (id) => {
    setActiveArticle(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for sticky nav/header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter((art) => {
    const titleMatch = art.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const contentMatch = art.content.some((line) =>
      line.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased py-16">
{/**header  */}
      <div className="bg-green-50 py-10 text-center mb-8">
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

      {/* Main Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-thin">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Inhoudsopgave
              </h3>
              <nav className="space-y-1">
                {articles.map((art) => {
                  const isFilteredOut = !filteredArticles.some(
                    (f) => f.id === art.id,
                  );
                  return (
                    <button
                      key={art.id}
                      onClick={() => scrollToArticle(art.id)}
                      disabled={isFilteredOut}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between text-sm font-semibold group ${
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

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-green-800 to-emerald-950 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden hidden lg:block">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
              <Info className="mb-4 text-green-300" size={24} />
              <h4 className="font-bold text-lg mb-2">
                Vragen over deze voorwaarden?
              </h4>
              <p className="text-green-200 text-sm mb-4 leading-relaxed">
                Neem contact op met DCAPZ voor meer informatie over het platform
                en het beheer van uw beltegoed.
              </p>
              <a
                href="mailto:info@netwerkmediums.nl"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-green-950 px-4 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
              >
                <span>info@netwerkmediums.nl</span>
              </a>
            </div>
          </aside>

          {/* Articles Content Area */}
          <main className="lg:col-span-8 space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Geen resultaten gevonden
                </h3>
                <p className="text-gray-500">
                  Probeer een andere zoekterm om specifieke artikelen te vinden.
                </p>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isActive = activeArticle === art.id;
                return (
                  <article
                    key={art.id}
                    id={art.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 p-8 shadow-sm ${
                      isActive
                        ? "border-green-600/30 ring-1 ring-green-600/30"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                      <span className="w-1.5 h-6 rounded-full bg-green-600 block" />
                      {art.title}
                    </h2>
                    <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 font-medium">
                      {art.content.map((paragraph, index) => {
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
              })
            )}

            {/* Final Contact Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Bedrijfsgegevens
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold text-gray-600">
                <div className="space-y-1">
                  <p className="text-gray-900 font-bold">DCAPZ B.V.</p>
                  <p>Wijnstraat 75</p>
                  <p>3311 BT Dordrecht</p>
                </div>
                <div className="space-y-1">
                  <p>KvK-nummer: 42039361</p>
                  <p>BTW-nummer: NL005448711B24</p>
                  <p>
                    E-mail:{" "}
                    <a
                      href="mailto:info@netwerkmediums.nl"
                      className="text-green-600 hover:underline"
                    >
                      info@netwerkmediums.nl
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
