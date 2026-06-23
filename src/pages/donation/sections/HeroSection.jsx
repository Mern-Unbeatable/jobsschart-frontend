import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = memo(() => {
  const { t } = useTranslation();
  return (
    <div
      className='relative w-full h-100 md:h-180 2xl:h-220  bg-cover bg-top flex items-center'
      style={{
        backgroundImage: 'url("/donate/donation.png")',
      }}
    >
      {/* Dark Overlay - */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent'></div>

      <div className='relative z-10 container mx-auto px-6 lg:px-6'>
        <div className='max-w-2xl'>
          {/* Title - Serif  */}
          <h1 className='text-3xl sm:text-4xl lg:text-6xl text-white mb-4 leading-tight tracking-tight'>
            {t('donationHero.title')}
          </h1>
          
          {/* Subtitle */}
          <p className='text-base md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed'>
            {t('donationHero.description')}
          </p>

     
          <button 
            className='bg-green-400/90 hover:bg-green-600 cursor-pointer text-white px-6 py-3 rounded-sm font-medium text-sm sm:text-base transition-all duration-300 shadow-md active:scale-95'
          >
            {t('donationHero.button')}
          </button>
        </div>
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;