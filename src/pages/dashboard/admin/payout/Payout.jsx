import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PayoutHeader from "./components/PayoutHeader";
import ActionsDropdown from "./components/ActionsDropdown";
import PayoutTable from "./components/PayoutTable";
import PayoutMobileList from "./components/PayoutMobileList";
import PayoutPagination from "./components/PayoutPagination";
import {
  useGetPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
} from "../../../../features/api/payoutApi";

const PAGE_SIZE = 7;

const STATUS_STYLES = {
  COMPLETED: "bg-[#EEFFF1] text-[#05BC27]",
  Completed: "bg-[#EEFFF1] text-[#05BC27]",
  APPROVED: "bg-[#EEFFF1] text-[#05BC27]",
  Approved: "bg-[#EEFFF1] text-[#05BC27]",
  REJECTED: "bg-red-50 text-red-600",
  Rejected: "bg-red-50 text-red-600",
  PENDING: "bg-[#FFFBEE] text-green-500/60",
  Pending: "bg-[#FFFBEE] text-green-500/60",
};

export default function Payout() {
  const pageRef = useRef(null);
  const actionAnchorRefs = useRef({});

  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const { data, isLoading } = useGetPayoutsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const [approvePayout] = useApprovePayoutMutation();
  const [rejectPayout] = useRejectPayoutMutation();

  const payouts = useMemo(() => data?.payouts || [], [data]);
  const totalResults = useMemo(() => data?.meta?.total || 0, [data]);
  const totalPages = useMemo(() => data?.meta?.totalPages || 1, [data]);

  const activePayoutId =
    typeof openDropdownId === "string"
      ? openDropdownId.replace("m-", "")
      : openDropdownId;

  useEffect(() => {
    if (!pageRef.current) return;
    const revealBlocks = pageRef.current.querySelectorAll("[data-reveal]");
    if (revealBlocks.length > 0) {
      gsap.fromTo(
        revealBlocks,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.08 },
      );
    }
  }, [isLoading]);

  const pageStart =
    totalResults === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalResults);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleOpenDropdown = useCallback((id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  const handleApprove = useCallback(async (id) => {
    setOpenDropdownId(null);
    const { value: adminNote, isDismissed } = await Swal.fire({
      title: 'Approve Payout',
      input: 'text',
      inputLabel: 'Admin Note (Optional)',
      inputPlaceholder: 'Enter admin note here...',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#10B981',
    });

    if (isDismissed) return;

    try {
      const loadingToast = toast.loading("Approving payout...");
      await approvePayout({ id, adminNote }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Payout approved successfully");
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to approve payout");
    }
  }, [approvePayout]);

  const handleReject = useCallback(async (id) => {
    setOpenDropdownId(null);
    const { value: rejectReason, isDismissed } = await Swal.fire({
      title: 'Reject Payout',
      input: 'text',
      inputLabel: 'Reject Reason',
      inputPlaceholder: 'Enter reject reason here...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#EF4444',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a rejection reason!';
        }
      }
    });

    if (isDismissed) return;

    try {
      const loadingToast = toast.loading("Rejecting payout...");
      await rejectPayout({ id, rejectReason }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Payout rejected successfully");
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to reject payout");
    }
  }, [rejectPayout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="flex flex-col gap-8">
      <PayoutHeader />

      <div
        data-reveal
        className="bg-white rounded-xl border border-black/10 overflow-hidden"
      >
        <PayoutTable
          visiblePayouts={payouts}
          statusStyles={STATUS_STYLES}
          actionAnchorRefs={actionAnchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PayoutMobileList
          visiblePayouts={payouts}
          statusStyles={STATUS_STYLES}
          actionAnchorRefs={actionAnchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PayoutPagination
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {openDropdownId !== null && (
        <ActionsDropdown
          anchorEl={actionAnchorRefs.current[openDropdownId]}
          onClose={handleCloseDropdown}
          onApprove={() => handleApprove(activePayoutId)}
          onReject={() => handleReject(activePayoutId)}
        />
      )}
    </div>
  );
}
