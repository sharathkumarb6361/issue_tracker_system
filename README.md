# Issue Tracker System

## Overview

Issue Tracker System is a full-stack application for creating, assigning, tracking, and commenting on team issues.

## Features

- User registration and login
- Secure JWT authentication with HTTP-only cookies
- Issue creation, editing, and deletion
- Assignment to registered users
- Status tracking and priority management
- Dashboard statistics and recent issues
- Case-insensitive search and database-backed filters
- Issue comments with author-only deletion
- Responsive interface for desktop, tablet, and mobile

## Technology Stack

- Next.js
- JavaScript (ES modules and JSX)
- Tailwind CSS
- PostgreSQL
- Prisma
- JWT (`jose`)
- `bcryptjs`
- Zod

## Project Structure

- `app/`: Next.js pages, loading/error boundaries, and API routes
- `components/`: Layout, dashboard, issue, comment, and UI components
- `lib/`: Prisma client, authentication helpers, and validation schemas
- `prisma/`: Database schema, migrations, and development seed script
- `types/`: Shared runtime Prisma enum exports
- `middleware.js`: Redirects unauthenticated users away from protected pages

## Prerequisites

- Node.js 20 LTS (Node.js 18.18 or newer)
- PostgreSQL
- npm

## Installation

```sh
git clone <repository-url>
cd <project-folder>
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and provide values for the local environment. Do not commit `.env`.

```dotenv
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/issue_tracker?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

Create the `issue_tracker` PostgreSQL database before applying migrations. Use a strong, unique `JWT_SECRET` outside development.

## Database Setup

```sh
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

The seed command is configured in `package.json` as `node prisma/seed.js`. It ensures the sample users, issues, and comments exist without deleting unrelated records. Seed data is for development/testing only.

## Development Server

```sh
npm run dev
```

Open <http://localhost:3000>.

## Production Build

```sh
npm run build
npm start
```

## Main Routes

- `/login`
- `/register`
- `/dashboard`
- `/issues`
- `/issues/new`
- `/issues/[id]`
- `/issues/[id]/edit`

## API Endpoints

All issue, user, and comment endpoints require authentication. Registration and login are public; logout clears the authentication cookie.

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users

- `GET /api/users`

### Issues

- `GET /api/issues` (supports `search`, `status`, `priority`, and `assignedToId` query parameters)
- `POST /api/issues`
- `GET /api/issues/[id]`
- `PUT /api/issues/[id]`
- `DELETE /api/issues/[id]`

### Comments

- `GET /api/issues/[id]/comments`
- `POST /api/issues/[id]/comments`
- `DELETE /api/comments/[commentId]` (the comment owner only)

## Development/Test Credentials

These accounts are created by the development seed. Run `npx prisma db seed` first. Do not use these credentials in a deployed environment.

| User | Email | Password |
| --- | --- | --- |
| Admin User | `admin@issuetracker.com` | `Admin@1234` |
| Developer User | `dev@issuetracker.com` | `Dev@1234` |
| Tester User | `tester@issuetracker.com` | `Tester@1234` |

## Git Preparation

`.gitignore` excludes `.env`, `.env.local`, `node_modules/`, and `.next/`. Before submitting, verify the repository status and ensure no local credentials are staged.

```sh
git status
git add .
git commit -m "Build issue tracker system"
git push
```