import React, { useState, useEffect, useRef } from "react";
import { useSEO } from "../../hooks/useSEO";
import cookieSections from "../../data/cookiePolicy.json";

// Import sections
import CookieHeader from "./sections/CookieHeader";
import CookieSidebar from "./sections/CookieSidebar";
import CookieArticles from "./sections/CookieArticles";
import CookieCompanyDetails from "./sections/CookieCompanyDetails";
import CookieContactCard from "./sections/CookieContactCard";

const CookiePolicy = () => {
  useSEO({
    title: "Cookiebeleid - IlluminOracle",
    description:
      "Cookiebeleid voor IlluminOracle.nl door DCAPZ. Informatie over het gebruik van cookies en vergelijkbare trackingtechnologieën.",
    keywords: [
      "cookies",
      "cookiebeleid",
      "tracking",
      "privacy",
      "IlluminOracle",
      "DCAPZ",
    ],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(cookieSections[0].id);
  const contentRefs = useRef({});

  // Setup refs dynamically
  cookieSections.forEach((sec) => {
    if (!contentRefs.current[sec.id]) {
      contentRefs.current[sec.id] = React.createRef();
    }
  });

  // Handle intersection observer to highlight current section in sidebar while scrolling
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px",
      threshold: [0.2],
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    cookieSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
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

  // Filter sections based on search query
  const filteredSections = cookieSections.filter((sec) => {
    const titleMatch = sec.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const contentMatch = sec.content.some((line) =>
      line.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased pb-16">
      
      {/* Header Section */}
      <CookieHeader />

      {/* Main Container */}
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Section */}
          <CookieSidebar
            sections={cookieSections}
            filteredSections={filteredSections}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
          />

          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Articles List */}
            <CookieArticles
              filteredSections={filteredSections}
              activeSection={activeSection}
            />

            {/* Company Info Box */}
            <CookieCompanyDetails />

            {/* Support Callout Box */}
            <CookieContactCard />

          </main>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
