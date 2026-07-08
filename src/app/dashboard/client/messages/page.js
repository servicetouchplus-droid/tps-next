import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import ChatClient from './ChatClient';

export default async function ClientMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orders = [];
  let threads = [];
  let dbError = "";

  if (user) {
    try {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      });

      threads = await prisma.thread.findMany({
        where: { clientId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { lastMessageAt: 'desc' }
      });
    } catch (e) {
      console.error("Failed to load messages for client:", e);
      dbError = "Impossible de charger votre messagerie pour le moment.";
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <span className="inline-block px-3 py-1 bg-orange-550/10 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
          Centre d'échanges
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Messagerie Directe</h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm">
          Communiquez en temps réel avec nos conseillers techniques à propos de vos projets et BAT.
        </p>
      </div>

      {dbError ? (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
          ⚠️ {dbError}
        </div>
      ) : (
        <ChatClient 
          initialOrders={orders} 
          initialThreads={threads} 
          currentUserId={user?.id} 
        />
      )}
    </div>
  );
}
