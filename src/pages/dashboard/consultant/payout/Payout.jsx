import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PayoutSummary from "./components/PayoutSummary";
import PaymentHistoryTable from "./components/PaymentHistoryTable";
import WithdrawModal from "./components/WithdrawModal";
import { useGetPayoutBalanceQuery, useGetMyPayoutsQuery, useRequestPayoutMutation } from "../../../../features/api/payoutApi";
import { useGetMyConsultantProfileQuery } from "../../../../features/api/consultantApi";
import { getApiErrorMessage, validateIban } from "../../../../utils/apiErrorUtils";

const MODAL_CLOSE_ANIMATION_MS = 280;
const PAGE_SIZE = 10;

const ConsultantPayout = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);

  const { data: balanceData, isLoading: isBalanceLoading } = useGetPayoutBalanceQuery();
  const { data: profileData } = useGetMyConsultantProfileQuery();
  const profile = profileData?.profile || profileData;

  const { data: payoutsData, isLoading: isPayoutsLoading } = useGetMyPayoutsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const [requestPayout, { isLoading: isSubmitting }] = useRequestPayoutMutation();

  const payouts = payoutsData?.payouts || [];
  const totalResults = payoutsData?.meta?.total || 0;
  const totalPages = payoutsData?.meta?.totalPages || 1;

  const pageStart = totalResults === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalResults);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

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

  const handleSubmitWithdrawal = useCallback(async (formData) => {
    const amountVal = parseFloat(formData.amount);
    
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const withdrawableBalance = balanceData?.withdrawableBalance ?? 0;
    const minimumPayout = balanceData?.minimumPayout ?? 10;

    if (amountVal > withdrawableBalance) {
      toast.error(`Requested amount exceeds withdrawable balance of €${withdrawableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }

    if (amountVal < minimumPayout) {
      toast.error(`Minimum withdrawal amount is €${minimumPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }

    if (!formData.businessName) {
      toast.error("Please enter the business or organisation name.");
      return;
    }

    if (!formData.routingNumber?.trim()) {
      toast.error("Please enter your IBAN (bank account number).");
      return;
    }

    const ibanError = validateIban(formData.routingNumber);
    if (ibanError) {
      toast.error(ibanError, { duration: 6000 });
      return;
    }

    const toastId = toast.loading("Submitting withdrawal request...");
    try {
      await requestPayout({
        amount: amountVal,
        organisationName: formData.businessName,
        routingNumber: formData.routingNumber.replace(/\s/g, '').toUpperCase(),
        accountNumber: formData.accountNumber?.replace(/\s/g, '') || '',
      }).unwrap();
      toast.success("Withdrawal request submitted successfully.", { id: toastId });
      handleCloseModal();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to submit withdrawal request.");
      toast.error(message, { id: toastId, duration: 7000 });
    }
  }, [balanceData, requestPayout, handleCloseModal]);

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

  if (isBalanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="space-y-2">
          <h1 className="dashboard-page-title">Earnings & Payment</h1>
          <p className="text-lg text-[#515151]">
            Manage your earnings and payment information
          </p>
        </div>
        <PayoutSummary onWithdrawClick={handleOpenModal} balanceData={balanceData} />
        <PaymentHistoryTable
          payouts={payouts}
          isLoading={isPayoutsLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageStart={pageStart}
          pageEnd={pageEnd}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
      <WithdrawModal
        isOpen={isModalOpen}
        isClosing={isModalClosing}
        onClose={handleCloseModal}
        onSubmit={handleSubmitWithdrawal}
        isSubmitting={isSubmitting}
        defaultIban={profile?.businessBankAccount || ""}
        defaultBusinessName={profile?.user?.name || ""}
      />
    </>
  );
});

ConsultantPayout.displayName = "ConsultantPayout";

export default ConsultantPayout;
