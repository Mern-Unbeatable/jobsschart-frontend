import React from 'react';
import { createPortal } from 'react-dom';
import { XCircle, Loader2 } from 'lucide-react';
import AudioCallModal from '../../pages/consultants/sections/AudioCallModal';
import VideoCallModal from '../../pages/consultants/sections/VideoCallModal';

export default function UserBookingModals({
  showAudio,
  showVideo,
  selectedConsultant,
  cancelConfirm,
  isCancelling,
  onCloseCalls,
  onCloseCancel,
  onConfirmCancel,
}) {
  return (
    <>
      {selectedConsultant && (
        <>
          <AudioCallModal
            isOpen={showAudio}
            onClose={onCloseCalls}
            consultant={selectedConsultant}
          />
          <VideoCallModal
            isOpen={showVideo}
            onClose={onCloseCalls}
            consultant={selectedConsultant}
          />
        </>
      )}

      {cancelConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100">
                <XCircle size={24} className="text-rose-500" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-center text-lg font-bold text-gray-900">Cancel appointment?</h3>
              <p className="mb-6 text-center text-sm text-gray-500">
                Cancel your appointment with <strong>{cancelConfirm.consultantName}</strong> on{' '}
                <strong>{cancelConfirm.date}</strong> at <strong>{cancelConfirm.time}</strong>? Your
                consultant will be notified.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCloseCancel}
                  disabled={isCancelling}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  Keep appointment
                </button>
                <button
                  type="button"
                  onClick={onConfirmCancel}
                  disabled={isCancelling}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {isCancelling ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Cancelling…
                    </span>
                  ) : (
                    'Yes, cancel'
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
