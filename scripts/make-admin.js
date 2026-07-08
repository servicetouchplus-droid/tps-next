const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Veuillez spécifier l'email de l'utilisateur à nommer administrateur.");
    console.error("Exemple: node scripts/make-admin.js user@example.com");
    process.exit(1);
  }

  console.log(`Recherche de l'utilisateur avec l'email: ${email}...`);
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`Erreur: Aucun utilisateur trouvé avec l'email "${email}".`);
      console.error("Assurez-vous que l'utilisateur s'est d'abord inscrit sur le site.");
      process.exit(1);
    }

    console.log(`Utilisateur trouvé: ${user.name || 'Sans nom'} (ID: ${user.id})`);
    console.log(`Rôle actuel: ${user.primaryRole}`);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { primaryRole: 'ADMIN' }
    });

    console.log(`Succès! L'utilisateur ${email} a été promu ADMINISTRATEUR.`);
    console.log(`Nouveau rôle: ${updatedUser.primaryRole}`);

  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
