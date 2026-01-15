import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('director2026', 10);
    const leadPassword = await bcrypt.hash('lead2026', 10);

    // Create Admin 1
    await prisma.user.upsert({
        where: { username: 'admin1' },
        update: {},
        create: {
            username: 'admin1',
            password: adminPassword,
            role: 'admin'
        },
    });

    // Create Admin 2
    await prisma.user.upsert({
        where: { username: 'admin2' },
        update: {},
        create: {
            username: 'admin2',
            password: adminPassword,
            role: 'admin'
        },
    });

    // Create a standard Lead
    await prisma.user.upsert({
        where: { username: 'dept_lead' },
        update: {},
        create: {
            username: 'dept_lead',
            password: leadPassword,
            role: 'lead'
        },
    });

    console.log("Database seeded: 2 Admins, 1 Lead.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
