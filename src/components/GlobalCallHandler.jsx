import React, { useState, useEffect, useCallback, useRef } from 'react';
import CallRoom from './CallRoom';

const GlobalCallHandler = () => {
    const [activeCallData, setActiveCallData] = useState(null);
    const activeCallIdRef = useRef(null);
    activeCallIdRef.current = activeCallData?.callId ?? null;

    useEffect(() => {
        const handleOpenCallWindow = (event) => {
            const callData = event.detail;
            if (callData?.callId) {
                setActiveCallData(callData);
            }
        };

        window.addEventListener('open-call-window', handleOpenCallWindow);
        return () => window.removeEventListener('open-call-window', handleOpenCallWindow);
    }, []);

    const handleClose = useCallback(() => {
        setActiveCallData(null);
    }, []);

    if (!activeCallData?.callId) return null;

    return (
        <CallRoom
            key={activeCallData.callId}
            callData={activeCallData}
            onClose={handleClose}
        />
    );
};

export default GlobalCallHandler;
