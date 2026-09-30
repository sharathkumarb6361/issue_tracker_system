import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
    const baseStyles = 'inline-flex min-h-10 items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const variants = {
        primary: 'bg-teal-800 text-white hover:bg-teal-900 focus-visible:ring-teal-700',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-700',
        outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-teal-700',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500',
    };
    const sizes = {
        sm: 'px-3 text-sm',
        md: 'px-4 text-sm',
        lg: 'px-6 text-base',
    };
    return (_jsx("button", { className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`, ...props, children: children }));
};
export default Button;
