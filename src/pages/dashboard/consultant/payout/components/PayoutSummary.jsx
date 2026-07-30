import React, { memo } from "react";
import { Euro, WalletCards, ArrowUpRight } from "lucide-react";

const SummaryCard = memo(
  ({ title, amount, icon: Icon, showWithdraw, onWithdrawClick }) => (
    <div className="bg-white border border-gray-100 rounded-[10px] p-6 flex flex-col gap-3">
      <div className="w-10 h-10 rounded bg-[#f1ebf7] flex items-center justify-center">
        <Icon size={20} className="text-[#6e35ae]" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-black text-4xl leading-none font-medium">{amount}</p>
        <p className="text-black text-base">{title}</p>
      </div>

      {showWithdraw ? (
        <button
          type="button"
          onClick={onWithdrawClick}
          className="mt-1 bg-green-500/60 text-white text-base font-medium rounded-xl px-9 py-2 transition-all duration-200 ease-in-out "
        >
          Withdraw Funds
        </button>
      ) : null}
    </div>
  ),
);

SummaryCard.displayName = "SummaryCard";

export default function PayoutSummary({ onWithdrawClick, balanceData }) {
  const withdrawable = balanceData?.withdrawableBalance ?? 0;
  const pending = balanceData?.pendingPayoutAmount ?? 0;
  const total = balanceData?.totalEarned ?? 0;

  const summaryItems = [
    {
      id: "withdrawable",
      title: "Available to Withdraw",
      amount: `€${withdrawable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Euro,
      showWithdraw: true,
    },
    {
      id: "pending",
      title: "Pending Payout (processing)",
      amount: `€${pending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      showWithdraw: false,
    },
    {
      id: "total",
      title: "Total Earnings",
      amount: `€${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: WalletCards,
      showWithdraw: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryItems.map((item) => (
        <SummaryCard
          key={item.id}
          title={item.title}
          amount={item.amount}
          icon={item.icon}
          showWithdraw={item.showWithdraw}
          onWithdrawClick={onWithdrawClick}
        />
      ))}
    </div>
  );
}

