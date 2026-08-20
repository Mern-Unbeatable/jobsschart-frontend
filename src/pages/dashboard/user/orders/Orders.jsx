import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import UserTabBar from "./components/UserTabBar";
import OrderCard from "./components/OrderCard";
import { useGetMyOrdersQuery } from "../../../../features/api/orderApi";
import { resolveI18n } from "../../../../utils/resolveI18n";

const mapUserOrder = (order, locale = 'en') => {
  const firstItem = order.items?.[0];
  const title = resolveI18n(firstItem?.product?.name, locale) || "Product Name";
  const description =
    resolveI18n(firstItem?.product?.description, locale) || "No description available.";
  const image =
    firstItem?.product?.image ||
    (firstItem?.product?.gallery && firstItem.product.gallery[0]) ||
    "https://placehold.co/600x450?text=No+Image+Available";
  const price = order.totalAmount
    ? order.totalAmount.toString().startsWith("$") ||
      order.totalAmount.toString().startsWith("€")
      ? order.totalAmount
      : `€${order.totalAmount}`
    : "€0";
  const statusTab = order.status === "DELIVERED" ? "completed" : "recent";
  return {
    id: order.id,
    title,
    description,
    price,
    image,
    status: statusTab,
    raw: order,
  };
};

const UserOrders = () => {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState("recent");
  const { data: apiResponse, isLoading, error } = useGetMyOrdersQuery();
  const orders = useMemo(() => {
    if (!apiResponse?.orders) return [];
    return apiResponse.orders.map((order) => mapUserOrder(order, i18n.language));
  }, [apiResponse, i18n.language]);

  const visibleOrders = useMemo(
    () => orders.filter((item) => item.status === tab),
    [orders, tab],
  );

  const handleCancelOrder = (orderId) => {
    console.log("Cancelling order:", orderId);
  };

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
          className="px-5 py-2 bg-green-500/60 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="dashboard-page-title">
          {t("dashboard.user.orders.title")}
        </h1>
        <p className="dashboard-page-subtitle text-base">
          {t("dashboard.user.orders.subtitle")}
        </p>
      </div>
      <UserTabBar tab={tab} onTabChange={setTab} />
      {visibleOrders.length === 0 ? (
        <div className="py-16 text-center text-base text-gray-400 bg-white border border-gray-100 rounded-xl">
          No orders found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default UserOrders;
