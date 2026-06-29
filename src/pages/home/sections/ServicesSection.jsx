import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Video, MessageSquare } from 'lucide-react';
import { ROUTES } from '../../../config';

const SERVICES = [
  {
    icon: Phone,
    titleKey: 'home.services.telephone.title',
    descriptionKey: 'home.services.telephone.description',
  },
  {
    icon: Video,
    titleKey: 'home.services.video.title',
    descriptionKey: 'home.services.video.description',
  },
  {
    icon: MessageSquare,
    titleKey: 'home.services.chat.title',
    descriptionKey: 'home.services.chat.description',
  },
];

const ServicesSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section className='w-full py-14 md:py-20 bg-[#F8F3FD]'>
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch'>
          {SERVICES.map((service, index) => (
            <Link
              to={ROUTES.CONSULTANTS}
              key={index}
              className='flex flex-col justify-between h-full group w-full cursor-pointer hover:no-underline'
            >
              <div className='flex flex-col items-start'>
                {/* Icon - Styled with theme color */}
                <div className='flex items-center justify-center w-12 h-12 bg-[#E9D5FF] rounded-xl mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300'>
                  <service.icon size={22} className='text-[#6E35AE]' />
                </div>

                {/* Title - Serif style font */}
                <h3 className='text-2xl font-crimson font-bold text-gray-900 mb-3 '>
                  {t(service.titleKey)}
                </h3>

                {/* Description */}
                <p className='text-sm font-poppins text-gray-600 leading-relaxed mb-4 max-w-75'>
                  {t(service.descriptionKey)}
                </p>

                {/* Click here link/button with different color */}
                <span className='text-sm font-poppins font-semibold text-[#B45309] group-hover:text-[#D97706] transition-colors duration-200 mb-6 inline-block'>
                  {t('home.services.clickHere')} &gt;&gt;
                </span>
              </div>

              {/* Bottom Divider Line */}
              <div className='w-full h-0.5 bg-[#E9D5FF] transition-all duration-300 group-hover:bg-[#6E35AE]'></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;