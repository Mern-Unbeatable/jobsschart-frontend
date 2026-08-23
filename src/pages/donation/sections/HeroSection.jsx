import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0612]">
      <img
        src="/donation.jpeg"
        alt={t('donationHero.title', { defaultValue: 'Donation' })}
        className="block w-full h-auto max-w-full object-contain object-center"
        decoding="async"
      />
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
