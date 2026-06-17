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
import { useGetSessionsQuery } from "../../../../features/api/sessionApi";

const TABS = ["All", "Phone", "Video", "Chat"];
const PAGE_SIZE = 7;

export default function Session() {
  const pageRef = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetSessionsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    type: activeTab !== "All" ? activeTab.toUpperCase() : undefined,
  });

  const getTypeColor = useCallback((type) => {
    const t = type?.toUpperCase();
    if (t === "VIDEO") return "text-[#6E35AE]";
    if (t === "PHONE") return "text-green-500/60";
    if (t === "CHAT") return "text-[#0C0C0C]";
    return "text-[#0C0C0C]";
  }, []);

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

  const sessions = useMemo(() => data?.sessions || [], [data]);
  const totalResults = useMemo(() => data?.meta?.total || 0, [data]);
  const totalPages = useMemo(() => data?.meta?.totalPages || 1, [data]);

  const pageStart =
    totalResults === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalResults);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

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
          visibleRows={sessions}
          getTypeColor={getTypeColor}
        />

        <SessionMobileList
          visibleRows={sessions}
          getTypeColor={getTypeColor}
        />

        <SessionPagination
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
