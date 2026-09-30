'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
export default function LogoutButton({ variant = 'outline', size = 'md', className = '', }) {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            router.push('/login');
            router.refresh();
        }
        catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };
    return (_jsx(Button, { variant: variant, size: size, className: className, onClick: handleLogout, disabled: isLoggingOut, children: isLoggingOut ? 'Logging out...' : 'Logout' }));
}
