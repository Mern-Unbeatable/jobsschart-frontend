const STORAGE_KEY = 'mollie_checkout_session_id';

export function storeMollieCheckoutSession(sessionId) {
  if (sessionId) {
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
}

export function consumeMollieCheckoutSession() {
  const id = localStorage.getItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  return id;
}

export function redirectToMollieCheckout(result) {
  if (!result?.url) {
    return false;
  }
  storeMollieCheckoutSession(result.sessionId);
  window.location.href = result.url;
  return true;
}
