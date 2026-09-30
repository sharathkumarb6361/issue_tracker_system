import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import IssueForm from '@/components/issues/issue-form';
export default async function EditIssuePage({ params, }) {
    await requireAuth();
    const { id } = await params;
    const issue = await prisma.issue.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            assignedToId: true,
        },
    });
    if (!issue)
        notFound();
    return (_jsxs("div", { className: "mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8", children: [_jsxs("div", { className: "mb-6 border-b border-slate-200 pb-5", children: [_jsx("p", { className: "text-xs font-semibold uppercase text-teal-700", children: "Issue management" }), _jsx("h1", { className: "mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl", children: "Edit Issue" })] }), _jsx("div", { className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6", children: _jsx(IssueForm, { issueId: issue.id, initialValues: {
                        title: issue.title,
                        description: issue.description,
                        status: issue.status,
                        priority: issue.priority,
                        assignedToId: issue.assignedToId ?? '',
                    } }) })] }));
}
