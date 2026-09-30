import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const AUTH_COOKIE_NAME = 'auth_token';
const protectedPrefixes = ['/dashboard', '/issues'];
const authPages = ['/login', '/register'];
export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    const isAuthPage = authPages.some((page) => pathname === page);
    let isAuthenticated = false;
    if (token && process.env.JWT_SECRET) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            isAuthenticated = true;
        }
        catch {
            isAuthenticated = false;
        }
    }
    // Unauthenticated user attempting to access protected routes -> redirect to /login
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }
    // Authenticated user attempting to access /login or /register -> redirect to /dashboard
    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/issues/:path*',
        '/login',
        '/register',
    ],
};
