import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminFinancePage() {
  let orders = [];
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let pendingPaymentsCount = 0;
  let dbError = "";

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true
      }
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    orders.forEach(o => {
      if (o.paymentStatus === 'PAID') {
        const date = new Date(o.createdAt);
        if (date >= startOfToday) revenueToday += o.total;
        if (date >= startOfWeek) revenueWeek += o.total;
        if (date >= startOfMonth) revenueMonth += o.total;
      } else if (o.paymentStatus === 'UNPAID') {
        pendingPaymentsCount++;
      }
    });

  } catch (error) {
    console.error("Prisma error in admin finance page:", error);
    dbError = "Le module de facturation est indisponible actuellement.";
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {dbError && (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
          ⚠️ {dbError}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Finance & Facturation</h1>
        <p className="text-slate-500 dark:text-slate-400">Gérez la facturation, suivez l'encaissement du chiffre d'affaires et téléchargez les factures réglementaires.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 rounded-3xl p-6 border border-green-200 dark:border-green-800/30">
          <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-wider">Chiffre d'Affaires (Aujourd'hui)</p>
          <p className="text-3xl font-black text-green-900 dark:text-green-300 mt-2">{revenueToday.toLocaleString()} F</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">CA Encaissé (Semaine)</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{revenueWeek.toLocaleString()} F</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">CA Encaissé (Mois)</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{revenueMonth.toLocaleString()} F</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 rounded-3xl p-6 border border-red-200 dark:border-red-800/30">
          <p className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Factures en retard de paiement</p>
          <p className="text-3xl font-black text-red-900 dark:text-red-300 mt-2">{pendingPaymentsCount}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-black text-slate-900 dark:text-white text-lg">Journal des Règlements</h2>
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-850/80 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">
            📥 Exporter (CSV)
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Réf.</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Produits facturés</th>
                  <th className="px-6 py-4">Statut Paiement</th>
                  <th className="px-6 py-4">Montant TTC</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Facture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {orders.map(order => {
                  const firstItem = order.items?.[0];
                  const productName = firstItem?.productName || "Impression personnalisée";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-400">#{order.reference || order.id.substring(0,8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{order.user?.name || "Client"}</p>
                        <p className="text-xs text-slate-500">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{productName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'PAID' ? 'bg-green-150 text-green-700 dark:bg-green-950/20' : 'bg-red-150 text-red-700 dark:bg-red-950/20'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Payé' : 'Non réglé'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{order.total.toLocaleString()} F</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href={`/api/invoice/${order.id}`} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-block">
                          Télécharger PDF
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 font-bold">Aucune facture enregistrée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
