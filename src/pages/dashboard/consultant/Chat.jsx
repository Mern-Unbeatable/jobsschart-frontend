
import React, { memo, useCallback, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import RealTimeChat from '../../consultants/RealTimeChat';
import { clearCompletedConsultation, isConsultationCompleted } from '../../../utils/consultantChatHistory';

const ConsultantChat = memo(() => {
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedConversationId, setCompletedConversationId] = useState(null);

  const openCompletedModal = useCallback((conversationId) => {
    if (!conversationId) return;
    setCompletedConversationId(conversationId);
    setShowCompletedModal(true);
  }, []);

  const handleConversationChange = useCallback((conversationId, conv) => {
    if (conv?.sessionStatus === 'ENDED' || isConsultationCompleted(conversationId)) {
      openCompletedModal(conversationId);
    }
  }, [openCompletedModal]);

  const handleSessionEnded = useCallback((conversationId) => {
    openCompletedModal(conversationId);
  }, [openCompletedModal]);

  const handleDismissCompleted = useCallback(() => {
    if (completedConversationId) {
      clearCompletedConsultation(completedConversationId);
    }
    setShowCompletedModal(false);
    setCompletedConversationId(null);
  }, [completedConversationId]);

  return (
    <>
      <div className='flex flex-col gap-4 h-full min-h-0 overflow-hidden'>
        <div className='shrink-0'>
          <h1 className='dashboard-page-title'>Messages</h1>
          <p className='dashboard-page-subtitle mt-1'>
            Your conversations with clients.
          </p>
        </div>

        <RealTimeChat
          className='flex-1 min-h-0 h-full'
          showSidebar={true}
          onConversationChange={handleConversationChange}
          onSessionEnded={handleSessionEnded}
        />
      </div>

      {showCompletedModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <div className='w-full max-w-[527px] rounded-[10px] border border-[#e7f1f1] bg-white px-4.5 py-5.75'>
            <div className='flex flex-col items-center gap-5'>
              <div className='flex size-[76px] items-center justify-center rounded-[38px] bg-[#ebf8ec]'>
                <CheckCircle2
                  size={40}
                  className='text-[#05bc27]'
                  aria-hidden='true'
                />
              </div>
              <div className='text-center space-y-2'>
                <h2 className='text-[28px] font-semibold text-[#1a1b1c]'>
                  Consultation Completed
                </h2>
                <p className='text-sm text-gray-500 max-w-sm'>
                  This chat session has ended. For privacy, previous messages are only available to the customer.
                </p>
              </div>
              <button
                type='button'
                onClick={handleDismissCompleted}
                className='rounded bg-[#8631da] px-6 py-2.5 text-sm text-white transition-colors duration-150 hover:bg-[#6e35ae]'
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ConsultantChat.displayName = 'ConsultantChat';
export default ConsultantChat;
