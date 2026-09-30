'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
export default function ConfirmDialog({ isOpen, title, description, confirmLabel = 'Delete', pendingLabel = 'Deleting...', isPending = false, onCancel, onConfirm, }) {
    const cancelButtonRef = useRef(null);
    const confirmButtonRef = useRef(null);
    useEffect(() => {
        if (!isOpen)
            return;
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        cancelButtonRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isPending) {
                event.preventDefault();
                onCancel();
            }
            if (event.key === 'Tab') {
                const first = cancelButtonRef.current;
                const last = confirmButtonRef.current;
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                }
                else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus();
        };
    }, [isOpen, isPending, onCancel]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4", onMouseDown: (event) => {
            if (event.target === event.currentTarget && !isPending)
                onCancel();
        }, children: _jsxs("section", { role: "alertdialog", "aria-modal": "true", "aria-labelledby": "confirm-dialog-title", "aria-describedby": "confirm-dialog-description", className: "w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-xl sm:p-6", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-700", children: _jsx(AlertTriangle, { "aria-hidden": "true", size: 19 }) }), _jsxs("div", { children: [_jsx("h2", { id: "confirm-dialog-title", className: "text-base font-semibold text-slate-950", children: title }), _jsx("p", { id: "confirm-dialog-description", className: "mt-1 text-sm leading-5 text-slate-600", children: description })] })] }), _jsxs("div", { className: "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [_jsx("button", { ref: cancelButtonRef, type: "button", onClick: onCancel, disabled: isPending, className: "inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50", children: "Cancel" }), _jsx("button", { ref: confirmButtonRef, type: "button", onClick: onConfirm, disabled: isPending, className: "inline-flex min-h-10 items-center justify-center rounded-md bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: isPending ? pendingLabel : confirmLabel })] })] }) }));
}
