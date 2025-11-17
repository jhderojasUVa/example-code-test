import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const { pathname } = req.nextUrl;

  // Allow the share page to be accessed without authentication
  if (pathname.startsWith('/api/share/')) {
    return NextResponse.next();
  }

  if (authHeader !== 'Bearer test-user') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Attach user id to the request headers for use in API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', 'test-user');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};
