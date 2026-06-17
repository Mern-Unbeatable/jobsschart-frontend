import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
import SessionHeader from "./components/SessionHeader";
import SessionFilterTabs from "./components/SessionFilterTabs";
import SessionTable from "./components/SessionTable";
import SessionMobileList from "./components/SessionMobileList";
import SessionPagination from "./components/SessionPagination";

const TABS = ["All", "Phone", "Video", "Chat"];
const PAGE_SIZE = 7;

const SESSION_ROWS = [
  {
    id: 1,
    consultantName: "Theresa Webb",
    clientName: "John Doe",
    type: "Video",
    duration: "45 mins",
    earnings: "$45.00",
    date: "Apr 24, 2024",
    status: "Completed",
  },
  {
    id: 2,
    consultantName: "Guy Hawkins",
    clientName: "John Doe",
    type: "Phone",
    duration: "30 mins",
    earnings: "$30.00",
    date: "Apr 23, 2024",
    status: "Completed",
  },
  {
    id: 3,
    consultantName: "Robert Fox",
    clientName: "John Doe",
    type: "Video",
    duration: "60 mins",
    earnings: "$60.00",
    date: "Apr 22, 2024",
    status: "Completed",
  },
  {
    id: 4,
    consultantName: "Bessie Cooper",
    clientName: "John Doe",
    type: "Chat",
    duration: "25 mins",
    earnings: "$25.00",
    date: "Apr 21, 2024",
    status: "Completed",
  },
  {
    id: 5,
    consultantName: "Devon Lane",
    clientName: "John Doe",
    type: "Video",
    duration: "50 mins",
    earnings: "$50.00",
    date: "Apr 20, 2024",
    status: "Completed",
  },
  {
    id: 6,
    consultantName: "Devon Lane",
    clientName: "John Doe",
    type: "Phone",
    duration: "50 mins",
    earnings: "$50.00",
    date: "Apr 20, 2024",
    status: "Completed",
  },
  {
    id: 7,
    consultantName: "Aubrey Green",
    clientName: "John Doe",
    type: "Video",
    duration: "40 mins",
    earnings: "$40.00",
    date: "Apr 19, 2024",
    status: "Completed",
  },
];

export default function Session() {
  const pageRef = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const getTypeColor = useCallback((type) => {
    if (type === "Video") return "text-[#6E35AE]";
    if (type === "Phone") return "text-green-500/60";
    if (type === "Chat") return "text-[#0C0C0C]";
    return "text-[#0C0C0C]";
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const revealBlocks = pageRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      revealBlocks,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.08 },
    );
  }, []);

  const filteredRows = useMemo(() => {
    if (activeTab === "All") return SESSION_ROWS;
    return SESSION_ROWS.filter((row) => row.type === activeTab);
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageStart =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, filteredRows.length);
  const visibleRows = filteredRows.slice(pageStart - 1, pageEnd);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return (
    <div ref={pageRef} className="flex flex-col gap-8">
      <SessionHeader />

      <SessionFilterTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      <div
        data-reveal
        className="bg-white rounded-xl border border-black/10 overflow-hidden"
      >
        <SessionTable
          visibleRows={visibleRows}
          getTypeColor={getTypeColor}
        />

        <SessionMobileList
          visibleRows={visibleRows}
          getTypeColor={getTypeColor}
        />

        <SessionPagination
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalResults={filteredRows.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
