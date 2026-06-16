import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  MoreVertical,
  Euro,
  Users,
  Building2,
} from 'lucide-react';
import DonationDetailModal from './components/DonationDetailModal';
import ActionsDropdown from './components/ActionsDropdown';
import Pagination from './components/Pagination';
import { gsap } from 'gsap';

const PAGE_SIZE = 6;

const DONOR_TYPE_STYLES = {
  Individual: 'text-[#6E35AE]',
  Business: 'text-[#E2AB0B]',
};

const STAT_CARDS = [
  {
    label: 'Total Donations',
    value: '€11,417.00',
    Icon: Euro,
    gradient: 'linear-gradient(135deg, #05DF72 0%, #00A63E 100%)',
  },
  {
    label: 'Total Donors',
    value: '50',
    Icon: Users,
    gradient: 'linear-gradient(135deg, #51A2FF 0%, #155DFC 100%)',
  },
  {
    label: 'Business Donors',
    value: '35',
    Icon: Building2,
    gradient: 'linear-gradient(135deg, #C27AFF 0%, #9810FA 100%)',
  },
];

const INITIAL_DONORS = [
  {
    id: 1,
    name: 'Bessie Cooper',
    email: 'alma.lawson@example.com',
    phone: '(209) 555-0104',
    type: 'Individual',
    amount: '€250',
    date: '4/28/2026',
    fullDate: '4/28/2026, 10:12:44 AM',
    transactionId: 'DON00001',
    notes:
      'Happy to contribute to this wonderful cause. Keep up the great work!',
  },
  {
    id: 2,
    name: 'Courtney Henry',
    email: 'felicia.reid@example.com',
    phone: '(252) 555-0126',
    type: 'Business',
    amount: '€1,200',
    date: '4/28/2026',
    fullDate: '4/28/2026, 10:45:00 AM',
    transactionId: 'DON00002',
    businessName: 'Henry Solutions LLC',
    donationType: 'Online',
    description:
      'Supporting local community health initiatives and outreach programs.',
    website: 'https://henrysolutions.example.com',
    notes:
      'Proud to support this initiative as part of our corporate social responsibility.',
  },
  {
    id: 3,
    name: 'Albert Flores',
    email: 'michelle.rivera@example.com',
    phone: '(808) 555-0111',
    type: 'Individual',
    amount: '€369',
    date: '4/28/2026',
    fullDate: '4/28/2026, 11:05:20 AM',
    transactionId: 'DON00003',
    notes: 'Wishing the team all the best. This is a great mission.',
  },
  {
    id: 4,
    name: 'Dianne Russell',
    email: 'debra.holt@example.com',
    phone: '(316) 555-0116',
    type: 'Business',
    amount: '€2,500',
    date: '4/28/2026',
    fullDate: '4/28/2026, 11:31:32 AM',
    transactionId: 'DON00004',
    businessName: 'City Fitness Center',
    donationType: 'Online',
    description:
      'Innovative technology solutions for modern businesses and communities.',
    website: 'https://example-business5.com',
    notes: 'We believe in the power of community. Delighted to contribute.',
  },
  {
    id: 5,
    name: 'Ronald Richards',
    email: 'kent.lawson@example.com',
    phone: '(406) 555-0120',
    type: 'Individual',
    amount: '€180',
    date: '4/28/2026',
    fullDate: '4/28/2026, 12:00:00 PM',
    transactionId: 'DON00005',
    notes: 'Small contribution but given with all my heart. God bless.',
  },
  {
    id: 6,
    name: 'Arlene McCoy',
    email: 'jessica.hanson@example.com',
    phone: '(208) 555-0112',
    type: 'Business',
    amount: '€3,418',
    date: '4/28/2026',
    fullDate: '4/28/2026, 12:30:10 PM',
    transactionId: 'DON00006',
    businessName: 'McCoy Consulting Group',
    donationType: 'Offline',
    description:
      'Dedicated to empowering small businesses and entrepreneurs globally.',
    website: 'https://mccoyconsulting.example.com',
    notes:
      'Honored to be part of this initiative. Looking forward to more collaborations.',
  },
  {
    id: 7,
    name: 'Wade Warren',
    email: 'alma.obrien@example.com',
    phone: '(907) 555-0101',
    type: 'Individual',
    amount: '€500',
    date: '4/28/2026',
    fullDate: '4/28/2026, 1:15:55 PM',
    transactionId: 'DON00007',
    notes: 'Thank you for the amazing work you do. Sending love and support!',
  },
];

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
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [detailDonor, setDetailDonor] = useState(null);
  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current.querySelectorAll('[data-reveal]'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.07 },
    );
  }, []);

  const totalPages = Math.max(1, Math.ceil(donors.length / PAGE_SIZE));
  const paginated = donors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startIdx = donors.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, donors.length);

  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => setOpenId(null), []);

  const handleSeeDetails = useCallback(
    (id) => {
      setDetailDonor(donors.find((d) => d.id === id) ?? null);
      setOpenId(null);
    },
    [donors],
  );

  const handleCloseDetail = useCallback(() => setDetailDonor(null), []);

  const handleDelete = useCallback(
    (id) => {
      setDonors((prev) => prev.filter((d) => d.id !== id));
      setOpenId(null);
      setPage((p) => {
        const remaining = donors.length - 1;
        const newTotal = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
        return Math.min(p, newTotal);
      });
    },
    [donors.length],
  );

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
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5' data-reveal>
        {STAT_CARDS.map(({ label, value, Icon, gradient }) => (
          <div
            key={label}
            className='bg-white border border-black/10 rounded-2xl p-6 flex items-start justify-between'
          >
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-[#4A5565]'>{label}</p>
              <p className='text-3xl font-normal text-[#0A0A0A] leading-9'>
                {value}
              </p>
            </div>
            <div
              className='w-12 h-12 rounded-xl flex items-center justify-center shrink-0'
              style={{ background: gradient }}
            >
              <Icon size={22} color='#fff' />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className='bg-white rounded-xl border border-black/10 overflow-hidden'
        data-reveal
      >
        <div className='hidden sm:block overflow-x-auto'>
          {/* Header */}
          <div className='bg-[#F6FBFF] flex items-center px-4'>
            {TABLE_COLS.map((col) => (
              <div
                key={col.label}
                className={`flex items-center px-2.5 py-3 ${col.width}`}
              >
                <p className='text-base text-black font-normal whitespace-nowrap'>
                  {col.label}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className='flex flex-col'>
            {paginated.length === 0 ? (
              <p className='px-4 py-12 text-center text-base text-[#8A8A8A]'>
                No donations found.
              </p>
            ) : (
              paginated.map((donor) => (
                <div
                  key={donor.id}
                  className='flex items-center px-4 border-b border-[#E4E4E4] last:border-b-0'
                >
                  <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                    {donor.name}
                  </div>
                  <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C] break-all'>
                    {donor.email}
                  </div>
                  <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                    {donor.phone}
                  </div>
                  <div
                    className={`flex-1 px-2.5 py-4 text-base font-normal ${
                      DONOR_TYPE_STYLES[donor.type] ?? 'text-[#0C0C0C]'
                    }`}
                  >
                    {donor.type}
                  </div>
                  <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                    {donor.amount}
                  </div>
                  <div className='flex-1 px-2.5 py-4 text-base text-[#0C0C0C]'>
                    {donor.date}
                  </div>
                  <div className='w-20 px-2.5 py-4 flex items-center justify-center'>
                    <button
                      type='button'
                      ref={(el) => {
                        anchorRefs.current[donor.id] = el;
                      }}
                      onClick={() => handleToggle(donor.id)}
                      aria-label={`Actions for ${donor.name}`}
                      className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#333]'
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openId === donor.id && (
                      <ActionsDropdown
                        anchorEl={anchorRefs.current[donor.id]}
                        onClose={handleClose}
                        onSeeDetails={() => handleSeeDetails(donor.id)}
                        onDelete={() => handleDelete(donor.id)}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='sm:hidden divide-y divide-gray-100'>
          {paginated.length === 0 ? (
            <p className='py-12 text-center text-base text-[#8A8A8A]'>
              No donations found.
            </p>
          ) : (
            paginated.map((donor) => (
              <div
                key={`m-${donor.id}`}
                className='px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors'
              >
                <div className='min-w-0'>
                  <p className='text-base font-semibold text-[#0C0C0C]'>
                    {donor.name}
                  </p>
                  <p className='text-base text-[#0C0C0C] break-all'>
                    {donor.email}
                  </p>
                  <p className='text-base text-[#0C0C0C]'>{donor.phone}</p>
                  <p
                    className={`text-base mt-0.5 ${
                      DONOR_TYPE_STYLES[donor.type] ?? 'text-[#0C0C0C]'
                    }`}
                  >
                    {donor.type}
                  </p>
                  <p className='text-base text-[#0C0C0C]'>{donor.amount}</p>
                  <p className='text-base text-[#0C0C0C]'>{donor.date}</p>
                </div>
                <div className='shrink-0'>
                  <button
                    type='button'
                    ref={(el) => {
                      anchorRefs.current[`m-${donor.id}`] = el;
                    }}
                    onClick={() => handleToggle(`m-${donor.id}`)}
                    aria-label={`Actions for ${donor.name}`}
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#333]'
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openId === `m-${donor.id}` && (
                    <ActionsDropdown
                      anchorEl={anchorRefs.current[`m-${donor.id}`]}
                      onClose={handleClose}
                      onSeeDetails={() => handleSeeDetails(donor.id)}
                      onDelete={() => handleDelete(donor.id)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination
          startIdx={startIdx}
          endIdx={endIdx}
          totalCount={donors.length}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      {detailDonor && (
        <DonationDetailModal donor={detailDonor} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default AdminDonation;
