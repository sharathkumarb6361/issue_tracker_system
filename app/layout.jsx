import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
import { getCurrentUser } from '@/lib/auth';
import AppShell from '@/components/layout/AppShell';
export const metadata = {
    title: 'Issue Tracker',
    description: 'A clean and modern issue tracking system.',
};
export default async function RootLayout({ children, }) {
    const user = await getCurrentUser();
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: "min-h-screen bg-slate-50 text-slate-900 antialiased", children: _jsx(AppShell, { user: user ? { name: user.name, email: user.email } : null, children: children }) }) }));
}
