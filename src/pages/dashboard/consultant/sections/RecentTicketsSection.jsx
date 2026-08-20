import React, { useState } from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetMyQuestionsQuery } from '../../../../features/api/faqApi';
import { resolveI18n } from '../../../../utils/resolveI18n';
import TicketDetailModal from './TicketDetailModal';

const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  ANSWERED: 'bg-green-100 text-green-800 border border-green-200',
  Open: 'bg-[#f0e8ff] text-[#8b5cf6]',
  Resolved: 'bg-[#ececf6] text-[#6b7280]',
};

const RecentTicketsSection = () => {
  const { i18n } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetMyQuestionsQuery();
  const questions = data?.questions || [];

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTicket(null), 300);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E35AE]" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-[#2f2f2f] sm:text-2xl'>
          Recent Support Tickets
        </h2>
        <div className="text-center py-12 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl bg-white">
          No support tickets found.
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-[#2f2f2f] sm:text-2xl'>
          Recent Support Tickets
        </h2>

        <div className='space-y-3'>
          {questions.map((ticket) => (
            <button
              key={ticket.id}
              type='button'
              onClick={() => handleOpenTicket(ticket)}
              className='w-full text-left transition-all'
            >
              <div className='flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white px-4 py-4 shadow-[0_1px_8px_rgba(15,23,42,0.04)]'>
                <div className='flex min-w-0 items-start gap-3'>
                  <div className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f2ecfb] text-[#7a5ab6]'>
                    <MessageSquare size={18} aria-hidden='true' />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='truncate text-base font-semibold text-[#2f2f2f] sm:text-base'>
                      {resolveI18n(ticket.subject, i18n.language)}
                    </h3>
                    <p className='mt-1 text-sm text-gray-400 sm:text-sm'>
                      ID: #{ticket.id.slice(0, 8)} • Opened {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className='flex shrink-0 items-center gap-3'>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[ticket.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {ticket.status}
                  </span>
                  <ChevronRight size={24} className='text-gray-400' aria-hidden='true' />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <TicketDetailModal ticket={selectedTicket} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default RecentTicketsSection;
