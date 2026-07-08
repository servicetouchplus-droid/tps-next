const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking B2B profile info for testuser@tps.com...");
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'testuser@tps.com' }
    });
    console.log("User details:", {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      company: user.company,
      companyType: user.companyType,
      taxId: user.taxId,
      address: user.address,
      city: user.city
    });
  } catch (error) {
    console.error("Prisma query failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
