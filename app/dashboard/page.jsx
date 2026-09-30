import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from 'next/link';
import { CircleCheck, CircleDot, Layers3, LoaderCircle, Plus } from 'lucide-react';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentIssues from '@/components/dashboard/RecentIssues';
const summaryCards = [
    { label: 'Total Issues', key: 'total', icon: Layers3, tone: 'slate' },
    { label: 'Open', key: 'open', icon: CircleDot, tone: 'sky' },
    { label: 'In Progress', key: 'inProgress', icon: LoaderCircle, tone: 'amber' },
    { label: 'Closed', key: 'closed', icon: CircleCheck, tone: 'emerald' },
];
export default async function DashboardPage() {
    await requireAuth();
    let dashboardData = null;
    try {
        const [total, open, inProgress, closed, recentIssues] = await Promise.all([
            prisma.issue.count(),
            prisma.issue.count({ where: { status: 'OPEN' } }),
            prisma.issue.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.issue.count({ where: { status: 'CLOSED' } }),
            prisma.issue.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    assignedTo: { select: { name: true } },
                },
            }),
        ]);
        dashboardData = {
            counts: { total, open, inProgress, closed },
            recentIssues,
        };
    }
    catch (error) {
        console.error('Unable to load dashboard data:', error);
    }
    return (_jsxs("div", { className: "mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8", children: [_jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-teal-800", children: "Workspace overview" }), _jsx("h1", { className: "mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl", children: "Dashboard" }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "A current view of your team's issues." })] }), _jsxs(Link, { href: "/issues/new", className: "inline-flex min-h-10 items-center gap-2 rounded-md bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2", children: [_jsx(Plus, { "aria-hidden": "true", size: 17 }), " Create Issue"] })] }), !dashboardData ? (_jsxs("div", { className: "rounded-md border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-900", role: "alert", children: [_jsx("p", { className: "font-semibold", children: "Something went wrong." }), _jsx("p", { className: "mt-1", children: "Please try again." }), _jsx(Link, { href: "/dashboard", className: "mt-3 inline-block font-semibold underline", children: "Try again" })] })) : (_jsxs(_Fragment, { children: [_jsx("section", { "aria-label": "Issue summary", className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4", children: summaryCards.map((card) => (_jsx(DashboardCard, { label: card.label, count: dashboardData.counts[card.key], icon: card.icon, tone: card.tone }, card.key))) }), _jsx(RecentIssues, { issues: dashboardData.recentIssues })] }))] }));
}
