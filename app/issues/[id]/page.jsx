import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import IssueDeleteButton from '@/components/issues/issue-delete-button';
import IssueComments from '@/components/issues/issue-comments';
import PriorityBadge from '@/components/issues/PriorityBadge';
import StatusBadge from '@/components/issues/StatusBadge';
export default async function IssueDetailPage({ params, }) {
    const currentUser = await requireAuth();
    const { id } = await params;
    const issue = await prisma.issue.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
        },
    });
    if (!issue)
        notFound();
    return (_jsxs("div", { className: "mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-5 border-b border-slate-200 pb-5 xl:flex-row xl:items-end xl:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-teal-700", children: "Issue details" }), _jsx("h1", { className: "mt-1 break-words text-2xl font-semibold text-slate-950 sm:text-3xl", children: issue.title }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [_jsx(StatusBadge, { status: issue.status }), _jsx(PriorityBadge, { priority: issue.priority })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(Link, { href: `/issues/${id}/edit`, className: "inline-flex min-h-10 items-center rounded-md bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2", children: "Edit Issue" }), _jsx(IssueDeleteButton, { issueId: id }), _jsx(Link, { href: "/issues", className: "inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700", children: "Back to Issues" })] })] }), _jsxs("section", { "aria-labelledby": "issue-information-heading", className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6", children: [_jsx("h2", { id: "issue-information-heading", className: "text-lg font-semibold text-slate-950", children: "Issue information" }), _jsx("p", { className: "mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700", children: issue.description }), _jsxs("dl", { className: "mt-6 grid gap-x-8 gap-y-5 border-t border-slate-100 pt-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-slate-500", children: "Created by" }), _jsxs("dd", { className: "mt-1 text-sm text-slate-900", children: [issue.createdBy.name, _jsx("span", { className: "block text-slate-500", children: issue.createdBy.email })] })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-slate-500", children: "Assigned to" }), _jsxs("dd", { className: "mt-1 text-sm text-slate-900", children: [issue.assignedTo?.name ?? 'Unassigned', issue.assignedTo && _jsx("span", { className: "block text-slate-500", children: issue.assignedTo.email })] })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-slate-500", children: "Created date" }), _jsx("dd", { className: "mt-1 text-sm text-slate-900", children: issue.createdAt.toLocaleString() })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-semibold uppercase text-slate-500", children: "Updated date" }), _jsx("dd", { className: "mt-1 text-sm text-slate-900", children: issue.updatedAt.toLocaleString() })] })] })] }), _jsx(IssueComments, { issueId: id, currentUserId: currentUser.id })] }));
}
