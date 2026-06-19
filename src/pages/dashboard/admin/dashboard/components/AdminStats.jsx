import React, { memo } from 'react';
import { Users, UserCheck, Phone, Euro, Radio } from 'lucide-react';

const AdminStats = memo(({ statsData }) => {
  const users = statsData?.totalUsers ?? 0;
  const consultants = statsData?.totalConsultants ?? 0;
  const consultations = statsData?.totalConsultations ?? 0;
  const revenue = statsData?.totalRevenue ?? 0;
  const activeCalls = statsData?.activeCalls ?? 0;

  const items = [
    {
      label: 'Total Users',
      value: users.toLocaleString(),
      icon: Users,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      label: 'Total Consultants',
      value: consultants.toLocaleString(),
      icon: UserCheck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Total Consultations',
      value: consultations.toLocaleString(),
      icon: Phone,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Total Revenue',
      value: `€${revenue.toLocaleString()}`,
      icon: Euro,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      label: 'Active Calls',
      value: activeCalls.toLocaleString(),
      icon: Radio,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
      {items.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
        <div
          key={label}
          className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3'
        >
          <div
            className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}
          >
            <Icon size={20} className={iconColor} aria-hidden='true' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>{label}</p>
            <p className='text-2xl font-bold text-gray-900 mt-0.5'>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

AdminStats.displayName = 'AdminStats';

export default AdminStats;
