const AUTH_RETURN_KEY = 'auth_return_to';

export function redirectToLogin(navigate, { from } = {}) {
  const returnPath =
    from || `${window.location.pathname}${window.location.search}`;

  navigate('/login', {
    state: {
      from: returnPath,
    },
  });
}

export function stashAuthReturnUrl() {
  sessionStorage.setItem(
    AUTH_RETURN_KEY,
    `${window.location.pathname}${window.location.search}`,
  );
}

export function consumeAuthReturnUrl() {
  const value = sessionStorage.getItem(AUTH_RETURN_KEY);
  sessionStorage.removeItem(AUTH_RETURN_KEY);
  return value || null;
}
