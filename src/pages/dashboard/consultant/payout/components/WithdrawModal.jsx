import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function WithdrawModal({
  isOpen,
  isClosing,
  onClose,
  onSubmit,
  isSubmitting = false,
  defaultIban = "",
  defaultBusinessName = "",
}) {
  const [amount, setAmount] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setBusinessName(defaultBusinessName || "");
      setRoutingNumber(defaultIban || "");
      setAccountNumber("");
    }
  }, [isOpen, defaultIban, defaultBusinessName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, businessName, routingNumber, accountNumber });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 ${
        isClosing ? "animate-modal-overlay-out" : "animate-modal-overlay"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdraw-modal-title"
    >
      <div
        className={`w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[20px] bg-white p-6 shadow-[20px_20px_93px_0px_rgba(0,0,0,0.2)] ${
          isClosing ? "animate-modal-panel-out" : "animate-modal-panel"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3
            id="withdraw-modal-title"
            className="text-3xl font-medium leading-none text-black"
          >
            Withdraw Funds
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9d9d9] text-[#2d3036] transition-colors duration-200 hover:bg-[#cfcfcf] disabled:opacity-50"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="withdraw-amount"
              className="block text-base text-black"
            >
              Enter amount
            </label>
            <div className="flex h-11.75 items-center gap-2 rounded-lg border border-[#cdcdcd] px-4">
              <span className="text-base font-medium text-black">€</span>
              <input
                id="withdraw-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter withdrawal amount"
                className="h-full w-full border-none bg-transparent text-base font-medium text-black placeholder:text-[#9ca3af] outline-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="withdraw-business-name"
              className="block text-base text-black"
            >
              Name of the business / organisation
            </label>
            <input
              id="withdraw-business-name"
              type="text"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Enter business or organisation name"
              className="h-11.75 w-full rounded-lg border border-[#cdcdcd] px-4 text-base text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="withdraw-routing-number"
              className="block text-base text-black"
            >
              IBAN (International Bank Account Number)
            </label>
            <input
              id="withdraw-routing-number"
              type="text"
              value={routingNumber}
              onChange={(event) => setRoutingNumber(event.target.value)}
              placeholder="e.g. NL00 BANK 0123 4567 89"
              className="h-11.75 w-full rounded-lg border border-[#cdcdcd] px-4 text-base text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="withdraw-account-number"
              className="block text-base text-black"
            >
              Business Bank Account (optional BIC/SWIFT)
            </label>
            <input
              id="withdraw-account-number"
              type="text"
              value={accountNumber}
              onChange={(event) => setAccountNumber(event.target.value)}
              placeholder="e.g. ABNANL2A"
              className="h-11.75 w-full rounded-lg border border-[#cdcdcd] px-4 text-base font-medium text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-green-500/60"
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-green-500/60 px-9 py-3 text-base font-medium text-[#24272d] transition-all duration-200 ease-in-out hover:bg-[#F5F1FD] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-green-500/60 px-9 py-3 text-base font-medium text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
