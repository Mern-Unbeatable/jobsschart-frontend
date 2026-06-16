import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import FilterTabs from "./components/FilterTabs";
import ConsultantsTable from "./components/ConsultantsTable";
import Pagination from "./components/Pagination";
import DeleteModal from "./components/DeleteModal";
import ConsultantDetail from "./components/ConsultantDetail";
import { useGetAllConsultantsQuery, useApproveConsultantMutation } from "../../../../features/api/consultantApi";
import { useUpdateUserStatusMutation, useDeleteUserMutation } from "../../../../features/api/userApi";

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

const mapBackendConsultant = (c) => {
  const specialization = Array.isArray(c.specialization) ? c.specialization : [];
  
  // Status mapping
  let status = "Pending";
  if (c.user?.status === "SUSPENDED" || c.user?.status === "Suspended") {
    status = "Suspended";
  } else if (c.isApproved) {
    status = "Approved";
  }

  const place = c.user?.location || "N/A";
  
  return {
    id: c.id,
    userId: c.userId || c.user?.id,
    name: c.user?.name || "Consultant",
    title: c.user?.bio || c.bio || "Professional Consultant",
    email: c.user?.email || "N/A",
    phone: c.user?.phone || "N/A",
    address: c.user?.location || "N/A",
    category: c.category || specialization[0] || "Consultant",
    status,
    avatar: c.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || "C")}&background=E2AB0B&color=fff`,
    about: c.bio || "No description available.",
    experience: { years: "N/A", role: "Consulting" },
    languages: ["English"],
    location: { place, note: "Remote and in-person" },
    expertise: specialization,
    availability: [
      { days: "Monday - Friday", hours: "9:00 AM - 5:00 PM" }
    ],
    raw: c
  };
};

const AdminConsultants = () => {
  const [filter, setFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailConsultantId, setDetailConsultantId] = useState(null);
  const [page, setPage] = useState(1);
  const btnRefs = useRef({});

  const { data: apiResponse, isLoading, error } = useGetAllConsultantsQuery();
  const [approveConsultant] = useApproveConsultantMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const consultants = useMemo(() => {
    if (!apiResponse?.consultants) return [];
    return apiResponse.consultants.map(mapBackendConsultant);
  }, [apiResponse]);

  useEffect(() => {
    const h = () => setOpenMenuId(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const filtered = useMemo(() => {
    return filter === "All"
      ? consultants
      : consultants.filter((c) => c.status === filter);
  }, [consultants, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
    setOpenMenuId(null);
    scrollConsultantPageToTop();
  };

  const handleStatusChange = useCallback(async (id, newStatus) => {
    const consultant = consultants.find((c) => c.id === id);
    if (!consultant) return;

    try {
      if (newStatus === "Approved") {
        await approveConsultant({ id, isApproved: true }).unwrap();
        if (consultant.status === "Suspended") {
          await updateUserStatus({ id: consultant.userId, status: "ACTIVE" }).unwrap();
        }
      } else if (newStatus === "Pending") {
        await approveConsultant({ id, isApproved: false }).unwrap();
        if (consultant.status === "Suspended") {
          await updateUserStatus({ id: consultant.userId, status: "ACTIVE" }).unwrap();
        }
      } else if (newStatus === "Suspended") {
        await updateUserStatus({ id: consultant.userId, status: "SUSPENDED" }).unwrap();
      }
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }, [consultants, approveConsultant, updateUserStatus]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.userId).unwrap();
      setDeleteTarget(null);
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to delete consultant user:", err);
    }
  }, [deleteTarget, deleteUser]);

  const detailConsultant = useMemo(() => {
    return detailConsultantId ? consultants.find((c) => c.id === detailConsultantId) : null;
  }, [consultants, detailConsultantId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500/60"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500 font-semibold text-lg">Failed to fetch consultants.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-green-500/60 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (detailConsultant) {
    return (
      <ConsultantDetail
        consultant={detailConsultant}
        onBack={() => setDetailConsultantId(null)}
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
        setDetailConsultant={(c) => setDetailConsultantId(c.id)}
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
