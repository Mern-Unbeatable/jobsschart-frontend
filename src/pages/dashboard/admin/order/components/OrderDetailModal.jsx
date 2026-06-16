import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const ALL_STATUSES = [
  "Pending",
  "Processing",
  "Delivered",
  "Shipped",
  "Cancelled",
];

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power2.out" },
    );
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-modal-overlay"
      onClick={handleBackdrop}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-panel"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
          <div>
            <h2 className="text-xl font-semibold text-[#050609]">
              Order Details
            </h2>
            <p className="text-base text-[#545454] mt-0.5">
              Order ID : {order.id.replace("#", "")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#545454] text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base text-[#545454]">
                Customer Information
              </span>
            </div>
            <p className="font-semibold text-[#050609] text-base">
              {order.customer}
            </p>
            <p className="text-base text-[#545454] mt-1">{order.phone}</p>
            <p className="text-base text-[#545454]">{order.email}</p>
            <p className="text-base text-[#545454] mt-1">{order.address}</p>
          </div>

          {/* Order Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base text-[#545454]">Order Summary</span>
            </div>
            <div className="flex flex-col gap-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-[#F9FAFB] rounded-lg px-3 py-2"
                >
                  <div className="w-10 h-10 rounded-md bg-[#E5E7EB] shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-[#050609] truncate">
                      {item.name}
                    </p>
                    <p className="text-base text-[#8A8A8A]">
                      Quantity: {item.qty}
                    </p>
                  </div>
                  <span className="text-base font-semibold text-[#050609] shrink-0">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-[#F0F0F0] pt-3">
              <div className="flex justify-between text-base text-[#333]">
                <span>Subtotal</span>
                <span className="font-medium text-[#3DB4CC]">
                  {order.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-base text-[#333]">
                <span>Delivery Charge</span>
                <span className="font-medium text-[#3DB4CC]">
                  {order.delivery}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#050609] border-t border-[#F0F0F0] pt-2 mt-1">
                <span>Total</span>
                <span className="text-[#3DB4CC]">{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Reason */}
        {order.cancelReason && (
          <div className="mx-6 mb-5 rounded-lg bg-[#FFF0F0] border border-[#FFCECE] px-4 py-3">
            <p className="text-base font-semibold text-[#EF4444] mb-1">
              Cancel Reason
            </p>
            <p className="text-base text-[#EF4444] leading-relaxed">
              {order.cancelReason}
            </p>
          </div>
        )}

        {/* Update Order Status */}
        <div className="px-6 pb-6">
          <p className="text-base font-semibold text-[#050609] mb-3">
            Update Order Status
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={`px-4 py-1.5 rounded border text-base font-medium transition-colors ${
                  order.status === s
                    ? "bg-[#3DB4CC] border-[#3DB4CC] text-white"
                    : "border-[#D0D0D0] text-[#333] hover:border-[#3DB4CC] hover:text-[#3DB4CC]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default OrderDetailModal;
