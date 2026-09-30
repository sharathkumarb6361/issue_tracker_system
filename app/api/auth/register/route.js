import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
export async function POST(req) {
    try {
        let body;
        try {
            body = await req.json();
        }
        catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // 1. Validate request body with Zod
        const validationResult = registerSchema.safeParse(body);
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
        const { name, email, password } = validationResult.data;
        const normalizedEmail = email.toLowerCase().trim();
        // 2. Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }
        // 3. Hash password using bcryptjs
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // 4. Create user in PostgreSQL using Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // 5. Never return password; return proper success response
        return NextResponse.json({
            message: 'User registered successfully',
            user: newUser,
        }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
    }
}
