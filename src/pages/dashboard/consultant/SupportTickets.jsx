import React from 'react';
import FaqSection from './sections/FaqSection';
import SupportInquirySection from './sections/SupportInquirySection';
import RecentTicketsSection from './sections/RecentTicketsSection';

const SupportTickets = () => {
  return (
    <section className='space-y-4'>
      <div className='space-y-2'>
        <h1 className='dashboard-page-title text-[#2f2f2f] '>
          Support Tickets
        </h1>
        <p className='mt-1 dashboard-page-subtitle text-gray-500'>
          Feel free to solve your doubts anytime
        </p>
      </div>

      <FaqSection />
      <SupportInquirySection />
      <RecentTicketsSection />
    </section>
  );
};

export default SupportTickets;