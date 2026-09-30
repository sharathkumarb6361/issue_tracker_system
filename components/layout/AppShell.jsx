'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
function AppFooter() {
    return (_jsxs("footer", { className: "border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500 sm:px-6", children: ["Issue Tracker ", _jsx("span", { "aria-hidden": "true", children: "\u00B7" }), " ", new Date().getFullYear()] }));
}
export default function AppShell({ children, user, }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (!user || isAuthPage) {
        return (_jsxs("div", { className: "flex min-h-screen flex-col bg-slate-50", children: [_jsx("main", { className: "flex flex-1 flex-col", children: children }), _jsx(AppFooter, {})] }));
    }
    return (_jsxs("div", { className: "flex min-h-screen flex-col bg-slate-50", children: [_jsx(Header, { user: user }), _jsxs("div", { className: "mx-auto grid w-full max-w-screen-2xl flex-1 lg:grid-cols-[15rem_minmax(0,1fr)]", children: [_jsx(Sidebar, { pathname: pathname }), _jsx("main", { className: "min-w-0", children: children })] }), _jsx(AppFooter, {})] }));
}
