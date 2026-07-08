import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Composant Timeline
const OrderTimeline = ({ status }) => {
  const steps = [
    { key: 'PENDING', label: 'En attente' },
    { key: 'MOCKUP', label: 'Maquette' },
    { key: 'PRODUCTION', label: 'Impression' },
    { key: 'DELIVERED', label: 'Livré' }
  ];

  const getStepIndex = (s) => {
    if (s === 'PENDING' || s === 'PAID') return 0;
    if (s === 'MOCKUP' || s === 'BAT') return 1;
    if (s === 'PRODUCTION' || s === 'SHIPPED') return 2;
    if (s === 'DELIVERED') return 3;
    return -1; // CANCELLED
  };

  const currentIndex = getStepIndex(status);

  if (currentIndex === -1) {
    return <div className="text-red-500 font-bold text-sm">Commande annulée</div>;
  }

  return (
    <div className="flex items-center w-full max-w-2xl mt-4">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {/* Ligne de connexion */}
            {idx !== 0 && (
              <div className={`absolute top-4 left-[-50%] w-full h-[2px] ${isCompleted || isActive ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            )}
            
            {/* Cercle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 border-4 ${
              isActive ? 'border-orange-100 dark:border-orange-900/30 bg-orange-500 text-white shadow-lg shadow-orange-500/40 animate-pulse' :
              isCompleted ? 'border-white dark:border-gray-800 bg-orange-500 text-white' :
              'border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 text-transparent'
            }`}>
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : isActive ? (
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              ) : null}
            </div>
            
            {/* Label */}
            <p className={`mt-3 text-xs font-bold text-center ${
              isActive ? 'text-orange-600 dark:text-orange-400' :
              isCompleted ? 'text-gray-900 dark:text-white' :
              'text-gray-400 dark:text-gray-500'
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default async function ClientOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let stats = { total: 0, pending: 0, completed: 0 };
  let recentOrders = [];
  let userName = "Client";
  let dbErrorMsg = "";

  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      userName = dbUser?.name || user.email?.split('@')[0] || "Client";
      
      recentOrders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
        take: 5
      });
      
      stats.total = await prisma.order.count({ where: { userId: user.id } });
      stats.pending = await prisma.order.count({ where: { userId: user.id, status: { in: ['PENDING', 'MOCKUP', 'BAT', 'PRODUCTION', 'SHIPPED'] } } });
      stats.completed = await prisma.order.count({ where: { userId: user.id, status: 'DELIVERED' } });
    } catch (err) {
      console.warn("Database unreachable or missing columns in client page.js:", err.message);
      dbErrorMsg = "Le service de suivi de commandes est en cours de synchronisation.";
      userName = user.email?.split('@')[0] || "Client";
      recentOrders = [];
      stats = { total: 0, pending: 0, completed: 0 };
    }
  }

  const activeOrder = recentOrders.find(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const activeProductName = activeOrder?.items?.[0]?.productName || "Impression personnalisée";

  return (
    <div className="space-y-8 animate-fade-in-up">
      {dbErrorMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ {dbErrorMsg}
        </div>
      )}
      
      {/* Hero Banner Premium */}
      <div className="relative overflow-hidden bg-gray-900 dark:bg-gray-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-500/40 via-amber-500/10 to-transparent rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            Espace Professionnel
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Bonjour, {userName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mb-8 font-medium">
            Développez votre marque avec des impressions haut de gamme. Suivez vos projets ou lancez une nouvelle production.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/client/new" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Nouveau Devis
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-500 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase">Toutes Commandes</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 rounded-3xl p-6 shadow-sm border border-orange-100 dark:border-orange-800/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase">Projets en cours</p>
          <p className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-1">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 rounded-3xl p-6 shadow-sm border border-green-100 dark:border-green-800/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 group">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase">Projets Terminés</p>
          <p className="text-4xl font-black text-green-600 dark:text-green-400 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Active Project Tracker */}
      {activeOrder && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Projet Actif</h2>
              <p className="text-sm text-gray-500 font-medium">Commande #{activeOrder.reference || activeOrder.id.substring(0,8).toUpperCase()} - {activeProductName}</p>
            </div>
            <Link href={`/dashboard/client/orders/${activeOrder.id}`} className="text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
              Voir détails
            </Link>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
             <OrderTimeline status={activeOrder.status} />
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Activité Récente</h2>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-8 py-4">Projet</th>
                  <th className="px-8 py-4">Statut</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {recentOrders.map(order => {
                  const pName = order.items?.[0]?.productName || "Impression personnalisée";
                  const qty = order.items?.[0]?.quantity || 1;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                      <td className="px-8 py-5">
                        <Link href={`/dashboard/client/orders/${order.id}`} className="text-sm font-black text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {pName}
                        </Link>
                        <p className="text-xs font-medium text-gray-500">#{order.reference || order.id.substring(0,8).toUpperCase()} • x{qty}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          ['DELIVERED', 'SHIPPED'].includes(order.status) ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          ['PENDING', 'PAID'].includes(order.status) ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {order.status === 'DELIVERED' ? 'Terminé' : order.status === 'PENDING' ? 'En attente' : 'En production'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-500 text-right">
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
            <p className="text-gray-500 font-medium mb-4">Aucune activité récente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
