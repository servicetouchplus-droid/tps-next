const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database...");
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log("Success! Found users:", users.map(u => ({ id: u.id, email: u.email, name: u.name, primaryRole: u.primaryRole })));
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
