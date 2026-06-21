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
    
    // 1. Try to find a campaign with the requested placement
    let campaign = activeCampaigns.find(
      (c) =>
        c.isActive &&
        c.isEnabled !== false &&
        placement &&
        c.placements?.includes(placement)
    );

    // 2. Fall back to GLOBAL campaign
    if (!campaign) {
      campaign = activeCampaigns.find(
        (c) =>
          c.isActive &&
          c.isEnabled !== false &&
          c.placements?.includes('GLOBAL')
      );
    }

    // 3. Fall back to any active and enabled campaign
    if (!campaign) {
      campaign = activeCampaigns.find(
        (c) => c.isActive && c.isEnabled !== false
      );
    }

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
      const description = campaign.description || "";
      const displayLink = campaign.linkUrl
        ? campaign.linkUrl.replace(/https?:\/\/(www\.)?/, "")
        : "";

      const content = (
        <div className={`w-full h-44 md:h-56 lg:h-72 relative rounded-xl overflow-hidden shadow-md border border-gray-200 group hover:shadow-lg transition-all duration-300 ${!campaign.image ? 'bg-green-500/60' : ''}`}>
          {/* Background Image */}
          {campaign.image && (
            <>
              <img
                src={campaign.image}
                alt={campaign.title || 'Advertisement'}
                className='w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500'
              />
              {/* Dark Overlay */}
              <div className='absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/60'></div>
            </>
          )}

          {/* Centered Content Overlay */}
          <div className='absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center text-white z-10'>
            {campaign.title && (
              <h4 className='text-white text-base md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 tracking-wide line-clamp-1 drop-shadow-md'>
                {campaign.title}
              </h4>
            )}
            {description && (
              <p className='text-white text-xs md:text-sm lg:text-base mb-2 md:mb-4 max-w-2xl leading-relaxed line-clamp-2 drop-shadow-sm'>
                {description}
              </p>
            )}
            {displayLink && (
              <span className='text-yellow-500 group-hover:text-yellow-400 text-xs md:text-sm font-semibold transition-colors duration-300 drop-shadow-sm'>
                {displayLink}
              </span>
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