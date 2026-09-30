import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ users });
    }
    catch (error) {
        console.error('Unable to load users:', error);
        return NextResponse.json({ error: 'Unable to load users' }, { status: 500 });
    }
}
