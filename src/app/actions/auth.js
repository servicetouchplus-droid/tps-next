'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    if (err.message?.includes('fetch failed') && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
        console.warn("DEV MODE: Supabase fetch failed (dummy URL). Bypassing auth.");
        const cookieStore = await cookies();
        cookieStore.set('dummy_auth', 'true', { path: '/' });
    } else {
        return { error: "Erreur de connexion au serveur d'authentification." };
    }
  }

  let redirectTo = '/dashboard/client';
  if (email) {
      try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser?.primaryRole === 'ADMIN') {
              redirectTo = '/dashboard/admin';
          }
      } catch (e) {
          console.error(e);
      }
  }

  redirect(redirectTo);
}

export async function registerAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');
  const phone = formData.get('phone');

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: 'CLIENT' }
      }
    });

    if (error) {
      return { error: error.message };
    }

    if (data?.user) {
        try {
          await prisma.user.create({
              data: {
                  id: data.user.id,
                  email: email,
                  name: name,
                  phone: phone,
                  primaryRole: 'CLIENT'
              }
          });
        } catch (dbError) {
            console.error("Prisma Error:", dbError);
        }
    }
  } catch (err) {
    if (err.message?.includes('fetch failed') && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
        console.warn("DEV MODE: Supabase fetch failed (dummy URL). Bypassing auth.");
        const cookieStore = await cookies();
        cookieStore.set('dummy_auth', 'true', { path: '/' });
    } else {
        return { error: "Erreur lors de l'inscription au service." };
    }
  }

  let redirectTo = '/dashboard/client';
  if (email) {
      try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser?.primaryRole === 'ADMIN') {
              redirectTo = '/dashboard/admin';
          }
      } catch (e) {
          console.error(e);
      }
  }

  redirect(redirectTo);
}

export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
