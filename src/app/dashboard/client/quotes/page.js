import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import QuotesListClient from './QuotesListClient';

export default async function ClientQuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let quotes = [];
  let dbError = "";

  if (user) {
    try {
      quotes = await prisma.quote.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          files: true
        }
      });
    } catch (e) {
      console.error("Failed to load quotes for client:", e);
      dbError = "Impossible de récupérer vos devis pour le moment. Veuillez réessayer plus tard.";
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-orange-550/10 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            Demandes de Tarifs
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Mes Devis</h1>
          <p className="text-slate-505 dark:text-slate-400 text-sm">
            Retrouvez vos demandes de devis et validez les chiffrages proposés par l'administration.
          </p>
        </div>
        <Link 
          href="/dashboard/client/new" 
          className="px-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md shadow-orange-500/10"
        >
          ➕ Demander un devis
        </Link>
      </div>

      {dbError ? (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
          ⚠️ {dbError}
        </div>
      ) : (
        <QuotesListClient initialQuotes={quotes} />
      )}
    </div>
  );
}
