import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setLanguage,
  selectCurrentLanguage,
  selectSupportedLanguages,
} from "../store/slices/languageSlice";
const EnglishFlag = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
    width={size}
    height={(size * 3) / 5}
    className={className}
    aria-hidden="true"
  >
    <clipPath id="uk-flag-clip">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk-flag-clip)" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const currentLang = useSelector(selectCurrentLanguage);
  const supportedLangs = useSelector(selectSupportedLanguages);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync Redux state with i18next on mount
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n
        .changeLanguage(currentLang)
        .then(() => {})
        .catch((err) =>
          console.error("[LanguageSelector] i18n.changeLanguage error:", err),
        );
    }
  }, [currentLang, i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = async (langCode) => {
    try {
      // 1. Update Redux state
      dispatch(setLanguage(langCode));

      // 2. Update i18next language (this also updates localStorage)
      await i18n.changeLanguage(langCode);

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const currentLanguage = supportedLangs[currentLang];

  const renderFlag = (code, size = 18) => {
    if (code === "nl") {
      return (
        <img
          src="/nl.png"
          alt="Nederlands"
          style={{ width: size, height: (size * 3) / 5, objectFit: "cover" }}
          className="rounded-sm shadow-sm"
        />
      );
    }
    if (code === "en") {
      return <EnglishFlag size={size} className="rounded-sm shadow-sm" />;
    }
    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-all"
      >
        {renderFlag(currentLang, 20)}
        <span className="hidden md:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {Object.values(supportedLangs).map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                currentLang === lang.code
                  ? "bg-purple-50 text-purple-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {renderFlag(lang.code, 20)}
              <span>{lang.name}</span>
              {currentLang === lang.code && (
                <span className="ml-auto text-purple-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
