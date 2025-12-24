import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login'];

// Routes that require super_admin role
const superAdminRoutes = ['/admins'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth data from cookie/localStorage (we'll use a simple cookie check)
  const authStorage = request.cookies.get('auth-storage');
  
  let isAuthenticated = false;
  let userRole = '';

  if (authStorage) {
    try {
      const authData = JSON.parse(authStorage.value);
      isAuthenticated = authData.state?.isAuthenticated || false;
      userRole = authData.state?.admin?.role || '';
    } catch {
      isAuthenticated = false;
    }
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check super_admin routes
  const isSuperAdminRoute = superAdminRoutes.some((route) => pathname.startsWith(route));
  if (isSuperAdminRoute && userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|health).*)',
  ],
};
