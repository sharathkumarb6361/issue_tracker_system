import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DashboardLoading() {
    return (_jsxs("div", { className: "mx-auto w-full max-w-7xl animate-pulse px-4 py-7 sm:px-6 lg:px-8", "aria-label": "Loading dashboard", "aria-busy": "true", role: "status", children: [_jsx("div", { className: "h-20 border-b border-slate-200" }), _jsx("div", { className: "mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [0, 1, 2, 3].map((item) => _jsx("div", { className: "h-28 border border-slate-200 bg-white" }, item)) }), _jsx("div", { className: "mt-10 h-64 border border-slate-200 bg-white" })] }));
}
