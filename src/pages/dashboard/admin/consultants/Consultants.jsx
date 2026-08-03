import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FilterTabs from './components/FilterTabs';
import ConsultantsTable from './components/ConsultantsTable';
import Pagination from './components/Pagination';
import DeleteModal from './components/DeleteModal';
import ConsultantDetail from './components/ConsultantDetail';
import {
  useGetAllConsultantsQuery,
  useApproveConsultantMutation,
} from '../../../../features/api/consultantApi';
import { useUpdateUserStatusMutation, useDeleteUserMutation } from '../../../../features/api/userApi';
import { getApiErrorMessage } from '../../../../utils/apiErrorUtils';
import { mapBackendConsultant } from './utils/consultantMappers';

const PAGE_SIZE = 7;

function scrollConsultantPageToTop() {
  if (typeof document === 'undefined') return;
  const scrollContainer = document.querySelector('[data-lenis-prevent]');
  if (scrollContainer?.scrollTo) {
    scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

const AdminConsultants = () => {
  const [filter, setFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailConsultantId, setDetailConsultantId] = useState(null);
  const [page, setPage] = useState(1);
  const btnRefs = useRef({});

  const { data: apiResponse, isLoading, error, refetch } = useGetAllConsultantsQuery({
    includeUnapproved: true,
  });
  const [approveConsultant] = useApproveConsultantMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const consultants = useMemo(() => {
    if (!apiResponse?.consultants) return [];
    return apiResponse.consultants.map(mapBackendConsultant);
  }, [apiResponse]);

  useEffect(() => {
    const closeMenus = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return consultants;
    return consultants.filter((c) => c.status === filter);
  }, [consultants, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const detailConsultant = useMemo(
    () => (detailConsultantId ? consultants.find((c) => c.id === detailConsultantId) : null),
    [consultants, detailConsultantId],
  );

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
    setOpenMenuId(null);
    scrollConsultantPageToTop();
  };

  const handleStatusChange = useCallback(async (id, newStatus) => {
    const consultant = consultants.find((c) => c.id === id);
    if (!consultant) return;

    if (newStatus === 'Approved') {
      const result = await Swal.fire({
        title: 'Approve consultant?',
        text: `Approve ${consultant.name} as a platform consultant?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, approve',
      });
      if (!result.isConfirmed) {
        setOpenMenuId(null);
        return;
      }
    }

    try {
      if (newStatus === 'Approved') {
        await approveConsultant({ id, isApproved: true }).unwrap();
        if (consultant.status === 'Suspended') {
          await updateUserStatus({ id: consultant.userId, status: 'ACTIVE' }).unwrap();
        }
        toast.success(`${consultant.name} has been approved.`);
      } else if (newStatus === 'Pending') {
        await approveConsultant({ id, isApproved: false }).unwrap();
        if (consultant.status === 'Suspended') {
          await updateUserStatus({ id: consultant.userId, status: 'ACTIVE' }).unwrap();
        }
        toast.success(`${consultant.name} moved back to pending.`);
      } else if (newStatus === 'Suspended') {
        await updateUserStatus({ id: consultant.userId, status: 'SUSPENDED' }).unwrap();
        toast.success(`${consultant.name} has been suspended.`);
      }

      setOpenMenuId(null);
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update consultant status'), { duration: 6000 });
    }
  }, [consultants, approveConsultant, updateUserStatus, refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget?.userId) return;
    try {
      await deleteUser(deleteTarget.userId).unwrap();
      setDeleteTarget(null);
      setOpenMenuId(null);
      toast.success('Consultant removed.');
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete consultant'), { duration: 6000 });
    }
  }, [deleteTarget, deleteUser, refetch]);

  const handleVerificationReviewed = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-green-500/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-red-500">Failed to fetch consultants.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-green-500/60 px-5 py-2 text-white transition-opacity hover:opacity-90"
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
        onVerificationReviewed={handleVerificationReviewed}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1
          className="text-3xl font-semibold leading-tight text-[#050609] md:text-4xl"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          Consultants
        </h1>
        <p className="text-base text-[#464646]">Overview and manage platform consultants.</p>
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
