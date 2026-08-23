import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = memo(() => {
  const { t } = useTranslation();

  const scrollToForm = () => {
    document.getElementById('donation-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0612]">
      <img
        src="/donation.jpeg"
        alt={t('donationHero.title', { defaultValue: 'Donation' })}
        className="block w-full h-auto max-w-full object-contain object-center"
        decoding="async"
      />

      <div className="absolute inset-0 pointer-events-none">
        <button
          type="button"
          onClick={scrollToForm}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-[54%] md:top-[62%] lg:top-[66%] xl:top-[68%] rounded-full bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm md:px-8 md:py-3 md:text-base lg:px-10 lg:py-3.5 lg:text-lg text-white font-semibold shadow-lg shadow-green-900/30 transition-all duration-300 cursor-pointer whitespace-nowrap"
        >
          {t('donationHero.button')}
        </button>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
