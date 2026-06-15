import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { gsap } from 'gsap';

function DeleteModal({ name, onConfirm, onCancel }) {
  const overlayRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
    );
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' },
    );
  }, []);

  const dismiss = (cb) => {
    gsap.to(boxRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: cb,
    });
  };

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-modal-overlay'
    >
      <div
        ref={boxRef}
        className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-modal-panel'
      >
        <div className='flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4'>
          <Trash2 size={24} className='text-red-500' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          Delete Product
        </h3>
        <p className='text-base text-gray-500 mb-6'>
          Are you sure you want to delete{' '}
          <span className='font-semibold text-gray-800'>{name}</span>?
          <br />
          This action cannot be undone.
        </p>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => dismiss(onCancel)}
            className='flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='flex-1 py-2.5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors cursor-pointer'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
