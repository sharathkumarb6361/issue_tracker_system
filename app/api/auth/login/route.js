import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
export async function POST(req) {
    try {
        let body;
        try {
            body = await req.json();
        }
        catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // 1. Validate email and password using Zod
        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            const issues = validationResult.error.flatten();
            const firstErrorMessage = issues.formErrors[0] ||
                Object.values(issues.fieldErrors)[0]?.[0] ||
                'Validation failed';
            return NextResponse.json({
                error: firstErrorMessage,
                fieldErrors: issues.fieldErrors,
            }, { status: 400 });
        }
        const { email, password } = validationResult.data;
        const normalizedEmail = email.toLowerCase().trim();
        // 2. Find user using Prisma
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        // 3. Compare password using bcryptjs
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        // 4. Generate JWT containing: user id, name, email
        const token = await signToken({
            id: user.id,
            name: user.name,
            email: user.email,
        });
        // 5. Store JWT in a secure HTTP-only cookie
        const response = NextResponse.json({
            message: 'Logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        }, { status: 200 });
        response.cookies.set({
            name: AUTH_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        return response;
    }
    catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during login' }, { status: 500 });
    }
}
