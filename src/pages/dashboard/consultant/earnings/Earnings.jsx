import React, { memo } from 'react';
import EarningsStats from './components/EarningsStats';
import EarningsChart from './components/EarningsChart';
import { useGetMyEarningsDashboardQuery } from '../../../../features/api/consultantApi';

const ConsultantEarnings = memo(() => {
  const { data, isLoading } = useGetMyEarningsDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  const dashboardData = data?.dashboard || {};
  const chartData = data?.chart || {};

  return (
    <div className='flex flex-col gap-9'>
      {/* Page header */}
      <div className='flex flex-col gap-2'>
        <h1 className='dashboard-page-title'>Earnings</h1>
        <p className='dashboard-page-subtitle'>
          Track your income and revenue breakdown
        </p>
      </div>

      {/* Stat cards */}
      <EarningsStats dashboardData={dashboardData} />

      {/* Earnings Over Time chart */}
      <EarningsChart chartData={chartData} />
    </div>
  );
});

ConsultantEarnings.displayName = 'ConsultantEarnings';

export default ConsultantEarnings;
