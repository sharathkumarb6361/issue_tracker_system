import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import { requireAuth } from '@/lib/auth';
import IssueList from '@/components/issues/issue-list';
export default async function IssuesPage() {
    await requireAuth();
    return (_jsxs("div", { className: "mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8", children: [_jsxs("div", { className: "border-b border-slate-200 pb-5", children: [_jsx("p", { className: "text-xs font-semibold uppercase text-teal-800", children: "Workspace" }), _jsx("h1", { className: "mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl", children: "Issues" }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Search, filter, and manage your team's work." })] }), _jsx("div", { className: "pt-6", children: _jsx(Suspense, { fallback: _jsx("p", { className: "py-12 text-center text-sm text-slate-600", children: "Loading issues..." }), children: _jsx(IssueList, {}) }) })] }));
}
