import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const getStatusBadge = (status) => {
  const map = {
    'PENDING': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350',
    'PAID': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30',
    'MOCKUP': 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30',
    'BAT': 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30',
    'PRODUCTION': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30',
    'SHIPPED': 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30',
    'DELIVERED': 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/30',
    'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30',
  };
  const labels = {
    'PENDING': 'Devis reçu',
    'PAID': 'Validé / Payé',
    'MOCKUP': 'Maquette',
    'BAT': 'BAT envoyé',
    'PRODUCTION': 'Impression',
    'SHIPPED': 'Expédié',
    'DELIVERED': 'Livré',
    'CANCELLED': 'Annulé',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {labels[status] || status}
    </span>
  );
};

export default async function AdminOverviewPage() {
  let totalOrders = 0;
  let pendingOrders = 0;
  let inProduction = 0;
  let totalClients = 0;
  let recentOrders = [];
  
  // KPIs
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let pendingQuotes = 0;
  
  // Alerts
  let criticalAlerts = [];

  try {
    totalOrders = await prisma.order.count();
    pendingOrders = await prisma.order.count({
      where: { status: { in: ['PENDING', 'PAID'] } }
    });
    inProduction = await prisma.order.count({
      where: { status: { in: ['MOCKUP', 'BAT', 'PRODUCTION'] } }
    });
    
    totalClients = await prisma.user.count({
      where: { primaryRole: 'CLIENT' }
    });

    pendingQuotes = await prisma.quote.count({
      where: { status: 'SENT' }
    });

    // Recent orders
    recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: true
      }
    });

    // Revenue calculations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: { total: true, createdAt: true }
    });

    paidOrders.forEach(o => {
      const date = new Date(o.createdAt);
      if (date >= startOfToday) revenueToday += o.total;
      if (date >= startOfWeek) revenueWeek += o.total;
      if (date >= startOfMonth) revenueMonth += o.total;
    });

    // Alert: expiring links under 48h
    const expLimit = new Date();
    expLimit.setDate(expLimit.getDate() + 2);
    const expiringFiles = await prisma.orderFile.findMany({
      where: {
        expiresAt: { gte: now, lte: expLimit }
      },
      include: { order: { include: { user: true } } }
    });

    expiringFiles.forEach(f => {
      criticalAlerts.push({
        type: 'FILE_EXPIRING',
        title: `Lien fichier expire bientôt (commande #${f.order.reference || f.order.id.substring(0,8).toUpperCase()})`,
        desc: `Le lien pour ${f.name} (client: ${f.order.user.name || f.order.user.email}) expire le ${new Date(f.expiresAt).toLocaleDateString('fr-FR')}.`,
        color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 border-amber-200'
      });
    });

    // Alert: BAT pending for > 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const pendingBatOrders = await prisma.order.findMany({
      where: {
        status: 'BAT',
        updatedAt: { lte: threeDaysAgo }
      },
      include: { user: true }
    });

    pendingBatOrders.forEach(o => {
      criticalAlerts.push({
        type: 'BAT_DELAY',
        title: `Relance BAT en attente (commande #${o.reference || o.id.substring(0,8).toUpperCase()})`,
        desc: `Le BAT a été envoyé il y a plus de 3 jours à ${o.user.name || o.user.email} sans réponse.`,
        color: 'text-red-700 bg-red-50 dark:bg-red-950/20 border-red-200'
      });
    });

    // Alert: Late orders (not delivered, expected delivery date exceeded)
    const lateOrders = await prisma.order.findMany({
      where: {
        status: { notIn: ['DELIVERED', 'CANCELLED'] },
        expectedDeliveryDate: { lte: now }
      },
      include: { user: true }
    });

    lateOrders.forEach(o => {
      criticalAlerts.push({
        type: 'LATE_ORDER',
        title: `Commande en retard (#${o.reference || o.id.substring(0,8).toUpperCase()})`,
        desc: `La date de livraison prévue était le ${new Date(o.expectedDeliveryDate).toLocaleDateString('fr-FR')}.`,
        color: 'text-red-700 bg-red-50 dark:bg-red-950/20 border-red-200'
      });
    });

  } catch (e) {
    console.error("Prisma error in admin overview page:", e);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Supervision Globale</h1>
          <p className="text-slate-500">Suivez l'activité commerciale, financière et l'atelier de production.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/dashboard/admin/atelier" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all hover:scale-105 shadow-sm shadow-indigo-650/20">
            📊 Atelier Kanban
          </Link>
          <Link href="/dashboard/admin/quotes" className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs transition-all hover:scale-105 shadow-sm shadow-amber-550/20">
            📥 Devis en attente ({pendingQuotes})
          </Link>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/10 dark:to-green-900/5 rounded-3xl p-6 border border-green-150 dark:border-green-900/30 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">CA d'aujourd'hui</p>
          <p className="text-3xl font-black text-green-950 dark:text-green-300 mt-2">{revenueToday.toLocaleString()} FCFA</p>
          <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold mt-3">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live du jour
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm group">
          <p className="text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest">Chiffre d'Affaires Hebdo</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{revenueWeek.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-slate-400 mt-3 font-semibold">Sur les 7 derniers jours</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm group">
          <p className="text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest">Chiffre d'Affaires Mensuel</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{revenueMonth.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-slate-400 mt-3 font-semibold">Sur les 30 derniers jours</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/10 dark:to-amber-900/5 rounded-3xl p-6 border border-amber-150 dark:border-amber-900/30 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Devis à chiffrer</p>
          <p className="text-3xl font-black text-amber-900 dark:text-amber-300 mt-2">{pendingQuotes}</p>
          <p className="text-[10px] text-amber-600 mt-3 font-semibold">Demandes de clients en attente</p>
        </div>
      </div>

      {/* Production metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Total Commandes</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Commandes Validées</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{pendingOrders}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest">En Impression</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{inProduction}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Clients Actifs (CRM)</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalClients}</p>
        </div>
      </div>

      {/* Alert Center */}
      {criticalAlerts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Centre d'Alertes Critiques ({criticalAlerts.length})
          </h2>
          <div className="space-y-4">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-2xl border text-sm font-bold flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${alert.color}`}>
                <div>
                  <p className="text-slate-900 dark:text-white font-black">{alert.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{alert.desc}</p>
                </div>
                <div>
                  {alert.type === 'FILE_EXPIRING' && (
                    <Link href="/dashboard/admin/orders" className="text-xs px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-sm font-black uppercase tracking-wider block text-center">
                      Relancer
                    </Link>
                  )}
                  {alert.type === 'BAT_DELAY' && (
                    <Link href="/dashboard/admin/orders" className="text-xs px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl transition-all shadow-sm font-black uppercase tracking-wider block text-center">
                      Relancer Client
                    </Link>
                  )}
                  {alert.type === 'LATE_ORDER' && (
                    <Link href="/dashboard/admin/orders" className="text-xs px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl transition-all shadow-sm font-black uppercase tracking-wider block text-center">
                      Inspecter
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Flux */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Flux Récent des Commandes</h2>
          <Link href="/dashboard/admin/orders" className="text-xs font-black text-indigo-650 hover:text-indigo-750 uppercase tracking-widest">Voir tout →</Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-8 py-4">Client</th>
                  <th className="px-8 py-4">Produit</th>
                  <th className="px-8 py-4">Statut</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                {recentOrders.map(order => {
                  const firstItem = order.items?.[0];
                  const productName = firstItem?.productName || "Commande personnalisée";
                  const quantity = firstItem?.quantity || 1;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                      <td className="px-8 py-5">
                        <Link href={`/dashboard/admin/orders/${order.id}`} className="text-sm font-black text-slate-900 dark:text-white hover:text-indigo-600">
                          {order.user?.name || "Client"}
                        </Link>
                        <p className="text-xs text-slate-450 mt-0.5">{order.user?.email}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{productName}</p>
                        <p className="text-xs text-slate-400">Quantité : x{quantity}</p>
                      </td>
                      <td className="px-8 py-5">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500 text-right">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 font-medium">Aucune commande pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
