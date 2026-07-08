import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const StatusConfig = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-450', dot: 'bg-yellow-450' },
  PAID: { label: 'Payé', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-400' },
  MOCKUP: { label: 'Maquette', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-400' },
  BAT: { label: 'BAT envoyé', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-450' },
  PRODUCTION: { label: 'En production', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', dot: 'bg-indigo-400' },
  SHIPPED: { label: 'Expédié', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400', dot: 'bg-cyan-400' },
  DELIVERED: { label: 'Livré', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-400' },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-400' },
};

const PriorityConfig = {
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 ring-red-500/20 font-black',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 ring-orange-500/20',
  NORMAL: 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 ring-blue-500/20',
  LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 ring-slate-500/20',
};

const StatusBadge = ({ status }) => {
  const cfg = StatusConfig[status] || StatusConfig.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
};

export default async function AdminOrdersPage(props) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams?.status || 'ALL';

  let allOrders = [];
  let dbErrorMsg = "";

  try {
    const where = {};
    if (statusFilter !== 'ALL') {
      where.status = statusFilter;
    }

    allOrders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true, email: true } },
        items: true,
        files: true,
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });
  } catch (err) {
    console.error("Failed to load admin orders from database:", err.message);
    dbErrorMsg = "Le pipeline de production est temporairement inaccessible.";
  }

  // Count groups for stat bar
  let counts = { PENDING: 0, MOCKUP: 0, PRODUCTION: 0, DELIVERED: 0 };
  try {
    const rawCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    });
    rawCounts.forEach(c => {
      if (c.status in counts) {
        counts[c.status] = c._count;
      }
    });
  } catch (e) {
    console.error(e);
  }

  const statuses = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'PENDING', label: 'En attente' },
    { key: 'MOCKUP', label: 'Maquette' },
    { key: 'BAT', label: 'BAT' },
    { key: 'PRODUCTION', label: 'Production' },
    { key: 'SHIPPED', label: 'Expédiées' },
    { key: 'DELIVERED', label: 'Livrées' },
    { key: 'CANCELLED', label: 'Annulées' }
  ];

  return (
    <div className="animate-fade-in-up pb-10">
      {dbErrorMsg && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ {dbErrorMsg}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Pipeline de Production</h1>
        <p className="text-slate-500">Gérez chaque commande de la réception à la livraison.</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['PENDING', 'MOCKUP', 'PRODUCTION', 'DELIVERED'].map(s => (
          <div key={s} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{StatusConfig[s].label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{counts[s]}</p>
          </div>
        ))}
      </div>

      {/* Filters selectors */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        {statuses.map(st => (
          <Link key={st.key} href={`/dashboard/admin/orders?status=${st.key}`} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === st.key ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
          }`}>
            {st.label}
          </Link>
        ))}
      </div>

      {/* Table complète */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-black text-slate-900 dark:text-white">Flux des commandes ({allOrders.length})</h2>
        </div>

        {allOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Réf.</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Spécifications</th>
                  <th className="px-6 py-4">Urg.</th>
                  <th className="px-6 py-4">Chef de projet</th>
                  <th className="px-6 py-4">Fichiers</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {allOrders.map(order => {
                  const firstItem = order.items?.[0];
                  const productName = firstItem?.productName || "Impression personnalisée";
                  const quantity = firstItem?.quantity || 1;
                  const sourceFile = order.files?.find(f => f.type === 'SOURCE');

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-mono font-bold text-slate-400">#{order.reference || order.id.substring(0, 8).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{order.user?.name || '—'}</p>
                        <p className="text-xs text-slate-400">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{productName}</p>
                        <p className="text-xs text-slate-400 font-medium">Qté: {quantity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wide ${PriorityConfig[order.priority] || PriorityConfig.NORMAL}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{order.assignedTo?.name || 'Non assigné'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {sourceFile ? (
                          <div className="flex flex-col gap-0.5">
                            <a href={sourceFile.url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-bold">
                              🔗 Fichier
                            </a>
                            {sourceFile.password && <span className="text-[9px] text-slate-400">MDP: {sourceFile.password}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {order.total > 0 ? `${order.total.toLocaleString()} F` : <span className="text-slate-400 text-xs">Sur devis</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/admin/orders/${order.id}`}
                          className="px-3 py-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-85 transition-opacity inline-block">
                          Gérer →
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
            <p className="text-slate-400">Aucune commande reçue pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
