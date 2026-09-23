export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

const TOKEN_STORAGE_KEY = 'token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
  onUnauthorized?: () => void
): Promise<T> {
  const { body, headers, ...rest } = options;
  const method = options.method || 'GET';

  const token = getStoredToken();
  const isFormData = body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const res = await fetch(`/api${endpoint}`, {
    ...rest,
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({} as { message?: string }));
    if (res.status === 401 && !endpoint.startsWith('/auth/')) {
      onUnauthorized?.();
    }
    throw new ApiError(errorBody.message || `Error API: ${res.status}`, res.status);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}