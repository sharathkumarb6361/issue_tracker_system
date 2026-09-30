import { z } from 'zod';
const issueFields = {
    title: z.string().trim().min(3, 'Title must be at least 3 characters'),
    description: z.string().trim().min(1, 'Description is required'),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    assignedToId: z.string().min(1, 'Select an assigned user'),
};
export const createIssueSchema = z.object({
    ...issueFields,
    status: issueFields.status.default('OPEN'),
    priority: issueFields.priority.default('MEDIUM'),
});
export const updateIssueSchema = z.object(issueFields);
