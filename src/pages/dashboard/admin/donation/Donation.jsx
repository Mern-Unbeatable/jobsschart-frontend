import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Euro,
  Users,
  Building2,
} from 'lucide-react';
import DonationDetailModal from './components/DonationDetailModal';
import ActionsDropdown from './components/ActionsDropdown';
import Pagination from './components/Pagination';
import DonationTable from './components/DonationTable';
import StatCards from './components/StatCards';
import { gsap } from 'gsap';
import { useGetDonationsQuery, useDeleteDonationMutation } from '../../../../features/api/donationApi';
import toast from 'react-hot-toast';

const PAGE_SIZE = 6;

const DONOR_TYPE_STYLES = {
  Individual: 'text-[#6E35AE]',
  Business: 'text-[#E2AB0B]',
};

const TABLE_COLS = [
  { label: 'Name', width: 'flex-1' },
  { label: 'Email', width: 'flex-1' },
  { label: 'Phone Number', width: 'flex-1' },
  { label: 'Donor Type', width: 'flex-1' },
  { label: 'Amount (€)', width: 'flex-1' },
  { label: 'Date', width: 'flex-1' },
  { label: 'Actions', width: 'w-20' },
];

const AdminDonation = () => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [detailDonor, setDetailDonor] = useState(null);
  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  const { data: donationsData, isLoading } = useGetDonationsQuery({ page, limit: PAGE_SIZE });
  const { data: allDonationsData } = useGetDonationsQuery({ limit: 10000 });
  const [deleteDonation] = useDeleteDonationMutation();

  useEffect(() => {
    if (!pageRef.current || isLoading) return;
    gsap.fromTo(
      pageRef.current.querySelectorAll('[data-reveal]'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.07 },
    );
  }, [isLoading]);

  // Dynamic stats calculation
  const allDonations = allDonationsData?.donations || [];
  const totalDonationsSum = allDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalDonorsCount = allDonationsData?.meta?.total || allDonations.length;
  const businessDonorsCount = allDonations.filter(d => d.donorType === 'BUSINESS').length;

  const STAT_CARDS = [
    {
      label: 'Total Donations',
      value: `€${totalDonationsSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      Icon: Euro,
      gradient: 'linear-gradient(135deg, #05DF72 0%, #00A63E 100%)',
    },
    {
      label: 'Total Donors',
      value: String(totalDonorsCount),
      Icon: Users,
      gradient: 'linear-gradient(135deg, #51A2FF 0%, #155DFC 100%)',
    },
    {
      label: 'Business Donors',
      value: String(businessDonorsCount),
      Icon: Building2,
      gradient: 'linear-gradient(135deg, #C27AFF 0%, #9810FA 100%)',
    },
  ];

  const rawDonations = donationsData?.donations || [];
  const mappedDonors = rawDonations.map((donor) => ({
    id: donor.id,
    name: donor.name,
    email: donor.email,
    phone: donor.phone,
    type: donor.donorType === 'INDIVIDUAL' ? 'Individual' : 'Business',
    amount: `€${donor.amount}`,
    date: donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : '—',
    fullDate: donor.createdAt ? new Date(donor.createdAt).toLocaleString() : '—',
    transactionId: donor.payments?.[0]?.id || donor.id,
    businessName: donor.businessName,
    donationType: donor.businessType === 'ONLINE_BUSINESS' ? 'Online' : 'Local',
    description: donor.description,
    website: donor.websiteUrl,
    notes: donor.description,
  }));

  const totalPages = donationsData?.meta?.totalPages || Math.max(1, Math.ceil((donationsData?.meta?.total || 0) / PAGE_SIZE));
  const startIdx = mappedDonors.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, donationsData?.meta?.total || 0);

  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => setOpenId(null), []);

  const handleSeeDetails = useCallback(
    (id) => {
      setDetailDonor(mappedDonors.find((d) => d.id === id) ?? null);
      setOpenId(null);
    },
    [mappedDonors],
  );

  const handleCloseDetail = useCallback(() => setDetailDonor(null), []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteDonation(id).unwrap();
        toast.success('Donation deleted successfully');
        setOpenId(null);
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Failed to delete donation');
      }
    },
    [deleteDonation],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E2AB0B]"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className='flex flex-col gap-8'>
      {/* Page header */}
      <div data-reveal>
        <h1
          className='text-4xl font-semibold text-[#050609]'
          style={{ fontFamily: "'Crimson Pro', serif" }}
        >
          Donations
        </h1>
        <p className='text-base text-[#464646] mt-2'>
          Overview &amp; management of your platform.
        </p>
      </div>

      {/* Stat cards */}
      <StatCards STAT_CARDS={STAT_CARDS} />

      {/* Table */}
      <DonationTable
        paginated={mappedDonors}
        TABLE_COLS={TABLE_COLS}
        DONOR_TYPE_STYLES={DONOR_TYPE_STYLES}
        anchorRefs={anchorRefs}
        handleToggle={handleToggle}
        openId={openId}
        handleClose={handleClose}
        handleSeeDetails={handleSeeDetails}
        handleDelete={handleDelete}
      >
        <Pagination
          startIdx={startIdx}
          endIdx={endIdx}
          totalCount={donationsData?.meta?.total || 0}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </DonationTable>
      {detailDonor && (
        <DonationDetailModal donor={detailDonor} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default AdminDonation;
