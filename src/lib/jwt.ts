export interface DecodedJwtPayload {
  nameIdentifier: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export function parseJwt(token: string): DecodedJwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: DecodedJwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
