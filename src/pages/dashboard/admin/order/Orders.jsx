import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { gsap } from "gsap";
import TabBar from "./components/TabBar";
import OrdersTable from "./components/OrdersTable";
import Pagination from "./components/Pagination";
import OrderDetailModal from "./components/OrderDetailModal";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../../features/api/orderApi";

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_STYLES = {
  Pending: "bg-[#FFF5E6] text-green-500/60",
  Delivered: "bg-[#EDFFF2] text-[#07BC27]",
  Shipped: "bg-[#E8F5FF] text-[#38B6FF]",
  Processing: "bg-[#F5EEFF] text-[#9B51E0]",
  Cancelled: "bg-[#FFF0F0] text-[#EF4444]",
};

const PAGE_SIZE = 6;

const formatStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const mapBackendOrder = (order) => {
  const customerName =
    order.user?.name || order.shippingAddress?.name || "Guest";
  const customerPhone = order.phone || order.shippingAddress?.phone || "N/A";
  const customerEmail =
    order.user?.email || order.shippingAddress?.email || "N/A";

  // Format Address
  let address = "N/A";
  if (order.shippingAddress) {
    const { street, city, country, postalCode } = order.shippingAddress;
    address = [street, city, country, postalCode].filter(Boolean).join(", ");
  }

  // Format Date
  const dateStr = order.createdAt ? order.createdAt.split("T")[0] : "";

  // Format Items
  const items = (order.items || []).map((item) => ({
    name: item.product?.name || "Unknown Product",
    qty: item.quantity || 1,
    price: item.price
      ? item.price.toString().startsWith("$") ||
        item.price.toString().startsWith("€")
        ? item.price
        : `$${item.price}`
      : "$0.00",
    image:
      item.product?.image ||
      (item.product?.gallery && item.product.gallery[0]) ||
      null,
  }));

  // Format main product name to show in the table
  const mainProduct =
    items.length > 0
      ? items[0].name + (items.length > 1 ? ` + ${items.length - 1} more` : "")
      : "No products";

  // Format prices
  const totalStr = order.totalAmount
    ? order.totalAmount.toString().startsWith("$") ||
      order.totalAmount.toString().startsWith("€")
      ? order.totalAmount
      : `$${order.totalAmount}`
    : "$0.00";

  return {
    id: order.id,
    customer: customerName,
    phone: customerPhone,
    email: customerEmail,
    address,
    product: mainProduct,
    price: totalStr,
    date: dateStr,
    status: formatStatus(order.status),
    items,
    subtotal: totalStr,
    delivery: "$0.00",
    total: totalStr,
    cancelReason: order.cancelReason || null,
    raw: order,
  };
};

const AdminOrders = () => {
  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);

  const { data: apiResponse, isLoading, error } = useGetAdminOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = useMemo(() => {
    if (!apiResponse?.orders) return [];
    return apiResponse.orders.map(mapBackendOrder);
  }, [apiResponse]);

  useEffect(() => {
    if (isLoading || error || !pageRef.current) return;
    const blocks = pageRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: "power2.out" },
    );
  }, [isLoading, error]);

  const filtered = useMemo(() => {
    return activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

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
    setDetailOrderId(order.id);
    setOpenId(null);
  }, []);

  const handleCloseDetail = useCallback(() => setDetailOrderId(null), []);

  const handleStatusChange = useCallback(
    async (orderId, newStatus) => {
      try {
        await updateOrderStatus({
          id: orderId,
          status: newStatus.toUpperCase(),
        }).unwrap();
        setOpenId(null);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    },
    [updateOrderStatus],
  );

  const detailOrder = useMemo(() => {
    return detailOrderId ? orders.find((o) => o.id === detailOrderId) : null;
  }, [orders, detailOrderId]);

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
          Failed to fetch orders.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-green-500/60 text-white rounded-lg hover:bg-[#6E35AE] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="flex flex-col gap-6">
      {/* Page header */}
      <div data-reveal>
        <h1 className="dashboard-page-title">Orders</h1>
        <p className="dashboard-page-subtitle mt-1">
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
