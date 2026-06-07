// src/components/call/IncomingCallModal.jsx
import React, { memo, useState, useEffect, useRef } from 'react';
import { Phone, Video, PhoneOff, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { socketService } from '../../services/socketService';
import {
    useAcceptCallMutation,
    useRejectCallMutation,
} from '../../features/api/callApi';
import { twilioVideoService } from '../../services/twilioVideoService';
import toast from 'react-hot-toast';

const LISTENER_KEY = 'incoming-call-modal';

const IncomingCallModal = memo(({ incomingCall, onAccepted, onRejected }) => {
    const { user, token } = useSelector(state => state.auth);
    const [acceptCall, { isLoading: isAccepting }] = useAcceptCallMutation();
    const [rejectCall, { isLoading: isRejecting }] = useRejectCallMutation();
    const isClosingRef = useRef(false);

    if (!incomingCall) return null;

    const isAudio = incomingCall.callType === 'PHONE';
    const isVideo = incomingCall.callType === 'VIDEO';

    const handleAccept = async () => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;

        try {
            const result = await acceptCall(incomingCall.callId).unwrap();

            // ✅ Use the CONSULTANT's token from the incoming call data
            const consultantToken = result?.data?.consultantToken || result?.consultantToken || incomingCall.token;
            const roomName = result?.data?.call?.roomName || result?.call?.roomName || incomingCall.roomName;

            if (!consultantToken || !roomName) {
                toast.error('Missing connection data');
                isClosingRef.current = false;
                return;
            }

            // ✅ Connect to Twilio room - use connectAudio for PHONE, connectVideo for VIDEO
            if (isAudio) {
                try {
                    await twilioVideoService.connectAudio(consultantToken, roomName);
                    console.log('✅ Consultant connected to audio room');
                } catch (err) {
                    console.error('❌ Consultant audio connect error:', err);
                    toast.error('Audio connection failed');
                    isClosingRef.current = false;
                    return;
                }
            } else {
                // For video calls, let the VideoCallModal handle the connection
                // Just pass the data up
            }

            toast.success('Call accepted!');

            // Notify parent component
            if (onAccepted) {
                onAccepted({
                    callId: incomingCall.callId,
                    roomName,
                    consultantToken,
                    callType: incomingCall.callType,
                    callerName: incomingCall.callerName,
                    callerAvatar: incomingCall.callerAvatar,
                });
            }
        } catch (err) {
            console.error('Accept call error:', err);
            toast.error(err?.data?.message || 'Failed to accept call');
            isClosingRef.current = false;
        }
    };

    const handleReject = async () => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;

        try {
            await rejectCall(incomingCall.callId).unwrap();
            toast('Call rejected', { icon: '📵' });
            if (onRejected) onRejected();
        } catch (err) {
            console.error('Reject call error:', err);
            toast.error('Failed to reject call');
            isClosingRef.current = false;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
            <div className="bg-[#2D2D2D] w-full max-w-sm rounded-2xl p-6 flex flex-col items-center shadow-2xl border border-white/10">
                {/* Call type icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isAudio ? 'bg-yellow-500/20' : 'bg-green-500/20'
                    }`}>
                    {isAudio ? (
                        <Phone size={36} className="text-yellow-400" />
                    ) : (
                        <Video size={36} className="text-green-400" />
                    )}
                </div>

                {/* Caller info */}
                {incomingCall.callerAvatar ? (
                    <img
                        src={incomingCall.callerAvatar}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover mb-3"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-[#D1C4E9] flex items-center justify-center text-[#5E35B1] text-2xl font-bold mb-3">
                        {incomingCall.callerName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}

                <h2 className="text-white font-bold text-xl mb-1">
                    {incomingCall.callerName || 'Unknown'}
                </h2>

                <p className="text-gray-400 text-sm mb-2">
                    {isAudio ? 'Audio Call' : 'Video Call'}
                </p>

                <p className="text-yellow-400 text-sm font-semibold mb-6 animate-pulse">
                    ● Incoming call...
                </p>

                {/* Accept / Reject buttons */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleReject}
                        disabled={isRejecting}
                        className="w-14 h-14 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105"
                    >
                        <PhoneOff size={24} />
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className="w-14 h-14 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105"
                    >
                        {isAudio ? <Phone size={24} /> : <Video size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
});

IncomingCallModal.displayName = 'IncomingCallModal';
export default IncomingCallModal;