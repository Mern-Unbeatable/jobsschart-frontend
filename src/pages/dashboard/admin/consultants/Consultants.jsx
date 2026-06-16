import React, { useState, useEffect, useRef, useCallback } from "react";
import FilterTabs from "./components/FilterTabs";
import ConsultantsTable from "./components/ConsultantsTable";
import Pagination from "./components/Pagination";
import DeleteModal from "./components/DeleteModal";
import ConsultantDetail from "./components/ConsultantDetail";

const INITIAL_CONSULTANTS = [
  {
    id: 1,
    name: "Eleanor Pena",
    title: "Professional Consultant",
    email: "eleanor@pixelexpertise.com",
    phone: "+1 0335-000-7132",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    category: "Psychic & Medium",
    status: "Approved",
    avatar:
      "https://ui-avatars.com/api/?name=Eleanor+Pena&background=E2AB0B&color=fff&size=80",
    about:
      "Hello! I am Eleanor, a professional consultant with extensive experience in helping individuals navigate their personal and professional journeys. My approach combines empathy, expertise, and practical strategies to support my clients in achieving their goals.",
    experience: { years: "3 Years", role: "Professional consulting" },
    languages: ["Bangla", "English", "Dutch"],
    location: { place: "Hawaii, USA", note: "Available for remote sessions" },
    expertise: [
      "Consultant",
      "Relation Articles",
      "Career Guide",
      "Personal Growth",
      "Emotional Support",
    ],
    availability: [
      { days: "Monday - Friday", hours: "8:00 AM - 3:00 PM" },
      { days: "Saturday", hours: "10:00 AM - 2:00 PM" },
    ],
  },
  {
    id: 2,
    name: "Esther Howard",
    title: "Tarot Specialist",
    email: "esther@gmail.com",
    phone: "+880 1934-567890",
    address: "450 Maple Ave, Portland, Oregon 97201",
    category: "Tarot Reader",
    status: "Pending",
    avatar:
      "https://ui-avatars.com/api/?name=Esther+Howard&background=6366f1&color=fff&size=80",
    about:
      "Experienced Tarot reader with over 5 years of practice, specializing in life guidance and spiritual clarity.",
    experience: { years: "5 Years", role: "Tarot & spiritual guidance" },
    languages: ["English", "Spanish"],
    location: { place: "Portland, USA", note: "In-person and remote" },
    expertise: ["Tarot", "Spiritual Guidance", "Life Coaching"],
    availability: [
      { days: "Tuesday - Thursday", hours: "9:00 AM - 5:00 PM" },
      { days: "Sunday", hours: "12:00 PM - 4:00 PM" },
    ],
  },
  {
    id: 3,
    name: "Annette Black",
    title: "Tarot Reader & Healer",
    email: "annette@gmail.com",
    phone: "+880 1934-567890",
    address: "23 Oak Street, Austin, Texas 78701",
    category: "Tarot Reader",
    status: "Suspended",
    avatar:
      "https://ui-avatars.com/api/?name=Annette+Black&background=ef4444&color=fff&size=80",
    about:
      "Certified tarot reader and energy healer dedicated to bringing clarity and healing to clients.",
    experience: { years: "2 Years", role: "Energy healing & tarot" },
    languages: ["English", "French"],
    location: { place: "Austin, USA", note: "Remote only" },
    expertise: ["Tarot", "Energy Healing"],
    availability: [{ days: "Monday - Wednesday", hours: "10:00 AM - 4:00 PM" }],
  },
  {
    id: 4,
    name: "Jenny Wilson",
    title: "Psychic Advisor",
    email: "jenny@gmail.com",
    phone: "+880 1934-567890",
    address: "88 Pine Road, Seattle, Washington 98101",
    category: "Tarot Reader",
    status: "Approved",
    avatar:
      "https://ui-avatars.com/api/?name=Jenny+Wilson&background=10b981&color=fff&size=80",
    about:
      "Intuitive psychic advisor helping clients gain clarity in relationships, career, and life purpose.",
    experience: { years: "7 Years", role: "Psychic readings & guidance" },
    languages: ["English", "Dutch"],
    location: { place: "Seattle, USA", note: "Available for remote sessions" },
    expertise: ["Psychic Readings", "Relationship Guidance", "Career Coaching"],
    availability: [
      { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "10:00 AM - 3:00 PM" },
    ],
  },
  {
    id: 5,
    name: "Darlene Robertson",
    title: "Holistic Consultant",
    email: "darlene@gmail.com",
    phone: "+880 1934-567890",
    address: "312 Elm Street, Chicago, Illinois 60601",
    category: "Tarot Reader",
    status: "Suspended",
    avatar:
      "https://ui-avatars.com/api/?name=Darlene+Robertson&background=f59e0b&color=fff&size=80",
    about:
      "Holistic consultant bridging spiritual insights with practical life solutions.",
    experience: { years: "4 Years", role: "Holistic life consulting" },
    languages: ["English"],
    location: { place: "Chicago, USA", note: "In-person preferred" },
    expertise: ["Holistic Healing", "Tarot", "Meditation"],
    availability: [{ days: "Wednesday - Friday", hours: "11:00 AM - 5:00 PM" }],
  },
  {
    id: 6,
    name: "Guy Hawkins",
    title: "Spiritual Life Coach",
    email: "guy@gmail.com",
    phone: "+880 1934-567890",
    address: "99 Birch Lane, Denver, Colorado 80201",
    category: "Tarot Reader",
    status: "Pending",
    avatar:
      "https://ui-avatars.com/api/?name=Guy+Hawkins&background=8b5cf6&color=fff&size=80",
    about:
      "Certified life coach and tarot reader offering practical spiritual support for modern challenges.",
    experience: { years: "6 Years", role: "Spiritual life coaching" },
    languages: ["English", "Bangla"],
    location: { place: "Denver, USA", note: "Remote sessions available" },
    expertise: ["Life Coaching", "Tarot", "Stress Management"],
    availability: [
      { days: "Monday, Wednesday, Friday", hours: "9:00 AM - 4:00 PM" },
    ],
  },
  {
    id: 7,
    name: "Robert Fox",
    title: "Astrology Expert",
    email: "robert@gmail.com",
    phone: "+880 1934-567890",
    address: "14 Sunset Blvd, Los Angeles, CA 90001",
    category: "Astrologer",
    status: "Approved",
    avatar:
      "https://ui-avatars.com/api/?name=Robert+Fox&background=0ea5e9&color=fff&size=80",
    about:
      "Professional astrologer offering in-depth natal chart readings and predictive astrology consultations.",
    experience: { years: "10 Years", role: "Astrology & chart reading" },
    languages: ["English", "Spanish", "Dutch"],
    location: { place: "Los Angeles, USA", note: "Remote and in-person" },
    expertise: [
      "Astrology",
      "Natal Charts",
      "Predictive Astrology",
      "Transit Readings",
    ],
    availability: [
      { days: "Monday - Thursday", hours: "10:00 AM - 7:00 PM" },
      { days: "Saturday", hours: "9:00 AM - 1:00 PM" },
    ],
  },
];

