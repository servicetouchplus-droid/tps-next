const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating auto-confirm trigger for auth.users (email only)...");
  try {
    // 1. Create function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.auto_confirm_user()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.email_confirmed_at := now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // 2. Drop trigger if exists
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_before_created ON auth.users;
    `);

    // 3. Create trigger
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_before_created
        BEFORE INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
    `);

    console.log("Success! Auto-confirm trigger updated successfully.");
  } catch (error) {
    console.error("Failed to create trigger:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
