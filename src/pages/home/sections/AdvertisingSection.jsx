import React, { memo } from "react";
import { useGetActiveCampaignsQuery } from "../../../features/api/campaignApi";

const AdvertisingSection = memo(() => {
  const { data, isLoading } = useGetActiveCampaignsQuery();

  const activeCampaigns = data?.campaigns || [];
  const campaign = activeCampaigns.find(
    (c) =>
      c.isActive && c.isEnabled !== false && c.placements?.includes("HOME"),
  );

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 px-4 bg-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 animate-pulse rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-400 font-semibold">Loading Ad...</span>
          </div>
        </div>
      </section>
    );
  }

  // Use dynamic values if campaign exists, otherwise fallback to defaults
  const imageSrc = campaign?.image || "/jbossAdvertising.webp";
  const description =
    campaign?.description ||
    "Turn your website traffic into revenue by enabling targeted advertising. Our platform allows businesses to showcase their products and services directly to your audience through strategically placed ads.";
  const linkUrl = campaign?.linkUrl || "https://www.e-commerce.com";
  const displayLink = campaign?.linkUrl
    ? campaign.linkUrl.replace(/https?:\/\/(www\.)?/, "")
    : "www.e-commerce.com";

  return (
    <section className="py-14 md:py-20 px-4 bg-linear-to-b from-white to-[#F8F3FD]">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Background Image with Overlay */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E9D5FF]/60"
        >
          {/* Background Image */}
          <img
            src={imageSrc}
            alt={campaign?.title || "E-commerce storefront"}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 text-center">
            {campaign?.title && (
              <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold font-crimson mb-3 tracking-wide">
                {campaign.title}
              </h3>
            )}
            <p className="text-white text-sm sm:text-base lg:text-lg mb-8 max-w-3xl leading-relaxed font-poppins opacity-90">
              {description}
            </p>

            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-[#E9D5FF] hover:text-white px-8 py-3 rounded-full text-base font-semibold font-poppins transition-all duration-300 border border-white/20 active:scale-95 backdrop-blur-xs"
              >
                {displayLink}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

AdvertisingSection.displayName = "AdvertisingSection";

export default AdvertisingSection;
