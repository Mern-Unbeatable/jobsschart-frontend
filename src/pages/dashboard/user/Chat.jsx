import React, { memo, useEffect } from 'react';
import RealTimeChat from '../../consultants/RealTimeChat';
import UserChatPage from '../../consultants/UserChatPage';

const UserDashboardChat = memo(() => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 lg:px-6 py-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Messages</h1>
        <div style={{ height: 'calc(100vh - 180px)' }}>
          <UserChatPage />
        </div>
      </div>
    </div>
  );
});

UserDashboardChat.displayName = 'UserDashboardChat';
export default UserDashboardChat;