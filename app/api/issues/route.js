import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createIssueSchema } from '@/lib/validations/issues';
import { z } from 'zod';
const issueRelations = {
    createdBy: { select: { id: true, name: true, email: true } },
    assignedTo: { select: { id: true, name: true, email: true } },
};
const issueFilterSchema = z.object({
    search: z.string().trim().max(200).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    assignedToId: z.string().trim().min(1).optional(),
});
export async function GET(request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const rawFilters = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsedFilters = issueFilterSchema.safeParse(rawFilters);
    if (!parsedFilters.success) {
        return NextResponse.json({ error: 'Invalid issue filters' }, { status: 400 });
    }
    try {
        const { search, status, priority, assignedToId } = parsedFilters.data;
        const where = {
            ...(status ? { status } : {}),
            ...(priority ? { priority } : {}),
            ...(assignedToId ? { assignedToId } : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const issues = await prisma.issue.findMany({
            where,
            include: issueRelations,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ issues });
    }
    catch (error) {
        console.error('Unable to load issues:', error);
        return NextResponse.json({ error: 'Unable to load issues' }, { status: 500 });
    }
}
export async function POST(request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    let body;
    try {
        body = await request.json();
    }
    catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const parsed = createIssueSchema.safeParse(body);
    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return NextResponse.json({ error: 'Invalid issue data', fieldErrors }, { status: 400 });
    }
    try {
        const assignedUser = await prisma.user.findUnique({
            where: { id: parsed.data.assignedToId },
            select: { id: true },
        });
        if (!assignedUser) {
            return NextResponse.json({
                error: 'Assigned user not found',
                fieldErrors: { assignedToId: ['Select a registered user'] },
            }, { status: 400 });
        }
        const issue = await prisma.issue.create({
            data: {
                ...parsed.data,
                createdById: user.id,
            },
            include: issueRelations,
        });
        return NextResponse.json({ issue }, { status: 201 });
    }
    catch (error) {
        console.error('Unable to create issue:', error);
        return NextResponse.json({ error: 'Unable to create issue' }, { status: 500 });
    }
}
