'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { CirclePlus, LayoutDashboard, ListTodo } from 'lucide-react';
const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/issues', label: 'Issues', icon: ListTodo },
    { href: '/issues/new', label: 'Create Issue', icon: CirclePlus },
];
export default function Sidebar({ pathname }) {
    const isActive = (href) => {
        if (href === '/dashboard')
            return pathname === href;
        if (href === '/issues')
            return pathname === href || (pathname.startsWith('/issues/') && pathname !== '/issues/new');
        return pathname === href;
    };
    return (_jsx("aside", { className: "border-b border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r", children: _jsx("nav", { "aria-label": "Main navigation", className: "flex gap-1 overflow-x-auto p-3 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:p-4", children: navigationItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (_jsxs(Link, { href: href, "aria-current": active ? 'page' : undefined, className: `inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${active ? 'bg-teal-50 text-teal-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`, children: [_jsx(Icon, { "aria-hidden": "true", size: 18, strokeWidth: 1.8 }), label] }, href));
            }) }) }));
}
