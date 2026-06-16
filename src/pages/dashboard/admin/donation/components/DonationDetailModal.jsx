import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { gsap } from 'gsap';

function DonationDetailModal({ donor, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
    );
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-modal-overlay'
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={panelRef}
        className='bg-white rounded-[10px] border border-[#E7F1F1] w-175 max-w-[95vw] max-h-[90vh] overflow-y-auto animate-modal-panel'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 pt-5 pb-4'>
          <h2 className='text-2xl font-semibold text-[#212121]'>Details</h2>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close details'
            className='w-9 h-9 flex items-center justify-center rounded-full bg-[#D9D9D9] hover:bg-gray-300 transition-colors shrink-0'
          >
            <X size={18} className='text-[#333]' />
          </button>
        </div>

        {/* Fields */}
        <div className='flex flex-col gap-4 px-5 pb-5'>
          {/* Full Name */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Full Name</p>
            <p className='text-lg text-[#0A0A0A]'>{donor.name}</p>
          </div>
          {/* Email */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Email</p>
            <p className='text-base text-[#0A0A0A]'>{donor.email}</p>
          </div>
          {/* Phone */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Phone</p>
            <p className='text-base text-[#0A0A0A]'>{donor.phone}</p>
          </div>
          {/* Donor Type */}
          <div className='flex flex-col gap-1.5'>
            <p className='text-sm font-medium text-[#4A5565]'>Donor Type</p>
            <span
              style={{ background: '#030213' }}
              className='inline-flex items-center text-white text-xs font-medium px-2.25 py-0.75 rounded-lg w-fit'
            >
              {donor.type}
            </span>
          </div>
          {/* Business Name */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Business Name</p>
            <p className='text-lg text-[#0A0A0A]'>
              {donor.businessName || '—'}
            </p>
          </div>
          {/* Donation Type */}
          <div className='flex flex-col gap-1.5'>
            <p className='text-sm font-medium text-[#4A5565]'>Type</p>
            {donor.donationType ? (
              <span
                style={{ background: '#030213' }}
                className='inline-flex items-center text-white text-xs font-medium px-2.25 py-0.75 rounded-lg w-fit capitalize'
              >
                {donor.donationType}
              </span>
            ) : (
              <p className='text-base text-[#0A0A0A]'>—</p>
            )}
          </div>
          {/* Description */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Description</p>
            <p className='text-sm text-[#0A0A0A]'>{donor.description || '—'}</p>
          </div>
          {/* Website */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Website</p>
            {donor.website ? (
              <a
                href={donor.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-base text-[#155DFC] hover:underline break-all'
              >
                {donor.website}
              </a>
            ) : (
              <p className='text-base text-[#0A0A0A]'>—</p>
            )}
          </div>
          {/* Amount */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Amount</p>
            <p className='text-3xl text-[#0A0A0A]'>{donor.amount}</p>
          </div>
          {/* Date */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Date</p>
            <p className='text-base text-[#0A0A0A]'>{donor.fullDate}</p>
          </div>
          {/* Transaction ID */}
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium text-[#4A5565]'>Transaction ID</p>
            <p className='text-sm text-[#0A0A0A] font-mono'>
              {donor.transactionId}
            </p>
          </div>
          {/* Donation Note */}
          {donor.notes && (
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-[#4A5565]'>
                Donation Note
              </p>
              <p className='text-sm text-[#0A0A0A]'>{donor.notes}</p>
            </div>
          )}
          {/* Proof image */}
          <div className='relative h-53.25 rounded-2xl overflow-hidden'>
            <img
              src='/images/donation-proof.jpg'
              alt='Donation proof'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/53 rounded-2xl' />
            <button
              type='button'
              aria-label='Download image'
              className='absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-xl backdrop-blur-[2px] hover:bg-white/20 transition-colors'
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Download size={14} className='text-white' />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default DonationDetailModal;
