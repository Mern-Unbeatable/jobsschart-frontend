const recentKeys = new Map();
const DEFAULT_TTL_MS = 4000;

/** Prevent duplicate alerts/toasts for the same event within a short window. */
export function shouldShowNotification(key, ttlMs = DEFAULT_TTL_MS) {
  if (!key) return true;
  const now = Date.now();
  const last = recentKeys.get(key);
  if (last != null && now - last < ttlMs) return false;
  recentKeys.set(key, now);

  if (recentKeys.size > 200) {
    for (const [k, ts] of recentKeys) {
      if (now - ts > ttlMs * 2) recentKeys.delete(k);
    }
  }

  return true;
}

export function clearNotificationDedupe(key) {
  if (key) recentKeys.delete(key);
}
