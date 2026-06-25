import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Video, MessageSquare } from 'lucide-react';

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
  const { t, i18n } = useTranslation();
  const isDutch = i18n.resolvedLanguage === 'nl' || i18n.language === 'nl';

  return (
    <section className='w-full py-14 md:py-20 bg-[#F8F3FD]'>
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {SERVICES.map((service, index) => (
            <div key={index} className='flex flex-col items-start group'>
              {/* Icon - Styled with theme color */}
              <div className='flex items-center justify-center w-12 h-12 bg-[#E9D5FF] rounded-xl mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300'>
                <service.icon size={22} className='text-[#6E35AE]' />
              </div>

              {/* Title - Serif style font */}
              <h3 className='text-2xl font-crimson font-bold text-gray-900 mb-3 '>
                {t(service.titleKey)}
              </h3>

              {/* Description */}
              <p
                className={`text-base font-poppins text-gray-600 leading-relaxed mb-6 max-w-75 ${
                  isDutch ? 'md:h-18' : ''
                }`}
              >
                {t(service.descriptionKey)}
              </p>

              {/* Bottom Divider Line */}
              <div className='w-full h-0.5 bg-[#E9D5FF] transition-all duration-300 group-hover:bg-[#6E35AE]'></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;