import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Met à jour TOUS les utilisateurs existants pour leur donner le rôle ADMIN
  const result = await prisma.user.updateMany({
    data: { role: 'ADMIN' }
  });
  console.log(`Mis à jour avec succès : ${result.count} utilisateur(s) sont maintenant ADMIN !`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
