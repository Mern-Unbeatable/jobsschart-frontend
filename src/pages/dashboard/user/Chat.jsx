import React, { memo, useEffect } from 'react';
import RealTimeChat from '../../consultants/RealTimeChat';

const UserDashboardChat = memo(() => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="shrink-0">
        <h1 className="dashboard-page-title">Messages</h1>
        <p className="dashboard-page-subtitle mt-1">
          Chat with your consultants.
        </p>
      </div>

      <RealTimeChat className="min-h-0 flex-1 h-full" showSidebar />
    </div>
  );
});

UserDashboardChat.displayName = 'UserDashboardChat';
export default UserDashboardChat;
