import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
import PayoutHeader from "./components/PayoutHeader";
import ActionsDropdown from "./components/ActionsDropdown";
import PayoutTable from "./components/PayoutTable";
import PayoutMobileList from "./components/PayoutMobileList";
import PayoutPagination from "./components/PayoutPagination";

const PAGE_SIZE = 7;

const INITIAL_PAYOUTS = [
  {
    id: 1,
    name: "Kathryn Murphy",
    email: "deanna.curtis@example.com",
    phone: "(208) 555-0112",
    accountNumber: "4587 2291 6034",
    status: "Completed",
  },
  {
    id: 2,
    name: "Savannah Nguyen",
    email: "jackson.graham@example.com",
    phone: "(405) 555-0128",
    accountNumber: "7312 8845 1096",
    status: "Pending",
  },
  {
    id: 3,
    name: "Cameron Williamson",
    email: "nathan.roberts@example.com",
    phone: "(229) 555-0109",
    accountNumber: "6021 4478 3350",
    status: "Completed",
  },
  {
    id: 4,
    name: "Cameron Williamson",
    email: "nathan.roberts@example.com",
    phone: "(229) 555-0109",
    accountNumber: "9140 2267 5813",
    status: "Completed",
  },
  {
    id: 5,
    name: "Cameron Williamson",
    email: "nathan.roberts@example.com",
    phone: "(229) 555-0109",
    accountNumber: "3874 1105 7629",
    status: "Completed",
  },
  {
    id: 6,
    name: "Cameron Williamson",
    email: "nathan.roberts@example.com",
    phone: "(229) 555-0109",
    accountNumber: "2459 6681 4307",
    status: "Completed",
  },
  {
    id: 7,
    name: "Cameron Williamson",
    email: "nathan.roberts@example.com",
    phone: "(229) 555-0109",
    accountNumber: "5568 9024 1742",
    status: "Completed",
  },
];

const STATUS_STYLES = {
  Completed: "bg-[#EEFFF1] text-[#05BC27]",
  Pending: "bg-[#FFFBEE] text-green-500/60",
};

export default function Payout() {
  const pageRef = useRef(null);
  const actionAnchorRefs = useRef({});

  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const activePayoutId =
    typeof openDropdownId === "string"
      ? Number(openDropdownId.replace("m-", ""))
      : openDropdownId;

  useEffect(() => {
    if (!pageRef.current) return;
    const revealBlocks = pageRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      revealBlocks,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.08 },
    );
  }, []);

  const totalPages = Math.max(1, Math.ceil(payouts.length / PAGE_SIZE));
  const pageStart =
    payouts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, payouts.length);

  const visiblePayouts = useMemo(
    () => payouts.slice(pageStart - 1, pageEnd),
    [payouts, pageStart, pageEnd],
  );

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

  const handleStatusChange = useCallback((id, status) => {
    setPayouts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    setOpenDropdownId(null);
  }, []);

  return (
    <div ref={pageRef} className="flex flex-col gap-8">
      <PayoutHeader />

      <div
        data-reveal
        className="bg-white rounded-xl border border-black/10 overflow-hidden"
      >
        <PayoutTable
          visiblePayouts={visiblePayouts}
          statusStyles={STATUS_STYLES}
          actionAnchorRefs={actionAnchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PayoutMobileList
          visiblePayouts={visiblePayouts}
          statusStyles={STATUS_STYLES}
          actionAnchorRefs={actionAnchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PayoutPagination
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalResults={payouts.length}
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
          onMarkComplete={() => handleStatusChange(activePayoutId, "Completed")}
          onMarkPending={() => handleStatusChange(activePayoutId, "Pending")}
        />
      )}
    </div>
  );
}
