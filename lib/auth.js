import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
export const AUTH_COOKIE_NAME = 'auth_token';
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return new TextEncoder().encode(secret);
};
/**
 * Sign a JWT token containing user id, name, and email
 */
export async function signToken(payload) {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getJwtSecretKey());
}
/**
 * Verify a JWT token and extract the payload
 */
export async function verifyToken(token) {
    try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        const payload = verified.payload;
        if (!payload.id || !payload.email || !payload.name) {
            return null;
        }
        return {
            id: payload.id,
            name: payload.name,
            email: payload.email,
        };
    }
    catch {
        return null;
    }
}
/**
 * Retrieve the currently authenticated user from HTTP-only cookie and database
 */
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
        if (!token) {
            return null;
        }
        const payload = await verifyToken(token);
        if (!payload) {
            return null;
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}
/**
 * Enforce authentication on server pages.
 * Redirects to /login if unauthenticated.
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}
