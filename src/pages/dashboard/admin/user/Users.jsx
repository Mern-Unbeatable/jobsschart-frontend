import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import FilterTabs from "./components/FilterTabs";
import UsersTable from "./components/UsersTable";
import Pagination from "./components/Pagination";
import DeleteModal from "./components/DeleteModal";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from "../../../../features/api/userApi";
import Swal from "sweetalert2";

const PAGE_SIZE = 6;

const mapBackendUser = (u) => {
  const status = u.status === "ACTIVE" ? "Active" : "Suspended";
  return {
    id: u.id,
    name: u.name || "User",
    email: u.email || "N/A",
    phone: u.phone || "N/A",
    status,
    raw: u,
  };
};

const AdminUsers = () => {
  const [filter, setFilter] = useState("Active");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  const btnRefs = useRef({});

  const { data: apiResponse, isLoading, error } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = useMemo(() => {
    if (!apiResponse?.users) return [];
    return apiResponse.users.map(mapBackendUser);
  }, [apiResponse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => u.status === filter);
  }, [users, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      const user = users.find((u) => u.id === id);
      if (!user) return;

      const actionText = newStatus === "Active" ? "activate" : "suspend";
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${actionText} the user ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: newStatus === "Active" ? "#22c55e" : "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, ${actionText}!`,
      });

      if (!result.isConfirmed) {
        setOpenMenuId(null);
        return;
      }

      try {
        const apiStatus = newStatus === "Active" ? "ACTIVE" : "SUSPENDED";
        await updateUserStatus({ id, status: apiStatus }).unwrap();
        setOpenMenuId(null);
      } catch (err) {
        console.error("Failed to update user status:", err);
      }
    },
    [users, updateUserStatus],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  }, [deleteTarget, deleteUser]);

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
        <p className="text-red-500 font-semibold text-lg">
          Failed to fetch users.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-green-500/60 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1
          className="text-3xl md:text-4xl font-semibold text-[#050609] leading-tight"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          User
        </h1>
        <p className="text-base text-[#464646]">
          Overview &amp; manage your User.
        </p>
      </div>

      {/* Filter tabs */}
      <FilterTabs active={filter} onChange={handleFilterChange} />

      {/* Table card */}
      <UsersTable
        paginated={paginated}
        page={page}
        pageSize={PAGE_SIZE}
        btnRefs={btnRefs}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
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
      </UsersTable>

      {/* Delete confirmation modal */}
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

export default AdminUsers;
