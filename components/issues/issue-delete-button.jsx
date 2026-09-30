'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
export default function IssueDeleteButton({ issueId }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);
    const removeIssue = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            const response = await fetch(`/api/issues/${issueId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Unable to delete this issue. Please try again.');
                setIsConfirming(false);
                return;
            }
            router.push('/issues');
            router.refresh();
        }
        catch {
            setError('A network error occurred. Please try again.');
            setIsConfirming(false);
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("button", { type: "button", onClick: () => setIsConfirming(true), disabled: isDeleting, className: "inline-flex min-h-10 items-center rounded-md border border-rose-300 px-4 text-sm font-semibold text-rose-800 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 disabled:cursor-not-allowed disabled:opacity-50", children: "Delete Issue" }), error && _jsx("p", { className: "mt-2 text-sm text-red-700", role: "alert", children: error }), _jsx(ConfirmDialog, { isOpen: isConfirming, title: "Delete Issue?", description: "Are you sure you want to delete this issue? This action cannot be undone.", isPending: isDeleting, onCancel: () => setIsConfirming(false), onConfirm: removeIssue })] }));
}
