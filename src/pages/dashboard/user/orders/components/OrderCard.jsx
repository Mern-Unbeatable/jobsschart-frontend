import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const OrderCard = memo(({ order, onCancel }) => {
  const { t } = useTranslation();

  return (
    <article className="rounded-xl border border-gray-100 bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start lg:items-center">
        <img
          src={order.image}
          alt={order.title}
          className="h-48 w-full rounded-lg object-cover sm:h-56 md:h-40 md:w-56 md:shrink-0 lg:h-44"
          loading="lazy"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-base leading-6 text-[#606060]">
            {t("dashboard.user.orders.orderIdLabel")} {order.id}
          </p>
          <h2 className="text-xl leading-tight font-medium text-[#333333] sm:text-2xl">
            {order.title}
          </h2>
          <p className="text-base leading-7 text-[#545454]">
            {order.description}
          </p>
          <p className="text-2xl leading-tight font-medium text-black">
            {order.price}
          </p>
          <button
            type="button"
            onClick={() => onCancel && onCancel(order.id)}
            className="inline-flex w-full items-center justify-center rounded bg-green-500/60 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-[#6E35AE] sm:w-auto cursor-pointer"
          >
            {t("dashboard.user.orders.cancelButton")}
          </button>
        </div>
      </div>
    </article>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;
