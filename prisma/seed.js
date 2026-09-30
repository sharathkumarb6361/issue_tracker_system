const { PrismaClient, Status, Priority } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function ensureIssue(data) {
    const existingIssue = await prisma.issue.findFirst({
        where: { title: data.title, createdById: data.createdById },
    });
    return existingIssue ?? prisma.issue.create({ data });
}
async function ensureComment(data) {
    const existingComment = await prisma.comment.findFirst({ where: data, select: { id: true } });
    if (!existingComment)
        await prisma.comment.create({ data });
}
async function main() {
    console.log('Seeding database...');
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@1234', salt);
    const devPassword = await bcrypt.hash('Dev@1234', salt);
    const testerPassword = await bcrypt.hash('Tester@1234', salt);
    // 1. Create or upsert Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@issuetracker.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@issuetracker.com',
            password: adminPassword,
        },
    });
    const developer = await prisma.user.upsert({
        where: { email: 'dev@issuetracker.com' },
        update: {},
        create: {
            name: 'Developer User',
            email: 'dev@issuetracker.com',
            password: devPassword,
        },
    });
    const tester = await prisma.user.upsert({
        where: { email: 'tester@issuetracker.com' },
        update: {},
        create: {
            name: 'Tester User',
            email: 'tester@issuetracker.com',
            password: testerPassword,
        },
    });
    console.log('Created users:', {
        admin: admin.email,
        developer: developer.email,
        tester: tester.email,
    });
    const issue1 = await ensureIssue({
        title: 'Fix 500 error on user profile update',
        description: 'When updating profile without avatar image, server returns 500 Internal Server Error.',
        status: Status.OPEN,
        priority: Priority.HIGH,
        createdById: tester.id,
        assignedToId: developer.id,
    });
    const issue2 = await ensureIssue({
        title: 'Implement Dark Mode theme toggle',
        description: 'Add a dark mode theme toggle switch in the navigation bar using Tailwind dark class.',
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        createdById: admin.id,
        assignedToId: developer.id,
    });
    const issue3 = await ensureIssue({
        title: 'Database connection pooling configuration',
        description: 'Optimize PostgreSQL connection pool parameters for high concurrency handling in production.',
        status: Status.CLOSED,
        priority: Priority.LOW,
        createdById: developer.id,
        assignedToId: admin.id,
    });
    const issue4 = await ensureIssue({
        title: 'Security vulnerability in package dependencies',
        description: 'Audit dependencies and update transitive packages to patch reported CVE vulnerabilities.',
        status: Status.OPEN,
        priority: Priority.HIGH,
        createdById: admin.id,
        assignedToId: tester.id,
    });
    console.log('Ensured 4 sample issues');
    await Promise.all([
        ensureComment({
            content: 'I reproduced this error on Chrome and Firefox. Log trace attached.',
            issueId: issue1.id,
            userId: tester.id,
        }),
        ensureComment({
            content: 'Investigating now. Looks like the avatar null check is missing in the controller.',
            issueId: issue1.id,
            userId: developer.id,
        }),
        ensureComment({
            content: 'Initial UI components are ready. Next step is persisting preference in local storage.',
            issueId: issue2.id,
            userId: developer.id,
        }),
        ensureComment({
            content: 'Connection pooling verified and benchmarks look solid. Closing this task.',
            issueId: issue3.id,
            userId: admin.id,
        }),
        ensureComment({
            content: 'Running automated vulnerability scan on the updated lockfile.',
            issueId: issue4.id,
            userId: tester.id,
        }),
    ]);
    console.log('Ensured sample comments');
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
