import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
export async function DELETE(_request, { params }) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    try {
        const { commentId } = await params;
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { id: true, userId: true },
        });
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        if (comment.userId !== user.id) {
            return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 });
        }
        await prisma.comment.delete({ where: { id: commentId } });
        return NextResponse.json({ message: 'Comment deleted' });
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025') {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        console.error('Unable to delete comment:', error);
        return NextResponse.json({ error: 'Unable to delete comment' }, { status: 500 });
    }
}
