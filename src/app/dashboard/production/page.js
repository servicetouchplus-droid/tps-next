import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function markShippedAction(formData) {
  'use server';
  const orderId = formData.get('orderId');
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED' }
    });
    revalidatePath('/dashboard/production');
  } catch (error) {
    console.error("Error marking shipped:", error);
  }
}

export default async function ProductionDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
  } catch (e) {
    console.error("Prisma error in production dashboard:", e);
  }

  // Sécuriser l'accès à l'équipe de production (Admin ou Staff)
  const isDatabaseOffline = !dbUser;
  const hasAdminRole = dbUser?.primaryRole === 'ADMIN' || (isDatabaseOffline && user.email?.includes('admin'));

  if (!hasAdminRole) {
      redirect('/dashboard/client');
  }

  // Récupérer uniquement les commandes prêtes pour la production
  let productionOrders = [];
  try {
    productionOrders = await prisma.order.findMany({
        where: { 
            status: {
                in: ['PRODUCTION', 'SHIPPED']
            }
        },
        include: { user: true, items: true, files: true },
        orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to load production orders:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <nav className="bg-slate-900 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
              <span className="text-lg font-black text-white">Atelier de Production</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin" className="text-sm font-bold text-slate-400 hover:text-white">Retour Admin</Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm font-bold text-white hover:text-red-400">Déconnexion</button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Workflow d'Impression</h1>
          <p className="text-slate-500">Marquez les commandes terminées pour expédition.</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {productionOrders.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {productionOrders.map((order) => {
                const firstItem = order.items?.[0];
                const productName = firstItem?.productName || "Impression personnalisée";
                const quantity = firstItem?.quantity || 1;
                const sourceFile = order.files?.find(f => f.type === 'SOURCE');
                const mockupFile = order.files?.find(f => f.type === 'MOCKUP' || f.type === 'APPROVED_BAT');

                return (
                  <li key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm font-mono font-bold text-slate-400">#{order.reference || order.id.substring(0,8).toUpperCase()}</p>
                        <p className="text-sm text-slate-500 font-bold mt-0.5">Client: {order.user.name || order.user.email}</p>
                        <p className="text-base font-black text-slate-800 dark:text-white mt-1">{productName} (x{quantity})</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          order.status === 'PRODUCTION' ? 'bg-yellow-100 text-yellow-850 dark:bg-yellow-950/20' : 'bg-green-150 text-green-700 dark:bg-green-950/20'
                        }`}>
                          {order.status === 'PRODUCTION' ? 'En Impression' : 'Expédiée'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Fichiers Techniques</h4>
                        <div className="flex gap-4">
                          {sourceFile ? (
                            <a href={sourceFile.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-650 hover:underline font-bold inline-flex items-center gap-1">
                              📥 Fichier Client {sourceFile.password ? `(MDP: ${sourceFile.password})` : ''}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Aucun fichier source</span>
                          )}
                          {order.mockupUrl ? (
                            <a href={order.mockupUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-650 hover:underline font-bold inline-flex items-center gap-1">
                              🎨 Maquette BAT
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Aucune maquette</span>
                          )}
                        </div>
                      </div>
                      
                      {order.status === 'PRODUCTION' && (
                        <form action={markShippedAction}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-sm transition-all hover:scale-105">
                            Marquer Expédiée
                          </button>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-16 text-center text-slate-400 font-bold">
              <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Aucune commande en production actuellement.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
