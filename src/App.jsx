import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import router from './router/router';
import { TOAST_CONFIG } from './config';
import store from './features/store';
import GlobalCallHandler from './components/GlobalCallHandler';
import { IncomingCallNotification } from './components/IncomingCallNotification';
import { IncomingChatNotification } from './components/IncomingChatNotification';
import { SocketManager } from './components/SocketManager';
import { ChatSocketBridge } from './components/ChatSocketBridge';
import { CallSocketBridge } from './components/CallSocketBridge';
import { ScheduleSocketBridge } from './components/ScheduleSocketBridge';
import { BookingCancelledAlert } from './components/BookingCancelledAlert';
import { ConsultantAudioInit } from './components/ConsultantAudioInit';
import useGeoDomainRedirect from './hooks/useGeoDomainRedirect';

function App() {
  useGeoDomainRedirect();

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <GlobalCallHandler />
        <SocketManager />
        <ChatSocketBridge />
        <CallSocketBridge />
        <ScheduleSocketBridge />
        <BookingCancelledAlert />
        <ConsultantAudioInit />
        <IncomingCallNotification />
        <IncomingChatNotification />
        <Toaster
          position={TOAST_CONFIG.POSITION}
          toastOptions={{ duration: TOAST_CONFIG.DURATION }}
        />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