const PAGE_SIZE = 7;

function scrollConsultantPageToTop() {
  if (typeof document === "undefined") return;

  const scrollContainer = document.querySelector("[data-lenis-prevent]");
  if (scrollContainer?.scrollTo) {
    scrollContainer.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

const AdminConsultants = () => {
  const [consultants, setConsultants] = useState(INITIAL_CONSULTANTS);
  const [filter, setFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailConsultant, setDetailConsultant] = useState(null);
  const [page, setPage] = useState(1);
  const btnRefs = useRef({});

  useEffect(() => {
    const h = () => setOpenMenuId(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const filtered =
    filter === "All"
      ? consultants
      : consultants.filter((c) => c.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
    setOpenMenuId(null);
    scrollConsultantPageToTop();
  };

  const handleStatusChange = useCallback((id, status) => {
    setConsultants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    setOpenMenuId(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setConsultants((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    setOpenMenuId(null);
  }, [deleteTarget]);

  if (detailConsultant) {
    return (
      <ConsultantDetail
        consultant={detailConsultant}
        onBack={() => setDetailConsultant(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl md:text-4xl font-semibold text-[#050609] leading-tight"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          Consultant
        </h1>
        <p className="text-base text-[#464646]">
          Overview &amp; manage your Consultant.
        </p>
      </div>

      <FilterTabs active={filter} onChange={handleFilterChange} />

      <ConsultantsTable
        paginated={paginated}
        btnRefs={btnRefs}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        setDetailConsultant={setDetailConsultant}
        handleStatusChange={handleStatusChange}
        setDeleteTarget={setDeleteTarget}
      >
        <Pagination
          page={page}
          totalResults={filtered.length}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </ConsultantsTable>

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminConsultants;
