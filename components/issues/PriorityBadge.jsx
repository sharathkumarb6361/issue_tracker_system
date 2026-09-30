import { jsx as _jsx } from "react/jsx-runtime";
const badgeStyles = {
    LOW: 'border-slate-200 bg-slate-50 text-slate-700 before:bg-slate-500',
    MEDIUM: 'border-orange-200 bg-orange-50 text-orange-900 before:bg-orange-600',
    HIGH: 'border-rose-200 bg-rose-50 text-rose-800 before:bg-rose-600',
};
const labels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
};
export default function PriorityBadge({ priority }) {
    return (_jsx("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full ${badgeStyles[priority]}`, children: labels[priority] }));
}
