'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '@/components/ui/button';
export default function GlobalError({ reset }) {
    return (_jsx("main", { className: "flex flex-1 items-center justify-center px-4 py-16", children: _jsxs("div", { className: "w-full max-w-md rounded-md border border-rose-200 bg-white p-6 shadow-sm", children: [_jsx("h1", { className: "text-xl font-semibold text-slate-950", children: "Something went wrong." }), _jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Please try again." }), _jsx(Button, { type: "button", onClick: reset, className: "mt-5", children: "Try again" })] }) }));
}
