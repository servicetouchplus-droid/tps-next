const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  console.log("Lecture de la liste des utilisateurs PostgreSQL...");
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        primaryRole: true,
        createdAt: true
      }
    });

    console.log(`\nTrouvé ${users.length} utilisateur(s) :`);
    users.forEach(u => {
      console.log(`- ID: ${u.id}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Nom: ${u.name}`);
      console.log(`  Rôle: ${u.primaryRole}`);
      console.log(`  Créé le: ${u.createdAt}`);
      console.log("-----------------------------------------");
    });

  } catch (error) {
    console.error("Erreur Prisma :", error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
