import React, { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import TabBar from './components/TabBar';
import OrdersTable from './components/OrdersTable';
import Pagination from './components/Pagination';
import OrderDetailModal from './components/OrderDetailModal';

const TABS = [
  'All',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_STYLES = {
  Pending: 'bg-[#FFF5E6] text-[#E2AB0B]',
  Delivered: 'bg-[#EDFFF2] text-[#07BC27]',
  Shipped: 'bg-[#E8F5FF] text-[#38B6FF]',
  Processing: 'bg-[#F5EEFF] text-[#9B51E0]',
  Cancelled: 'bg-[#FFF0F0] text-[#EF4444]',
};

const MOCK_ITEMS = [
  { name: 'Healing Crystal Set', qty: 1, price: '$200.00' },
  { name: 'Healing Crystal Set', qty: 1, price: '$200.00' },
  { name: 'Healing Crystal Set', qty: 1, price: '$200.00' },
];

const INITIAL_ORDERS = [
  {
    id: '#ORD-001',
    customer: 'Darlene Robertson',
    phone: '(239) 555-0108',
    email: 'michelle.rivera@example.com',
    address: '3891 Ranchview Dr. Richardson, California 62639',
    product: 'Healing Crystal Set',
    price: '$150,000',
    date: '2024-03-24',
    status: 'Pending',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-002',
    customer: 'Cameron Williamson',
    phone: '(312) 555-0199',
    email: 'cameron.williamson@example.com',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    product: 'Sacred Incense Pack',
    price: '$190,000',
    date: '2024-03-24',
    status: 'Delivered',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-004',
    customer: 'Robert Fox',
    phone: '(480) 555-0103',
    email: 'robert.fox@example.com',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    product: 'Tarot Guidance Pack',
    price: '$170,000',
    date: '2024-03-24',
    status: 'Shipped',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-003',
    customer: 'Darlene Robertson',
    phone: '(239) 555-0108',
    email: 'michelle.rivera@example.com',
    address: '3891 Ranchview Dr. Richardson, California 62639',
    product: 'Healing Crystal Set',
    price: '$150,000',
    date: '2024-03-24',
    status: 'Pending',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-005',
    customer: 'Cameron Williamson',
    phone: '(312) 555-0199',
    email: 'cameron.williamson@example.com',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    product: 'Healing Crystal Set',
    price: '$190,000',
    date: '2024-03-24',
    status: 'Delivered',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-006',
    customer: 'Robert Fox',
    phone: '(480) 555-0103',
    email: 'robert.fox@example.com',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    product: 'Healing Crystal Set',
    price: '$170,000',
    date: '2024-03-24',
    status: 'Processing',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
  {
    id: '#ORD-007',
    customer: 'Jane Cooper',
    phone: '(605) 555-0144',
    email: 'jane.cooper@example.com',
    address: '4140 Parker Rd. Allentown, New Mexico 31134',
    product: 'Meditation Bundle',
    price: '$120,000',
    date: '2024-03-25',
    status: 'Cancelled',
    cancelReason:
      'The order has been cancelled due to a change in customer requirements. If you have any questions or need further assistance, please feel free to contact us.',
    items: MOCK_ITEMS,
    subtotal: '$1000.00',
    delivery: '$150.00',
    total: '$1500.00',
  },
];

const PAGE_SIZE = 6;

const AdminOrders = () => {
  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const blocks = pageRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out' },
    );
  }, []);

  const filtered =
    activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
    setOpenId(null);
  }, []);

  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => setOpenId(null), []);

  const handleSeeDetails = useCallback((order) => {
    setDetailOrder(order);
    setOpenId(null);
  }, []);

  const handleCloseDetail = useCallback(() => setDetailOrder(null), []);

  const handleStatusChange = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    setDetailOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev,
    );
    setOpenId(null);
  }, []);

  return (
    <div ref={pageRef} className='flex flex-col gap-6'>
      {/* Page header */}
      <div data-reveal>
        <h1 className='dashboard-page-title'>Orders</h1>
        <p className='dashboard-page-subtitle mt-1'>
          Overview &amp; management of your platform.
        </p>
      </div>

      {/* Tab bar */}
      <TabBar TABS={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Table & Pagination */}
      <OrdersTable
        paginated={paginated}
        STATUS_STYLES={STATUS_STYLES}
        anchorRefs={anchorRefs}
        handleToggle={handleToggle}
        openId={openId}
        handleClose={handleClose}
        handleSeeDetails={handleSeeDetails}
        handleStatusChange={handleStatusChange}
      >
        <Pagination
          page={page}
          totalResults={filtered.length}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </OrdersTable>

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={handleCloseDetail}
          onStatusChange={(s) => handleStatusChange(detailOrder.id, s)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
