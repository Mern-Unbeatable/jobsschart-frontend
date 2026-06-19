import React, { memo } from 'react';
import AdminStats from './components/AdminStats';
import RevenueChart from './components/RevenueChart';
import { useGetDashboardStatsQuery } from '../../../../features/api/userApi';

const Dashboard = memo(() => {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page title */}
      <div>
        <h1 className='dashboard-page-title'>Dashboard</h1>
        <p className='dashboard-page-subtitle mt-0.5'>
          Overview &amp; management of your platform.
        </p>
      </div>

      {/* Stats cards */}
      <AdminStats statsData={statsData} />

      {/* Revenue chart */}
      <RevenueChart />
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
