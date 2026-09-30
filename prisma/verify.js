const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            _count: {
                select: {
                    createdIssues: true,
                    assignedIssues: true,
                    comments: true,
                },
            },
        },
    });
    const issues = await prisma.issue.findMany({
        include: {
            createdBy: { select: { name: true, email: true } },
            assignedTo: { select: { name: true, email: true } },
            comments: { select: { id: true, content: true } },
        },
    });
    const comments = await prisma.comment.findMany({
        include: {
            user: { select: { name: true } },
            issue: { select: { title: true } },
        },
    });
    console.log('=== DATABASE VERIFICATION ===');
    console.log(`Users count: ${users.length}`);
    users.forEach((u) => {
        console.log(` - ${u.name} (${u.email}) ` +
            `Created: ${u._count.createdIssues}, Assigned: ${u._count.assignedIssues}, Comments: ${u._count.comments}`);
    });
    console.log(`\nIssues count: ${issues.length}`);
    issues.forEach((i) => {
        console.log(` - [${i.status}] [${i.priority}] "${i.title}" (Created by: ${i.createdBy.name}, Assigned to: ${i.assignedTo?.name ?? 'Unassigned'}, Comments: ${i.comments.length})`);
    });
    console.log(`\nComments count: ${comments.length}`);
    comments.forEach((c) => {
        console.log(` - "${c.content}" by ${c.user.name} on "${c.issue.title}"`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
