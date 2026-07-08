import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const StatusBadge = ({ status, isQuote = false }) => {
  const styles = {
    // Orders
    PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 ring-gray-500/20",
    PAID: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-blue-500/20",
    MOCKUP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-purple-500/20 animate-pulse",
    BAT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ring-yellow-500/20 animate-pulse",
    PRODUCTION: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 ring-orange-500/20",
    SHIPPED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 ring-indigo-500/20",
    DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-green-500/20",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-red-500/20",
    // Quotes
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 ring-gray-500/20",
    SENT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-450 ring-yellow-500/20",
    CONVERTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-green-500/20"
  };
  
  const labels = {
    PENDING: "En attente",
    PAID: "Payé",
    MOCKUP: "Maquette",
    BAT: "BAT envoyé",
    PRODUCTION: "En impression",
    SHIPPED: "Expédié",
    DELIVERED: "Livré",
    CANCELLED: "Annulé",
    DRAFT: "Brouillon",
    SENT: "Reçu / En chiffrage",
    CONVERTED: "Converti en commande"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ring-1 ring-inset ${styles[status] || styles.PENDING}`}>
      {status === 'MOCKUP' || status === 'BAT' || status === 'PRODUCTION' ? (
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      ) : null}
      {labels[status] || status}
    </span>
  );
};

export default async function ClientOrdersPage(props) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams?.tab || 'orders';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orders = [];
  let quotes = [];
  let dbErrorMsg = "";

  if (user) {
    try {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      });
      quotes = await prisma.quote.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      });
    } catch (err) {
      console.error("Failed to load orders/quotes from database:", err.message);
      dbErrorMsg = "Le service de suivi de commandes est en cours de synchronisation.";
    }
  }

  return (
    <div className="animate-fade-in-up pb-10">
      {dbErrorMsg && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ {dbErrorMsg}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Espace Pro
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Suivi d'activité</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Retrouvez toutes vos demandes de devis et commandes.</p>
        </div>
        <Link href="/dashboard/client/new" className="group px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          Nouveau Projet
        </Link>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-2">
        <Link href="/dashboard/client/orders?tab=orders" className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
          activeTab === 'orders' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}>
          Mes Commandes ({orders.length})
        </Link>
        <Link href="/dashboard/client/orders?tab=quotes" className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
          activeTab === 'quotes' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}>
          Demandes de Devis ({quotes.length})
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {activeTab === 'orders' ? (
          orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-[11px] uppercase tracking-wider text-gray-400 font-black">
                    <th className="px-8 py-5">Réf. Commande</th>
                    <th className="px-8 py-5">Détails Projet</th>
                    <th className="px-8 py-5">État d'avancement</th>
                    <th className="px-8 py-5">Total</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {orders.map(order => {
                    const firstItem = order.items?.[0];
                    const productName = firstItem?.productName || "Commande personnalisée";
                    const quantity = firstItem?.quantity || 1;

                    return (
                      <tr key={order.id} className="hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-colors group cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                             </div>
                             <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">#{order.reference || order.id.substring(0,8).toUpperCase()}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">{productName}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 dark:bg-gray-700 inline-block px-2 py-0.5 rounded-md">Quantité: {quantity}</p>
                        </td>
                        <td className="px-8 py-6">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {order.total > 0 ? `${order.total.toLocaleString()} FCFA` : <span className="text-gray-400 text-xs uppercase tracking-widest">Sur devis</span>}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                        </td>
                        <td className="px-8 py-6">
                           <Link href={`/dashboard/client/orders/${order.id}`}
                             className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-xl hover:opacity-80 transition-opacity whitespace-nowrap">
                             Voir le suivi →
                           </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24 px-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Aucune commande</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Vous n'avez pas de commande en cours de production.</p>
            </div>
          )
        ) : (
          quotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-[11px] uppercase tracking-wider text-gray-400 font-black">
                    <th className="px-8 py-5">Réf. Devis</th>
                    <th className="px-8 py-5">Détails Demande</th>
                    <th className="px-8 py-5">État d'avancement</th>
                    <th className="px-8 py-5">Prix Estimé</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {quotes.map(quote => {
                    const firstItem = quote.items?.[0];
                    const productName = firstItem?.productName || "Devis personnalisé";
                    const quantity = firstItem?.quantity || 1;

                    return (
                      <tr key={quote.id} className="hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">#{quote.reference}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">{productName}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 dark:bg-gray-700 inline-block px-2 py-0.5 rounded-md">Quantité: {quantity}</p>
                        </td>
                        <td className="px-8 py-6">
                          <StatusBadge status={quote.status} isQuote={true} />
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {quote.total > 0 ? `${quote.total.toLocaleString()} FCFA` : <span className="text-amber-600 dark:text-amber-400 text-xs uppercase tracking-widest font-black">En attente</span>}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24 px-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Aucun devis</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Vous n'avez soumis aucune demande de devis.</p>
              <Link href="/dashboard/client/new" className="inline-flex px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-orange-500/30">
                Demander un devis
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
