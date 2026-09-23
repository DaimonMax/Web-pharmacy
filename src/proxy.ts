import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-it-in-env'
);
const JWT_ISSUER = process.env.JWT_ISSUER || 'WebPharmacy';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'WebPharmacyClient';

export async function proxy(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    const requestHeaders = new Headers(request.headers);
    
    if (payload.nameIdentifier) {
      requestHeaders.set('x-user-id', String(payload.nameIdentifier));
    }
    if (payload.role) {
      requestHeaders.set('x-user-role', String(payload.role));
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*',
};