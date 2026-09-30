'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import IssueTable from '@/components/issues/IssueTable';
const controlClass = 'min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700';
export default function IssueList() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const [search, setSearch] = useState(searchParams.get('search') ?? '');
    const [status, setStatus] = useState(searchParams.get('status') ?? '');
    const [priority, setPriority] = useState(searchParams.get('priority') ?? '');
    const [assignedToId, setAssignedToId] = useState(searchParams.get('assignedToId') ?? '');
    const [issues, setIssues] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [issueError, setIssueError] = useState(null);
    const [userError, setUserError] = useState(null);
    useEffect(() => {
        setSearch(searchParams.get('search') ?? '');
        setStatus(searchParams.get('status') ?? '');
        setPriority(searchParams.get('priority') ?? '');
        setAssignedToId(searchParams.get('assignedToId') ?? '');
    }, [queryString, searchParams]);
    useEffect(() => {
        const params = new URLSearchParams();
        if (search.trim())
            params.set('search', search.trim());
        if (status)
            params.set('status', status);
        if (priority)
            params.set('priority', priority);
        if (assignedToId)
            params.set('assignedToId', assignedToId);
        const nextQuery = params.toString();
        const timer = window.setTimeout(() => {
            const currentQuery = new URLSearchParams(queryString).toString();
            if (nextQuery !== currentQuery) {
                router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
            }
        }, 250);
        return () => window.clearTimeout(timer);
    }, [search, status, priority, assignedToId, pathname, queryString, router]);
    useEffect(() => {
        let active = true;
        setIsLoadingIssues(true);
        setIssueError(null);
        fetch(`/api/issues${queryString ? `?${queryString}` : ''}`)
            .then(async (response) => {
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Unable to load issues');
            if (active)
                setIssues(data.issues);
        })
            .catch((requestError) => {
            if (active)
                setIssueError(requestError instanceof Error ? requestError.message : 'Unable to load issues');
        })
            .finally(() => {
            if (active)
                setIsLoadingIssues(false);
        });
        return () => {
            active = false;
        };
    }, [queryString]);
    useEffect(() => {
        let active = true;
        fetch('/api/users')
            .then(async (response) => {
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Unable to load users');
            if (active)
                setUsers(data.users);
        })
            .catch((requestError) => {
            if (active)
                setUserError(requestError instanceof Error ? requestError.message : 'Unable to load users');
        })
            .finally(() => {
            if (active)
                setIsLoadingUsers(false);
        });
        return () => {
            active = false;
        };
    }, []);
    const hasFilters = Boolean(search || status || priority || assignedToId);
    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        setAssignedToId('');
        router.replace(pathname, { scroll: false });
    };
    return (_jsxs("div", { children: [_jsxs("section", { "aria-label": "Issue filters", className: "grid gap-3 border-b border-slate-200 pb-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(220px,2fr)_repeat(3,minmax(140px,1fr))_auto_auto]", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "issue-search", className: "mb-1.5 block text-xs font-semibold uppercase text-slate-600", children: "Search issues" }), _jsx("input", { id: "issue-search", type: "search", placeholder: "Search issues...", value: search, onChange: (event) => setSearch(event.target.value), className: controlClass })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "issue-status", className: "mb-1.5 block text-xs font-semibold uppercase text-slate-600", children: "Status" }), _jsxs("select", { id: "issue-status", value: status, onChange: (event) => setStatus(event.target.value), className: controlClass, children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "OPEN", children: "Open" }), _jsx("option", { value: "IN_PROGRESS", children: "In Progress" }), _jsx("option", { value: "CLOSED", children: "Closed" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "issue-priority", className: "mb-1.5 block text-xs font-semibold uppercase text-slate-600", children: "Priority" }), _jsxs("select", { id: "issue-priority", value: priority, onChange: (event) => setPriority(event.target.value), className: controlClass, children: [_jsx("option", { value: "", children: "All Priority" }), _jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "issue-assignee", className: "mb-1.5 block text-xs font-semibold uppercase text-slate-600", children: "Assigned To" }), _jsxs("select", { id: "issue-assignee", value: assignedToId, onChange: (event) => setAssignedToId(event.target.value), className: controlClass, disabled: isLoadingUsers, children: [_jsx("option", { value: "", children: isLoadingUsers ? 'Loading users...' : 'All Users' }), users.map((user) => _jsx("option", { value: user.id, children: user.name }, user.id))] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { type: "button", onClick: clearFilters, disabled: !hasFilters, className: "min-h-10 w-full rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto", children: "Clear Filters" }) }), _jsx("div", { className: "flex items-end", children: _jsx(Link, { href: "/issues/new", className: "inline-flex min-h-10 w-full items-center justify-center rounded-md bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 xl:w-auto", children: "Create Issue" }) })] }), userError && _jsx("p", { className: "mt-4 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800", role: "alert", children: userError }), isLoadingIssues ? (_jsx("p", { className: "py-12 text-center text-sm text-slate-600", role: "status", children: "Loading issues..." })) : issueError ? (_jsx("p", { className: "mt-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800", role: "alert", children: issueError })) : issues.length === 0 ? (_jsxs("div", { className: "py-14 text-center", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "No issues found." }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: hasFilters ? 'Try changing your search or filters.' : 'Create your first issue to get started.' }), hasFilters && _jsx("button", { type: "button", onClick: clearFilters, className: "mt-4 font-semibold text-teal-700 hover:underline", children: "Clear Filters" })] })) : (_jsx("div", { className: "mt-4", children: _jsx(IssueTable, { issues: issues }) }))] }));
}
