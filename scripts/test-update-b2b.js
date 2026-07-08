const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Simulating B2B profile update for testuser@tps.com...");
  try {
    const user = await prisma.user.update({
      where: { email: 'testuser@tps.com' },
      data: {
        company: 'Ivoire Impression SARL',
        companyType: 'SARL',
        taxId: 'CI-ABJ-2026-B-1234',
        address: 'Boulevard Valéry Giscard d\'Estaing, Zone 4',
        city: 'Abidjan',
        country: 'CI'
      }
    });
    console.log("Successfully updated user details:", {
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
    console.error("Prisma update failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
