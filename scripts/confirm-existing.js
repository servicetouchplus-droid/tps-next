const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Confirming existing users in auth.users (email only)...");
  try {
    const updatedCount = await prisma.$executeRawUnsafe(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email_confirmed_at IS NULL;
    `);
    console.log(`Success! Confirmed ${updatedCount} user(s).`);
  } catch (error) {
    console.error("Failed to confirm existing users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
