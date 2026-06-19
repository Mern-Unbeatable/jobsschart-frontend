import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PayoutSummary from "./components/PayoutSummary";
import PaymentHistoryTable from "./components/PaymentHistoryTable";
import WithdrawModal from "./components/WithdrawModal";

const MODAL_CLOSE_ANIMATION_MS = 280;

const ConsultantPayout = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const handleOpenModal = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsModalClosing(false);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
    }, MODAL_CLOSE_ANIMATION_MS);
  }, []);

  const handleSubmitWithdrawal = useCallback(() => {
    toast.success("Withdrawal request submitted successfully.");
    handleCloseModal();
  }, [handleCloseModal]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isModalOpen) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleCloseModal]);

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-3">
          <h1 className="dashboard-page-title">Earnings & Payment</h1>
          <p className="text-base text-[#515151]">
            Manage your earnings and payment information
          </p>
        </div>

        <PayoutSummary onWithdrawClick={handleOpenModal} />

        <PaymentHistoryTable />
      </div>

      <WithdrawModal
        isOpen={isModalOpen}
        isClosing={isModalClosing}
        onClose={handleCloseModal}
        onSubmit={handleSubmitWithdrawal}
      />
    </>
  );
});

ConsultantPayout.displayName = "ConsultantPayout";

export default ConsultantPayout;
