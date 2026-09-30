import { jsx as _jsx } from "react/jsx-runtime";
const badgeStyles = {
    OPEN: 'border-sky-200 bg-sky-50 text-sky-800 before:bg-sky-600',
    IN_PROGRESS: 'border-amber-200 bg-amber-50 text-amber-900 before:bg-amber-600',
    CLOSED: 'border-emerald-200 bg-emerald-50 text-emerald-800 before:bg-emerald-600',
};
const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    CLOSED: 'Closed',
};
export default function StatusBadge({ status }) {
    return (_jsx("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full ${badgeStyles[status]}`, children: labels[status] }));
}
