import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const rawUrl = process.env.DATABASE_URL || '';
  // Masquer le mot de passe dans l'URL pour la sécurité
  const safeUrl = rawUrl.replace(/:([^:@]+)@/, ':****@');

  let dbConnectionStatus = 'Checking...';
  let dbErrorDetail = null;
  let testQueryResults = null;

  try {
    // Tenter une requête de base
    const usersCount = await prisma.user.count();
    dbConnectionStatus = 'SUCCESS';
    testQueryResults = { usersCount };
  } catch (error) {
    dbConnectionStatus = 'FAILED';
    dbErrorDetail = {
      message: error.message,
      code: error.code,
      meta: error.meta
    };
  }

  return NextResponse.json({
    status: dbConnectionStatus,
    configuredDatabaseUrl: safeUrl,
    supabaseUrlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKeyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    error: dbErrorDetail,
    data: testQueryResults
  });
}
