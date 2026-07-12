const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'famien.kouassii@gmail.com';
  console.log(`Diagnostic pour ${email}...`);
  
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!dbUser) {
      console.log("❌ Utilisateur NON TROUVÉ dans la base de données PostgreSQL (Prisma).");
      return;
    }
    
    console.log(`✅ Utilisateur trouvé dans PostgreSQL :`);
    console.log(`   - ID : ${dbUser.id}`);
    console.log(`   - Rôle : ${dbUser.primaryRole}`);
    console.log(`   - Nom : ${dbUser.name}`);

  } catch (e) {
    console.error("Erreur lors de la lecture PostgreSQL :", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
