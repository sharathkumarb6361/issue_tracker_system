'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
const controlClass = 'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700';
export default function IssueComments({ issueId, currentUserId, }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [confirmingComment, setConfirmingComment] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        let active = true;
        fetch(`/api/issues/${issueId}/comments`)
            .then(async (response) => {
            const data = (await response.json());
            if (!response.ok) {
                if (response.status === 401)
                    throw new Error('Your session has expired. Please sign in again.');
                if (response.status === 404)
                    throw new Error('This issue could not be found.');
                throw new Error(data.error || 'Unable to load comments right now.');
            }
            if (active)
                setComments(data.comments ?? []);
        })
            .catch((requestError) => {
            if (active) {
                setError(requestError instanceof Error ? requestError.message : 'Unable to load comments right now.');
            }
        })
            .finally(() => {
            if (active)
                setIsLoading(false);
        });
        return () => {
            active = false;
        };
    }, [issueId]);
    const addComment = async (event) => {
        event.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent || isAdding || deletingCommentId)
            return;
        setIsAdding(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/issues/${issueId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const data = (await response.json());
            if (!response.ok) {
                if (response.status === 401)
                    throw new Error('Your session has expired. Please sign in again.');
                if (response.status === 404)
                    throw new Error('This issue no longer exists.');
                if (response.status === 400) {
                    throw new Error(data.fieldErrors?.content?.[0] ?? 'Enter a comment between 1 and 1000 characters.');
                }
                throw new Error('Unable to add your comment right now. Please try again.');
            }
            if (!data.comment)
                throw new Error('Unable to add your comment right now. Please try again.');
            setComments((current) => [...current, data.comment]);
            setContent('');
            setSuccess('Comment added.');
        }
        catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to add your comment right now. Please try again.');
        }
        finally {
            setIsAdding(false);
        }
    };
    const deleteComment = async (commentId) => {
        if (isAdding || deletingCommentId)
            return;
        setDeletingCommentId(commentId);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
            if (!response.ok) {
                if (response.status === 401)
                    throw new Error('Your session has expired. Please sign in again.');
                if (response.status === 403)
                    throw new Error('You can only delete your own comments.');
                if (response.status === 404)
                    throw new Error('This comment is no longer available.');
                throw new Error('Unable to delete this comment right now. Please try again.');
            }
            setComments((current) => current.filter((comment) => comment.id !== commentId));
            setSuccess('Comment deleted.');
        }
        catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to delete this comment right now. Please try again.');
        }
        finally {
            setDeletingCommentId(null);
            setConfirmingComment(null);
        }
    };
    const isMutating = isAdding || deletingCommentId !== null;
    return (_jsxs("section", { "aria-labelledby": "comments-heading", className: "py-7", children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3 border-b border-slate-200 pb-3", children: [_jsx("h2", { id: "comments-heading", className: "text-lg font-semibold text-slate-900", children: "Comments" }), !isLoading && _jsx("span", { className: "text-sm text-slate-500", children: comments.length })] }), error && _jsx("p", { className: "mt-4 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800", role: "alert", children: error }), success && _jsx("p", { className: "mt-4 border-l-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-800", role: "status", children: success }), isLoading ? (_jsx("p", { className: "py-8 text-sm text-slate-600", role: "status", children: "Loading comments..." })) : comments.length === 0 && !error ? (_jsxs("div", { className: "py-8", children: [_jsx("p", { className: "text-sm font-medium text-slate-800", children: "No comments yet." }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Be the first to add a comment." })] })) : comments.length === 0 ? null : (_jsx("ul", { className: "divide-y divide-slate-200", children: comments.map((comment) => (_jsx("li", { className: "py-4", children: _jsxs("article", { className: "rounded-md border border-slate-200 bg-white p-4", children: [_jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: comment.user.name }), _jsx("time", { dateTime: comment.createdAt, className: "mt-0.5 block text-xs text-slate-500", children: new Intl.DateTimeFormat(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                }).format(new Date(comment.createdAt)) })] }), comment.userId === currentUserId && (_jsx("button", { type: "button", onClick: () => setConfirmingComment(comment), disabled: isMutating, className: "self-start text-sm font-medium text-rose-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50", children: deletingCommentId === comment.id ? 'Deleting...' : 'Delete' }))] }), _jsx("p", { className: "mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700", children: comment.content })] }) }, comment.id))) })), _jsxs("form", { onSubmit: addComment, className: "mt-3 border-t border-slate-200 pt-5", children: [_jsx("label", { htmlFor: "new-comment", className: "block text-sm font-semibold text-slate-900", children: "Add a comment" }), _jsx("textarea", { id: "new-comment", value: content, onChange: (event) => setContent(event.target.value), maxLength: 1000, rows: 4, "aria-describedby": "comment-character-count", className: `${controlClass} mt-2 min-h-28 resize-y`, placeholder: "Write a comment..." }), _jsxs("div", { className: "mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("span", { id: "comment-character-count", className: "text-xs tabular-nums text-slate-500", children: [content.length, " / 1000"] }), _jsx("button", { type: "submit", disabled: !content.trim() || isMutating, className: "inline-flex min-h-10 items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50", children: isAdding ? 'Adding...' : 'Add Comment' })] })] }), _jsx(ConfirmDialog, { isOpen: confirmingComment !== null, title: "Delete Comment?", description: "Are you sure you want to delete this comment? This action cannot be undone.", isPending: deletingCommentId !== null, onCancel: () => setConfirmingComment(null), onConfirm: () => confirmingComment ? deleteComment(confirmingComment.id) : undefined })] }));
}
