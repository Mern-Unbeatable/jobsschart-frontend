import React, { useState, useRef, useCallback, useEffect } from "react";
import SessionsMetrics from "./components/SessionsMetrics";
import FilterTabs from "./components/FilterTabs";
import SessionsTable from "./components/SessionsTable";
import SessionDetailsModal from "./components/SessionDetailsModal";
import { useGetConsultantSessionsQuery } from "../../../../features/api/sessionApi";

const MODAL_CLOSE_ANIMATION_MS = 280;
const PAGE_SIZE = 10;

const ConsultantSessionsHistory = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const closeTimerRef = useRef(null);

  const { data, isLoading } = useGetConsultantSessionsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    type: activeFilter === "All" ? undefined : activeFilter.toUpperCase(),
  });

  const closeModal = useCallback(() => {
    setIsModalClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setSelectedSession(null);
      setIsModalClosing(false);
    }, MODAL_CLOSE_ANIMATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const sessions = data?.sessions || [];
  const summary = data?.summary || {};
  const totalSessions = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  const pageStart = totalSessions === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalSessions);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="dashboard-page-title">Sessions History</h1>
        <p className="dashboard-page-subtitle">
          Track and review your past consultation sessions.
        </p>
      </div>

      {/* Metric cards */}
      <SessionsMetrics summaryData={summary} />

      {/* Filter tabs */}
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Table */}
      <SessionsTable
        filtered={sessions}
        totalSessions={totalSessions}
        currentPage={currentPage}
        totalPages={totalPages}
        pageStart={pageStart}
        pageEnd={pageEnd}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        onViewDetails={setSelectedSession}
      />

      {/* Session Details Modal */}
      <SessionDetailsModal
        isOpen={!!selectedSession}
        session={selectedSession}
        isClosing={isModalClosing}
        onClose={closeModal}
      />
    </section>
  );
};

export default ConsultantSessionsHistory;
