import React, { memo } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { ROUTES } from "../../../config";

const HeroSection = memo(() => {
  const { t } = useTranslation();
  return (
    <section
      aria-label="Car search hero"
      className="relative w-full h-100 md:h-180 2xl:h-220 flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src="/home.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="eager"
      />
      {/* Light overlay — keeps text readable while image stays vivid */}
      <div
        className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full container mx-auto px-4 lg:px-6  py-14 sm:py-20">
        <div className=" max-w-5xl">
          {" "}
          {/* Limits width to keep text readable on left */}
          <h1 className="font-crimson text-white font-medium text-2xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 leading-tight ">
            {t('hero.title')}
          </h1>
          <p className="text-white font-poppins! text-base sm:text-xl mb-6 sm:mb-8">
            {t('hero.subtitle')}
          </p>
          {/* Green Button matching image_6519a8.jpg */}
          <button className="bg-green-500 cursor-pointer text-white px-6 py-3 rounded-sm font-medium text-base transition-all duration-300 shadow-md active:scale-95">
            {t('hero.button')}
          </button>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
