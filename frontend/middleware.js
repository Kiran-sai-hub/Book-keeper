import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('jwt');
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/dashboard') && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if ((pathname === '/login' || pathname === '/register') && token) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
