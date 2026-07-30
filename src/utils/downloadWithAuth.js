/** Download a protected API file using Bearer token (works when window.open cannot send headers). */
export async function downloadWithAuth(relativePath, filename) {
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL || 'https://api.illorac.nl/api/v1';
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;

  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      token = auth?.token;
    } catch {
      token = null;
    }
  }

  if (!token) {
    throw new Error('You must be logged in to download this file.');
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Download failed';
    try {
      const err = await response.json();
      message = err?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await response.blob();

  let downloadName = filename;
  const disposition = response.headers.get('Content-Disposition');
  if (disposition) {
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
    if (utf8Match?.[1]) {
      downloadName = decodeURIComponent(utf8Match[1]);
    } else if (plainMatch?.[1]) {
      downloadName = plainMatch[1];
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = downloadName || 'download';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
