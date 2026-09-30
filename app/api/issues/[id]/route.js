import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateIssueSchema } from '@/lib/validations/issues';
const issueRelations = {
    createdBy: { select: { id: true, name: true, email: true } },
    assignedTo: { select: { id: true, name: true, email: true } },
};
export async function GET(_request, { params }) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const issue = await prisma.issue.findUnique({
            where: { id },
            include: issueRelations,
        });
        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        return NextResponse.json({ issue });
    }
    catch (error) {
        console.error('Unable to load issue:', error);
        return NextResponse.json({ error: 'Unable to load issue' }, { status: 500 });
    }
}
export async function PUT(request, { params }) {
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
    const parsed = updateIssueSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({
            error: 'Invalid issue data',
            fieldErrors: parsed.error.flatten().fieldErrors,
        }, { status: 400 });
    }
    try {
        const { id } = await params;
        const existingIssue = await prisma.issue.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingIssue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
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
        const issue = await prisma.issue.update({
            where: { id },
            data: parsed.data,
            include: issueRelations,
        });
        return NextResponse.json({ issue });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025') {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        console.error('Unable to update issue:', error);
        return NextResponse.json({ error: 'Unable to update issue' }, { status: 500 });
    }
}
export async function DELETE(_request, { params }) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const existingIssue = await prisma.issue.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingIssue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        await prisma.issue.delete({ where: { id } });
        return NextResponse.json({ message: 'Issue deleted successfully' });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025') {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        console.error('Unable to delete issue:', error);
        return NextResponse.json({ error: 'Unable to delete issue' }, { status: 500 });
    }
}
