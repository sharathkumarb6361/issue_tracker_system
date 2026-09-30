'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/button';
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestedDestination = searchParams.get('from') ?? '';
    const isProtectedDestination = requestedDestination === '/dashboard' ||
        requestedDestination.startsWith('/dashboard/') ||
        requestedDestination === '/issues' ||
        requestedDestination.startsWith('/issues/');
    const from = isProtectedDestination && !requestedDestination.startsWith('//') && !requestedDestination.includes('\\')
        ? requestedDestination
        : '/dashboard';
    const registered = searchParams.get('registered');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        // Clear errors on change
        if (fieldErrors[e.target.name]) {
            setFieldErrors((prev) => {
                const updated = { ...prev };
                delete updated[e.target.name];
                return updated;
            });
        }
        setErrorMessage(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setFieldErrors({});
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.error || 'Login failed. Please check your credentials.');
                if (data.fieldErrors) {
                    setFieldErrors(data.fieldErrors);
                }
                setIsLoading(false);
                return;
            }
            // Successful login
            router.push(from);
            router.refresh();
        }
        catch {
            setErrorMessage('A network error occurred. Please try again.');
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "w-full max-w-md space-y-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-7", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-center text-2xl font-semibold text-slate-950 sm:text-3xl", children: "Sign in to Issue Tracker" }), _jsxs("p", { className: "mt-2 text-center text-sm text-slate-600", children: ["Or", ' ', _jsx(Link, { href: "/register", className: "font-medium text-teal-600 hover:text-teal-500 underline", children: "create a new account" })] })] }), registered && (_jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800", role: "status", children: "Account created successfully! Please sign in with your credentials." })), errorMessage && (_jsx("div", { className: "rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800", role: "alert", children: errorMessage })), _jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-slate-700", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: formData.email, onChange: handleChange, className: "mt-1 block min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700", placeholder: "developer@issuetracker.com" }), fieldErrors.email && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: fieldErrors.email[0] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-slate-700", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, value: formData.password, onChange: handleChange, className: "mt-1 block min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), fieldErrors.password && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: fieldErrors.password[0] }))] })] }), _jsx("div", { children: _jsx(Button, { type: "submit", variant: "primary", size: "lg", className: "w-full flex justify-center py-2.5", disabled: isLoading, children: isLoading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsxs("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })] }), "Logging in..."] })) : ('Sign In') }) })] })] }) }));
}
export default function LoginPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "flex-1 flex items-center justify-center text-sm text-slate-600", role: "status", children: "Loading sign-in form..." }), children: _jsx(LoginForm, {}) }));
}
