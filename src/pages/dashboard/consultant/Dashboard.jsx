// src/pages/dashboard/consultant/Dashboard.jsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { Euro, TrendingUp, CalendarDays, Star, User, Wifi, WifiOff } from 'lucide-react';
import { useUpdateOnlineStatusMutation } from '../../../features/api/consultantApi';
import { socketService } from '../../../services/socketService';
import toast from 'react-hot-toast';

const METRICS = [
  {
    id: 'today',
    label: 'Today',
    value: '€234.50',
    valueSize: 'text-[28px]',
    icon: Euro,
    iconBg: 'bg-[#e9f9ef]',
    iconColor: 'text-green-600',
  },
  {
    id: 'week',
    label: 'This Week',
    value: '€1215.00',
    valueSize: 'text-[28px]',
    icon: TrendingUp,
    iconBg: 'bg-[#fff5e5]',
    iconColor: 'text-[#ce9c0a]',
  },
  {
    id: 'month',
    label: 'This Month',
    value: '€5637.50',
    valueSize: 'text-[30px]',
    icon: CalendarDays,
    iconBg: 'bg-[#e1e5fa]',
    iconColor: 'text-indigo-500',
  },
];

const RECENT_CLIENTS = [
  { id: 1, name: 'Sharah', sessionDate: 'Apr 24, 2026', rating: '5.0' },
  { id: 2, name: 'zefar', sessionDate: 'Apr 25, 2026', rating: '5.0' },
  { id: 3, name: 'jony', sessionDate: 'Apr 25, 2026', rating: '5.0' },
  { id: 4, name: 'Aliza', sessionDate: 'Apr 23, 2026', rating: '5.0' },
  { id: 5, name: 'Liyana', sessionDate: 'Apr 24, 2026', rating: '5.0' },
  { id: 6, name: 'Fariha', sessionDate: 'Apr 25, 2026', rating: '5.0' },
];

const CLIENTS_PER_PAGE = 5;

const ConsultantDashboard = () => {
  const user = useSelector(selectUser);
  const token = useSelector(state => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnline, setIsOnline] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [updateOnlineStatus] = useUpdateOnlineStatusMutation();

  const totalPages = Math.ceil(RECENT_CLIENTS.length / CLIENTS_PER_PAGE);
  const totalClients = RECENT_CLIENTS.length;
  const startResult = totalClients === 0 ? 0 : (currentPage - 1) * CLIENTS_PER_PAGE + 1;
  const endResult = Math.min(currentPage * CLIENTS_PER_PAGE, totalClients);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
    const endIndex = startIndex + CLIENTS_PER_PAGE;
    return RECENT_CLIENTS.slice(startIndex, endIndex);
  }, [currentPage]);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (user?.id && token) {
      socketService.connect(user.id, token);

      const checkConnection = setInterval(() => {
        // ✅ Use getConnectionStatus() or isConnected()
        const isConnected = socketService.isConnected();
        setSocketConnected(isConnected);
      }, 3000);

      return () => {
        clearInterval(checkConnection);
      };
    }
  }, [user?.id, token]);

  const handlePageChange = useCallback(
    (nextPage) => {
      const safePage = Math.max(1, Math.min(nextPage, totalPages));
      setCurrentPage(safePage);
    },
    [totalPages],
  );

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await updateOnlineStatus({ onlineStatus: newStatus ? 'ONLINE' : 'OFFLINE' }).unwrap();
      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);

      // Also emit socket event to notify status change
      if (socketService.isConnected()) {
        socketService.emit('consultant_status', { status: newStatus ? 'ONLINE' : 'OFFLINE' });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  // Debug function to test socket
  const testSocketConnection = () => {
    const status = socketService.isConnected();
    toast.success(`Socket ${status ? 'Connected' : 'Disconnected'}`);

    if (status) {
      socketService.emit('get_rooms', {});
    }
  };

  return (
    <section className='space-y-6 sm:space-y-8'>
      {/* Welcome header with online status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className='dashboard-page-title'>
            Welcome back, {user?.name || 'Sarah'}
          </h1>
          <p className='dashboard-page-subtitle mt-2'>
            You have 3 sessions scheduled for today.
          </p>
          {/* Socket Status Indicator */}
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              Socket: {socketConnected ? 'Connected ✅' : 'Disconnected ❌'}
            </span>
            <button
              onClick={testSocketConnection}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded ml-2"
            >
              Test
            </button>
          </div>
        </div>

        {/* Online Status Toggle Button */}
        <button
          onClick={toggleOnlineStatus}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isOnline
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        </button>
      </div>

      {/* Earnings metric cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {METRICS.map(
          ({ id, label, value, valueSize, icon: Icon, iconBg, iconColor }) => (
            <article
              key={id}
              className='flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6'
            >
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}
              >
                <Icon size={24} className={iconColor} aria-hidden='true' />
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm text-[#373737]'>{label}</p>
                <p
                  className={`${valueSize} font-semibold leading-none text-[#0c0c0c]`}
                >
                  {value}
                </p>
              </div>
            </article>
          ),
        )}
      </div>

      {/* Recent Clients */}
      <section className='rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 lg:p-8'>
        <h2 className='text-[28px] font-medium capitalize text-[#333333]'>
          Recent Clients
        </h2>

        <div className='mt-8 flex flex-col gap-5'>
          {paginatedClients.map((client) => (
            <div
              key={client.id}
              className='flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 sm:p-5'
            >
              <div className='flex items-center gap-4'>
                <div className='flex size-11 items-center justify-center rounded bg-[#d9d9d9] text-[#464646]'>
                  <User size={26} aria-hidden='true' />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <p className='text-lg font-medium leading-none text-[#464646]'>
                    {client.name}
                  </p>
                  <p className='text-sm text-[#464646]'>
                    Last session: {client.sessionDate}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Star
                  size={20}
                  fill='#ce9c0a'
                  className='text-[#ce9c0a]'
                  aria-hidden='true'
                />
                <span className='text-sm text-[#464646]'>{client.rating}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 md:flex-row md:items-center md:justify-between'>
          <p className='text-center text-sm font-medium text-[#b27d00] sm:text-base md:text-left'>
            Showing {startResult} to {endResult} of {totalClients} results
          </p>

          <div className='flex w-full flex-wrap items-center justify-center gap-3 md:w-auto md:justify-end'>
            <button
              type='button'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='min-w-33 rounded-2xl border border-[#d9a406] px-5 py-2 text-sm font-medium text-[#b27d00] transition-all duration-200 ease-in-out sm:py-2.5 sm:text-base disabled:cursor-not-allowed disabled:opacity-50'
            >
              Previous
            </button>

            <button
              type='button'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='min-w-33 rounded-2xl border border-[#d9a406] px-5 py-2 text-sm font-medium text-[#b27d00] transition-all duration-200 ease-in-out sm:py-2.5 sm:text-base disabled:cursor-not-allowed disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ConsultantDashboard;