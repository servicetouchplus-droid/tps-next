const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAuthUsers() {
  console.log("Lecture de la table interne auth.users de Supabase via SQL brut...");
  try {
    const authUsers = await prisma.$queryRawUnsafe(
      'SELECT id, email, created_at FROM auth.users'
    );

    console.log(`\nTrouvé ${authUsers.length} utilisateur(s) dans Supabase Auth :`);
    authUsers.forEach(u => {
      console.log(`- Email : ${u.email}`);
      console.log(`  Supabase Auth ID : ${u.id}`);
      console.log(`  Créé le : ${u.created_at}`);
      console.log("-----------------------------------------");
    });

  } catch (error) {
    console.error("Erreur lors de la lecture SQL :", error);
  } finally {
    await prisma.$disconnect();
  }
}

listAuthUsers();
