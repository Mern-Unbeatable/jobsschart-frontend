import React, { memo } from 'react';
import { Euro } from 'lucide-react';

const StatCard = memo(({ label, value }) => (
  <div className='bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 h-full'>
    <div className='bg-[#e9f9ef] w-10 h-10 rounded-lg flex items-center justify-center shrink-0'>
      <Euro size={20} className='text-green-600' />
    </div>
    <div className='flex flex-col gap-2'>
      <span className='text-[#0c0c0c] text-[30px] sm:text-3xl font-semibold leading-tight'>
        {value}
      </span>
      <span className='text-[#373737] text-base'>{label}</span>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

const EarningsStats = memo(({ dashboardData }) => {
  const today = dashboardData?.todayIncome ?? 0;
  const revenue = dashboardData?.totalRevenue ?? 0;
  const balance = dashboardData?.availableBalance ?? dashboardData?.withdrawableAmount ?? 0;

  const cards = [
    { id: 'today', label: "Today's Income", value: `€${today.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { id: 'revenue', label: 'Total Revenue', value: `€${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { id: 'balance', label: 'Available Balance', value: `€${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {cards.map((card) => (
        <StatCard key={card.id} label={card.label} value={card.value} />
      ))}
    </div>
  );
});

EarningsStats.displayName = 'EarningsStats';

export default EarningsStats;
