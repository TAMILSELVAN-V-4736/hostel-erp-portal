let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
if (rawApiUrl && !rawApiUrl.endsWith('/api/v1') && !rawApiUrl.endsWith('/api/v1/')) {
    rawApiUrl = `${rawApiUrl.replace(/\/$/, '')}/api/v1`;
}
export const API_URL = rawApiUrl;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }

  return res.json();
}
