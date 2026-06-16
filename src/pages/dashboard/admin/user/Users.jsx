import React, { useState, useEffect, useRef, useCallback } from "react";
import FilterTabs from "./components/FilterTabs";
import UsersTable from "./components/UsersTable";
import Pagination from "./components/Pagination";
import DeleteModal from "./components/DeleteModal";

const PAGE_SIZE = 6;

const INITIAL_USERS = [
  {
    id: 1,
    name: "Eleanor Pena",
    email: "aliza@gmail.com",
    phone: "+880 1712-345678",
    status: "Active",
  },
  {
    id: 2,
    name: "Esther Howard",
    email: "liyana@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 3,
    name: "Annette Black",
    email: "liyana@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 4,
    name: "Jenny Wilson",
    email: "liyana@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 5,
    name: "Darlene Robertson",
    email: "liyana@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 6,
    name: "Guy Hawkins",
    email: "liyana@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 7,
    name: "Robert Fox",
    email: "robert@gmail.com",
    phone: "+880 1934-567890",
    status: "Suspended",
  },
  {
    id: 8,
    name: "Cameron Williamson",
    email: "cameron@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
  {
    id: 9,
    name: "Brooklyn Simmons",
    email: "brook@gmail.com",
    phone: "+880 1934-567890",
    status: "Suspended",
  },
  {
    id: 10,
    name: "Kristin Watson",
    email: "kristin@gmail.com",
    phone: "+880 1934-567890",
    status: "Active",
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [filter, setFilter] = useState("Active");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  const btnRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const filtered = users.filter((u) => u.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  const handleStatusChange = useCallback((id, status) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setOpenMenuId(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    setOpenMenuId(null);
  }, [deleteTarget]);

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
