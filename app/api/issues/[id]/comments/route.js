import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createCommentSchema } from '@/lib/validations/comments';
const commentAuthor = { select: { id: true, name: true } };
export async function GET(_request, { params }) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const issue = await prisma.issue.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        const comments = await prisma.comment.findMany({
            where: { issueId: id },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: commentAuthor,
            },
        });
        return NextResponse.json({ comments });
    }
    catch (error) {
        console.error('Unable to load comments:', error);
        return NextResponse.json({ error: 'Unable to load comments' }, { status: 500 });
    }
}
export async function POST(request, { params }) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const issue = await prisma.issue.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }
        let body;
        try {
            body = await request.json();
        }
        catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        const parsed = createCommentSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                error: 'Invalid comment',
                fieldErrors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }
        const comment = await prisma.comment.create({
            data: {
                content: parsed.data.content,
                issueId: id,
                userId: user.id,
            },
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: commentAuthor,
            },
        });
        return NextResponse.json({ comment }, { status: 201 });
    }
    catch (error) {
        console.error('Unable to create comment:', error);
        return NextResponse.json({ error: 'Unable to create comment' }, { status: 500 });
    }
}
