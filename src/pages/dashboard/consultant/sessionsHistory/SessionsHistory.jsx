import React, { useState, useRef, useCallback, useEffect } from "react";
import SessionsMetrics from "./components/SessionsMetrics";
import FilterTabs from "./components/FilterTabs";
import SessionsTable from "./components/SessionsTable";
import SessionDetailsModal from "./components/SessionDetailsModal";

const MODAL_CLOSE_ANIMATION_MS = 280;

const SESSIONS = [
  {
    id: 1,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Video",
    duration: "45 mins",
    earnings: "45.00",
    date: "Apr 24, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "I had a really great consultation experience. The session was very insightful and helpful. The consultant listened carefully, understood my situation, and provided clear guidance that I can actually apply in my life. The conversation felt comfortable and genuine, and I truly appreciate the time and attention given during the session.",
  },
  {
    id: 2,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Phone",
    duration: "30 mins",
    earnings: "30.00",
    date: "Apr 23, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "Great phone consultation. The consultant was very professional and attentive throughout the session. I received practical advice that I could apply immediately.",
  },
  {
    id: 3,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Video",
    duration: "60 mins",
    earnings: "60.00",
    date: "Apr 22, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "Excellent video session. Very thorough and detailed discussion. The consultant took time to explain everything clearly and made sure all my questions were answered.",
  },
  {
    id: 4,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Chat",
    duration: "25 mins",
    earnings: "25.00",
    date: "Apr 21, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "The chat session was very convenient. Quick and to the point with helpful suggestions. Would definitely book again for follow-up questions.",
  },
  {
    id: 5,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Video",
    duration: "50 mins",
    earnings: "50.00",
    date: "Apr 20, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "Amazing session. The consultant was well prepared, knowledgeable and supportive. I left the session feeling confident and with a clear action plan.",
  },
  {
    id: 6,
    name: "John Doe",
    email: "james.h@email.com",
    type: "Video",
    duration: "50 mins",
    earnings: "50.00",
    date: "Apr 20, 2024",
    rating: 5,
    status: "Completed",
    consultantName: "Dr. Sarah Johnson",
    reviewText:
      "Wonderful consultation experience. The session was engaging and productive. I highly recommend booking with this consultant for insightful and practical guidance.",
  },
];

const ConsultantSessionsHistory = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const closeTimerRef = useRef(null);

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

  const filtered =
    activeFilter === "All"
      ? SESSIONS
      : SESSIONS.filter((s) => s.type === activeFilter);

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
      <SessionsMetrics />

      {/* Filter tabs */}
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Table */}
      <SessionsTable
        filtered={filtered}
        totalSessions={SESSIONS.length}
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
