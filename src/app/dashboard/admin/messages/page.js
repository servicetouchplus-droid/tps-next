import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AdminChatClient from './AdminChatClient';

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify role
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.primaryRole !== 'ADMIN') {
    redirect('/dashboard/client');
  }

  let threads = [];
  let dbError = "";

  try {
    threads = await prisma.thread.findMany({
      include: {
        client: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  } catch (e) {
    console.error("Failed to load threads for admin:", e);
    dbError = "Erreur de chargement de la messagerie.";
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Messagerie Client</h1>
        <p className="text-slate-500">
          Échangez avec vos clients à propos de leurs BAT, maquettes et questions techniques.
        </p>
      </div>

      {dbError ? (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 rounded-2xl text-sm font-bold">
          ⚠️ {dbError}
        </div>
      ) : (
        <AdminChatClient initialThreads={threads} currentUserId={user.id} />
      )}
    </div>
  );
}
