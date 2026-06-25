import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const CommunitySection = memo(() => {
  const { t } = useTranslation();

  const stats = [
    { id: 1, number: '5k+', labelKey: 'home.communitySection.stats.activeMembers' },
    { id: 2, number: '12k+', labelKey: 'home.communitySection.stats.discussions' },
    { id: 3, number: '24/7', labelKey: 'home.communitySection.stats.support' },
  ];

  const communityMembers = [
    { id: 1, image: '/member1.jpeg', rounded: 'rounded-xl' },
    { id: 2, image: '/member2.jpeg', rounded: 'rounded-full' },
    { id: 3, image: '/member3.jpeg', rounded: 'rounded-xl' },
    { id: 4, image: '/member4.jpeg', rounded: 'rounded-full' },
    { id: 5, image: '/member5.jpeg', rounded: 'rounded-xl' },
    { id: 6, image: '/member6.jpeg', rounded: 'rounded-full' },
  ];

  return (
    <section className='py-14 md:py-20 bg-[#F8F3FD]'>
      <div className='container mx-auto px-4 lg:px-6 '>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center'>
          
          {/* Left Content */}
          <div className='flex flex-col items-start'>
            <div className='mb-2 mb:mb-8'>
              <h2 className='text-2xl md:text-4xl font-bold mb-2 text-gray-900 leading-tight font-crimson'>
                {t('home.communitySection.title')}
              </h2>
              {/* Underline matching the theme */}
              <div className='w-12 h-1 bg-[#6E35AE] mb-4 md:mb-6 rounded-full'></div>
              
              <p className='text-base text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-lg font-poppins'>
                {t('home.communitySection.description')}
              </p>

              <button className='bg-[#6E35AE] hover:bg-[#582791] text-white px-8 py-3 rounded-full text-base font-semibold font-poppins transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer'>
                {t('home.communitySection.button')}
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 sm:gap-8 lg:gap-10 mt-6 lg:mt-8 pt-2 lg:pt-8 w-full border-t border-[#DFC2FF]'>
              {stats.map((stat) => (
                <div key={stat.id} className='flex flex-col items-start'>
                  <p className='text-3xl font-bold text-[#6E35AE] font-crimson'>{stat.number}</p>
                  <p className='text-sm sm:text-base text-gray-500 font-medium font-poppins sm:uppercase sm:tracking-wider'>
                    {t(stat.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Mixed Shapes Image Grid */}
          <div className='flex justify-center lg:justify-end lg:px-4 pr-0 mt-2 lg:mt-0'>
            <div className='grid grid-cols-3 gap-3 sm:gap-6 lg:gap-14 w-full max-w-88 sm:max-w-md'>
              {communityMembers.map((member) => (
                <div 
                  key={member.id} 
                  className={`aspect-square w-full overflow-hidden shadow-sm ${member.rounded}`}
                >
                  <img 
                    src={member.image}
                    alt='Member'
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

CommunitySection.displayName = 'CommunitySection';

export default CommunitySection;