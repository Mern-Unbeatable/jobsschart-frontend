import React, { useState, useEffect, useRef } from "react";
import { useSEO } from "../../hooks/useSEO";
import articles from "../../data/termsConditions.json";

// Import sections
import TermsHeader from "./sections/TermsHeader";
import TermsSidebar from "./sections/TermsSidebar";
import TermsArticles from "./sections/TermsArticles";
import TermsCompanyDetails from "./sections/TermsCompanyDetails";
import TermsContactCard from "./sections/TermsContactCard";

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
      const offset = 90;
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
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pb-16">
      
      {/* Header Section */}
      <TermsHeader />

      {/* Main Container */}
      <div className="container mx-auto px-4 relative ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ">
          
          {/* Sidebar Section */}
          <TermsSidebar
            articles={articles}
            filteredArticles={filteredArticles}
            activeArticle={activeArticle}
            scrollToArticle={scrollToArticle}
          />

          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Articles List */}
            <TermsArticles
              filteredArticles={filteredArticles}
              activeArticle={activeArticle}
            />

            {/* Company Info Box */}
            <TermsCompanyDetails />

            {/* Support Callout Box */}
            <TermsContactCard />

          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
