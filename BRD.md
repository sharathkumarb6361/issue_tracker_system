# Issue Tracker System Business Requirements Document

## 1. Purpose

Issue Tracker System provides a shared workspace for a team to report issues, assign ownership, track status and priority, and discuss work through comments.

## 2. Users and Scope

The system supports registered users. Authenticated users can view the dashboard and issues, create and update issues, assign issues to registered users, and add comments. A comment can only be deleted by its author. The application includes dashboard summaries, recent issues, search, and database-backed filters.

Out of scope: role management, notifications, attachments, rich-text editing, chat, and real-time collaboration.

## 3. Functional Requirements

- Register users with a unique email and hashed password; sign in and sign out using an HTTP-only JWT cookie.
- Restrict application pages and protected APIs to authenticated users.
- Create, read, update, and delete issues with title, description, status, priority, creator, and optional assignee.
- Support `OPEN`, `IN_PROGRESS`, and `CLOSED` statuses and `LOW`, `MEDIUM`, and `HIGH` priorities.
- Search issue title and description and combine search with status, priority, and assignee filters.
- Display database-derived dashboard counts and the five most recently created issues.
- Allow authenticated issue comments; restrict comment deletion to the author and cascade comments when their issue is deleted.

## 4. Non-Functional Requirements

- Validate user-controlled API data with Zod and use Prisma queries rather than handwritten SQL.
- Never return password hashes from APIs; keep JWT secrets and database credentials in environment variables.
- Provide a responsive, keyboard-usable interface with loading, error, and empty states.
- Use migrations to version and deploy database schema changes.

## 5. Architecture and Technology

- Next.js App Router with JavaScript/JSX for pages, middleware, and route handlers.
- React client components for interactive forms, filters, and comments.
- Tailwind CSS for responsive UI styling.
- Prisma ORM and PostgreSQL hosted by Supabase.
- JWT signing/verification with `jose`, password hashing with `bcryptjs`, and runtime validation with Zod.

## 6. Deployment

### Hosting and Services

- Application hosting: Vercel (Next.js production and preview deployments).
- Database: Supabase PostgreSQL.
- Source and deployment trigger: GitHub repository connected to Vercel.

### Deployment Approach

Vercel builds the Next.js application with `npm run build`. Production and preview environment variables are configured in Vercel rather than committed to source control. Prisma schema changes are applied with `npx prisma migrate deploy` using the Supabase session-pooler URL before the application release uses those changes. The application runtime uses the Supabase transaction-pooler URL.

### Required Configuration

- `DATABASE_URL`: Supabase transaction pooler, port `6543`, with `pgbouncer=true`.
- `DIRECT_URL`: Supabase session pooler, port `5432`, for Prisma migrations.
- `JWT_SECRET`: a strong, unique production secret.

All credentials must remain private and URL-reserved characters in database passwords must be percent-encoded in the connection URLs.

### Deploy or Update

1. Push the complete application source to GitHub and connect/import the repository in Vercel.
2. Configure the required variables for the intended Vercel environment.
3. Apply migrations with `npx prisma migrate deploy` from a trusted environment configured with production `DIRECT_URL`.
4. Deploy the production branch in Vercel, or use the Vercel CLI after authenticating and linking the project.
5. Verify the production login page and database-backed authenticated workflows.
6. For updates, commit and push changes; Vercel creates a preview for non-production branches and deploys the configured production branch.

### Deployment URL

Production URL: **Not deployed yet.** Record the Vercel Production URL here after the first successful deployment.

## 7. Acceptance Criteria

- Users can register, authenticate, and sign out; unauthenticated users cannot access protected routes/APIs.
- Authorized users can manage issues and assign them to registered users.
- Dashboard totals reflect persisted PostgreSQL records.
- Search and filters query the database and can be combined.
- Comment ownership is enforced and issue deletion removes associated comments.
- Production deployment can reach Supabase using configured secrets and successfully serve the application.