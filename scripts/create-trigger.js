const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Creating auto-sync trigger for auth.users -> public.User...");
  try {
    // 1. Create function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public."User" (id, email, name, phone, "primaryRole", "createdAt", "updatedAt")
        VALUES (
          new.id,
          new.email,
          COALESCE(new.raw_user_meta_data->>'name', ''),
          COALESCE(new.raw_user_meta_data->>'phone', ''),
          'CLIENT',
          now(),
          now()
        )
        ON CONFLICT (id) DO UPDATE
        SET
          email = EXCLUDED.email,
          name = CASE WHEN public."User".name IS NULL OR public."User".name = '' THEN EXCLUDED.name ELSE public."User".name END,
          phone = CASE WHEN public."User".phone IS NULL OR public."User".phone = '' THEN EXCLUDED.phone ELSE public."User".phone END;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // 2. Drop trigger if exists
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);

    // 3. Create trigger
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

    console.log("Success! Trigger created successfully.");
  } catch (error) {
    console.error("Failed to create trigger:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
