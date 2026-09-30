'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/button';
const emptyIssue = {
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    assignedToId: '',
};
const fieldClass = 'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700';
export default function IssueForm({ issueId, initialValues, }) {
    const router = useRouter();
    const [values, setValues] = useState(initialValues ?? emptyIssue);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    useEffect(() => {
        let active = true;
        fetch('/api/users')
            .then(async (response) => {
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Unable to load users');
            if (active) {
                setUsers(data.users);
                setValues((current) => ({
                    ...current,
                    assignedToId: current.assignedToId || data.users[0]?.id || '',
                }));
            }
        })
            .catch((requestError) => {
            if (active) {
                setError(requestError instanceof Error ? requestError.message : 'Unable to load users');
            }
        })
            .finally(() => {
            if (active)
                setLoadingUsers(false);
        });
        return () => {
            active = false;
        };
    }, []);
    const updateField = (name, value) => {
        setValues((current) => ({ ...current, [name]: value }));
        setFieldErrors((current) => {
            const next = { ...current };
            delete next[name];
            return next;
        });
        setError(null);
    };
    const submit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({});
        try {
            const response = await fetch(issueId ? `/api/issues/${issueId}` : '/api/issues', {
                method: issueId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Unable to save issue');
                setFieldErrors(data.fieldErrors || {});
                return;
            }
            router.push(`/issues/${data.issue.id}`);
            router.refresh();
        }
        catch {
            setError('A network error occurred. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const fieldError = (name) => fieldErrors[name]?.[0] ? (_jsx("p", { className: "mt-1 text-sm text-red-700", role: "alert", children: fieldErrors[name][0] })) : null;
    return (_jsxs("form", { onSubmit: submit, className: "space-y-6", children: [error && _jsx("p", { className: "border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800", role: "alert", children: error }), _jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-slate-800", children: "Title" }), _jsx("input", { id: "title", value: values.title, onChange: (event) => updateField('title', event.target.value), className: fieldClass, placeholder: "e.g. Sign-in form rejects valid credentials", minLength: 3, required: true }), fieldError('title')] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-slate-800", children: "Description" }), _jsx("textarea", { id: "description", value: values.description, onChange: (event) => updateField('description', event.target.value), className: `${fieldClass} min-h-36 resize-y`, placeholder: "Describe what happened, what you expected, and how to reproduce it.", required: true }), fieldError('description')] }), _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-slate-800", children: "Status" }), _jsxs("select", { id: "status", value: values.status, onChange: (event) => updateField('status', event.target.value), className: fieldClass, children: [_jsx("option", { value: "OPEN", children: "Open" }), _jsx("option", { value: "IN_PROGRESS", children: "In progress" }), _jsx("option", { value: "CLOSED", children: "Closed" })] }), fieldError('status')] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "priority", className: "block text-sm font-medium text-slate-800", children: "Priority" }), _jsxs("select", { id: "priority", value: values.priority, onChange: (event) => updateField('priority', event.target.value), className: fieldClass, children: [_jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" })] }), fieldError('priority')] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "assignedToId", className: "block text-sm font-medium text-slate-800", children: "Assigned To" }), _jsxs("select", { id: "assignedToId", value: values.assignedToId, onChange: (event) => updateField('assignedToId', event.target.value), className: fieldClass, required: true, disabled: loadingUsers || users.length === 0, children: [loadingUsers && _jsx("option", { value: "", children: "Loading users..." }), !loadingUsers && users.length === 0 && _jsx("option", { value: "", children: "No users available" }), users.map((user) => _jsxs("option", { value: user.id, children: [user.name, " (", user.email, ")"] }, user.id))] }), fieldError('assignedToId')] }), _jsxs("div", { className: "flex flex-wrap gap-3 border-t border-slate-200 pt-5", children: [_jsx(Button, { type: "submit", disabled: isSubmitting || loadingUsers || users.length === 0, children: isSubmitting ? (issueId ? 'Saving...' : 'Creating...') : (issueId ? 'Save Changes' : 'Create Issue') }), _jsx(Link, { href: issueId ? `/issues/${issueId}` : '/issues', className: "inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50", children: "Cancel" })] })] }));
}
