import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminClientsPage() {
  let clients = [];
  let dbError = "";

  try {
    clients = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: { select: { total: true, createdAt: true } },
        _count: { select: { orders: true } }
      }
    });
  } catch (e) {
    console.error("Prisma error in admin clients page:", e);
    dbError = "Impossible de charger la base de données clients.";
  }

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    CLIENT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="animate-fade-in-up pb-10">
      {dbError && (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200 mb-6">
          ⚠️ {dbError}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Gestion des Clients</h1>
          <p className="text-slate-500">Vue d'ensemble et segmentation de vos comptes B2B.</p>
        </div>
        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800/80 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">
          📥 Exporter la base (CSV)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Segment</th>
                  <th className="px-6 py-4">Dépenses Cumulées</th>
                  <th className="px-6 py-4">Commandes</th>
                  <th className="px-6 py-4">Activité (30j)</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {clients.map(client => {
                  // Calculate total spent
                  const totalSpent = client.orders?.reduce((acc, o) => acc + o.total, 0) || 0;
                  
                  // Segment: VIP if spent > 500,000 F
                  const isVIP = totalSpent > 500000;
                  
                  // Check if active in last 30 days
                  const hasRecentOrder = client.orders?.some(o => new Date(o.createdAt) >= thirtyDaysAgo);
                  const isInactive = client.orders?.length > 0 && !hasRecentOrder;

                  return (
                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                            {(client.name || client.email || 'U').substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{client.name || '—'}</p>
                            <p className="text-xs text-slate-400">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isVIP ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {isVIP ? '⭐ VIP' : 'Occasionnel'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{totalSpent.toLocaleString()} F</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-black text-sm rounded-lg">
                          {client._count.orders}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isInactive ? 'bg-red-50 text-red-650' : 'bg-green-50 text-green-650'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-red-500' : 'bg-green-500'}`}></span>
                          {isInactive ? 'Inactif' : 'Actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[client.primaryRole] || roleColors.CLIENT}`}>
                          {client.primaryRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/admin/clients/${client.id}`} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors inline-block">
                          Fiche Client →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400">Aucun client inscrit pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
