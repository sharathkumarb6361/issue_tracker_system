import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const iconStyles = {
    slate: 'bg-slate-100 text-slate-700',
    sky: 'bg-sky-100 text-sky-800',
    amber: 'bg-amber-100 text-amber-900',
    emerald: 'bg-emerald-100 text-emerald-800',
};
export default function DashboardCard({ label, count, icon: Icon, tone, }) {
    return (_jsx("article", { className: "rounded-md border border-slate-200 bg-white p-5 shadow-sm", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-medium text-slate-600", children: label }), _jsx("p", { className: "mt-3 text-3xl font-semibold tabular-nums text-slate-950", children: count })] }), _jsx("span", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconStyles[tone]}`, children: _jsx(Icon, { "aria-hidden": "true", size: 20, strokeWidth: 1.8 }) })] }) }));
}
