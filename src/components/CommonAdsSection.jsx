import React, { memo } from 'react';
import { useGetActiveCampaignsQuery } from '../features/api/campaignApi';

const CommonAdsSection = memo(
  ({
    wrapperClassName = '',
    containerClassName = 'container mx-auto px-4 lg:px-6',
    placement = '',
  }) => {
    const { data, isLoading } = useGetActiveCampaignsQuery();

    const activeCampaigns = data?.campaigns || [];
    const campaign = activeCampaigns.find(
      (c) =>
        c.isActive &&
        c.isEnabled !== false &&
        c.placements?.includes(placement)
    );

    if (isLoading) {
      return (
        <div className={wrapperClassName}>
          <div className={containerClassName}>
            <div className='w-full h-44 md:h-56 lg:h-72 bg-gray-100 animate-pulse rounded-xl border border-dashed border-gray-300 flex items-center justify-center'>
              <span className='text-gray-400 font-bold text-xl md:text-2xl tracking-widest uppercase'>
                Loading Ad...
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (campaign) {
      const content = (
        <div className='w-full h-44 md:h-56 lg:h-72 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group'>
          <img
            src={campaign.image}
            alt={campaign.title || 'Advertisement'}
            className='w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500'
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <h4 className='font-bold text-base md:text-lg line-clamp-1'>
              {campaign.title}
            </h4>
            {campaign.description && (
              <p className='text-xs md:text-sm text-gray-200 line-clamp-1 mt-0.5'>
                {campaign.description}
              </p>
            )}
          </div>
        </div>
      );

      return (
        <div className={wrapperClassName}>
          <div className={containerClassName}>
            {campaign.linkUrl ? (
              <a
                href={campaign.linkUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full h-full'
              >
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={wrapperClassName}>
        <div className={containerClassName}>
          <div className='w-full h-44 md:h-56 lg:h-72 bg-[#F1F5F9] rounded-xl border border-dashed border-gray-300 flex items-center justify-center group'>
            <span className='text-black font-bold text-xl md:text-2xl tracking-widest uppercase'>
              Advertisement Area
            </span>
          </div>
        </div>
      </div>
    );
  },
);

CommonAdsSection.displayName = 'CommonAdsSection';

export default CommonAdsSection;