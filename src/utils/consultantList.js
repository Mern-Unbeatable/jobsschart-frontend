const STATUS_ORDER = { ONLINE: 0, BUSY: 1, OFFLINE: 2 };

export function getConsultantUserId(consultant) {
  return consultant?.userId || consultant?.user?.id || null;
}

export function sortConsultantsByPresence(consultants, getStatus) {
  return [...consultants].sort((a, b) => {
    const aUserId = getConsultantUserId(a);
    const bUserId = getConsultantUserId(b);
    const aStatus = (getStatus?.(aUserId, a.onlineStatus) || a.onlineStatus || 'OFFLINE').toUpperCase();
    const bStatus = (getStatus?.(bUserId, b.onlineStatus) || b.onlineStatus || 'OFFLINE').toUpperCase();
    const statusDiff = (STATUS_ORDER[aStatus] ?? 3) - (STATUS_ORDER[bStatus] ?? 3);
    if (statusDiff !== 0) return statusDiff;

    const ratingA = parseFloat(a.rating || a.averageRating || 0);
    const ratingB = parseFloat(b.rating || b.averageRating || 0);
    if (ratingB !== ratingA) return ratingB - ratingA;

    const nameA = (a.user?.name || a.name || '').toLowerCase();
    const nameB = (b.user?.name || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

export function isConsultantSelf(viewerUserId, consultant) {
  if (!viewerUserId) return false;
  return getConsultantUserId(consultant) === viewerUserId;
}

export function canUserContactConsultant({ viewerRole, viewerUserId, consultant }) {
  const role = viewerRole?.toUpperCase();
  if (role === 'CONSULTANT' || role === 'ADMIN') {
    return { allowed: false, reason: 'restricted_role' };
  }
  if (isConsultantSelf(viewerUserId, consultant)) {
    return { allowed: false, reason: 'self' };
  }
  return { allowed: true, reason: null };
}
