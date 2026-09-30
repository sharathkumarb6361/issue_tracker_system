import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { requireAuth } from '@/lib/auth';
import IssueForm from '@/components/issues/issue-form';
export default async function NewIssuePage() {
    await requireAuth();
    return (_jsxs("div", { className: "mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8", children: [_jsxs("div", { className: "mb-6 border-b border-slate-200 pb-5", children: [_jsx("p", { className: "text-xs font-semibold uppercase text-teal-700", children: "Issue management" }), _jsx("h1", { className: "mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl", children: "Create New Issue" })] }), _jsx("div", { className: "rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6", children: _jsx(IssueForm, {}) })] }));
}
