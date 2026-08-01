import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setupConsultantAudioUnlock } from '../utils/notificationSound';

/**
 * Preloads call ringtone and unlocks browser audio on first consultant interaction.
 */
export function ConsultantAudioInit() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isConsultant = user?.role === 'CONSULTANT' || user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAuthenticated || !isConsultant) return;
    setupConsultantAudioUnlock();
  }, [isAuthenticated, isConsultant]);

  return null;
}

export default ConsultantAudioInit;
