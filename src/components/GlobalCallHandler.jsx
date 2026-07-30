import React, { useState, useEffect } from 'react';
import CallRoom from './CallRoom';

const GlobalCallHandler = () => {
    const [activeCallData, setActiveCallData] = useState(null);

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

    if (!activeCallData) return null;

    return (
        <CallRoom
            callData={activeCallData}
            onClose={() => setActiveCallData(null)}
        />
    );
};

export default GlobalCallHandler;
