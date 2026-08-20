import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveI18n } from '../../../../utils/resolveI18n';

const TicketDetailModal = ({ ticket, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  if (!isOpen || !ticket) return null;

  const subject = resolveI18n(ticket.subject, i18n.language);
  const question = resolveI18n(ticket.question, i18n.language) || 'No details available';
  const answer = resolveI18n(ticket.answer, i18n.language)
    || 'No response yet. Our admin team will review and answer your question shortly.';

  const ticketData = {
    id: ticket.id,
    question,
    response: {
      title: subject ? `Re: ${subject}` : 'Response',
      date: ticket.answeredAt ? new Date(ticket.answeredAt).toLocaleString() : '',
      content: answer,
    },
  };

  const renderFormattedText = (text) => {
    const parts = String(text || '').split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white shadow-2xl">
        <div className="sticky top-0 bg-white px-8 pt-8 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[#6B4E90] transition-colors hover:text-[#4A3564]"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Tickets
          </button>
          <div className="mt-6 h-[1px] w-full bg-gray-100"></div>
        </div>

        <div className="space-y-8 px-8 pb-10 pt-2">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#6B4E90] text-sm font-bold text-white shadow-sm">
                ?
              </div>
              <h2 className="text-[19px] font-medium text-gray-900">Your Question</h2>
            </div>

            <div className="flex overflow-hidden rounded-xl bg-[#F8F9FA]">
              <div className="w-[5px] shrink-0 bg-[#6B4E90]"></div>
              <div className="p-5 text-[15px] italic leading-relaxed text-[#5A5A5A] w-full break-words">
                {ticketData.question}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h3
                className="text-[26px] font-bold tracking-tight text-gray-900"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
              >
                {ticketData.response.title}
              </h3>
              {ticketData.response.date && (
                <p className="whitespace-nowrap text-[13px] font-medium text-gray-500">
                  {ticketData.response.date}
                </p>
              )}
            </div>

            <div className="text-[15px] leading-relaxed text-[#4A4A4A]">
              {String(ticketData.response.content).split('\n').map((line, idx, array) => {
                const isBoldHeader = line.startsWith('**') && line.endsWith('**') && line.includes(':');
                const isIndented = line.startsWith('  ');
                const isLastLine = idx === array.length - 1;

                if (isBoldHeader) {
                  return (
                    <p key={idx} className="mt-5 mb-2 text-gray-900">
                      {renderFormattedText(line)}
                    </p>
                  );
                }

                if (isIndented) {
                  return (
                    <p key={idx} className="ml-5 mt-1">
                      {renderFormattedText(line.trim())}
                    </p>
                  );
                }

                return (
                  <p key={idx} className={isLastLine ? 'mt-5' : 'mt-0'}>
                    {renderFormattedText(line)}
                  </p>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
