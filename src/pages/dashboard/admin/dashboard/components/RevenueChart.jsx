import React, { memo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetRevenueChartQuery } from '../../../../../features/api/userApi';

const formatYAxis = (value) => {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
  return `€${value}`;
};

const RevenueChart = memo(() => {
  const [period, setPeriod] = useState('this_year');

  const { data: chartData, isLoading } = useGetRevenueChartQuery({ period });

  const revenueData = chartData?.data || [];

  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6'>
      <div className='flex items-start justify-between mb-6'>
        <div>
          <h2 className='text-base font-semibold text-gray-900'>
            Revenue Per Consultant
          </h2>
          <p className='text-sm text-gray-400 mt-0.5'>
            Top performing categories
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex items-center gap-4 text-xs text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-full bg-amber-400 inline-block' />
              Donation
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-full bg-red-500 inline-block' />
              Webshop
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-2.5 h-2.5 rounded-full bg-lime-400 inline-block' />
              Consultant
            </span>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className='text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300'
          >
            <option value="this_year">This year</option>
            <option value="last_year">Last year</option>
            <option value="6_months">Last 6 months</option>
          </select>
        </div>
      </div>
      <div className='h-80 sm:h-96 relative'>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
          </div>
        )}
        
        {revenueData.length === 0 && !isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-[#717171]">
            No revenue data available for chart.
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id='colorDonation' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#f59e0b' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#f59e0b' stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id='colorWebshop' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#ef4444' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#ef4444' stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id='colorConsultant'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='5%' stopColor='#a3e635' stopOpacity={0.5} />
                  <stop offset='95%' stopColor='#a3e635' stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f3f4f6'
                vertical={false}
              />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip
                formatter={(value) => [`€${value.toLocaleString()}`, undefined]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Area
                type='monotone'
                dataKey='donation'
                stroke='#f59e0b'
                strokeWidth={2}
                fill='url(#colorDonation)'
                name='Donation'
              />
              <Area
                type='monotone'
                dataKey='webshop'
                stroke='#ef4444'
                strokeWidth={2}
                fill='url(#colorWebshop)'
                name='Webshop'
              />
              <Area
                type='monotone'
                dataKey='consultant'
                stroke='#a3e635'
                strokeWidth={2}
                fill='url(#colorConsultant)'
                name='Consultant'
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';

export default RevenueChart;
