import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ClientInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orders = [];
  let dbError = "";

  if (user) {
    try {
      orders = await prisma.order.findMany({
        where: { 
          userId: user.id,
          total: { gt: 0 }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.error("Failed to load invoices for client:", e);
      dbError = "Impossible de récupérer vos factures pour le moment.";
    }
  }

  // Calculate stats
  const totalInvoiced = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPaid = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalDue = Math.max(0, totalInvoiced - totalPaid);

  const getPaymentBadge = (status) => {
    const map = {
      UNPAID: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50",
      PARTIAL: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50",
      PAID: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50",
      REFUNDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    };
    const labels = {
      UNPAID: "En attente de paiement",
      PARTIAL: "Règlement partiel",
      PAID: "Payé",
      REFUNDED: "Remboursé"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${map[status] || 'bg-slate-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <span className="inline-block px-3 py-1 bg-indigo-550/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
          Suivi Comptable
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Mes Factures</h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm">
          Consultez vos transactions, l'état de vos règlements et téléchargez vos factures au format PDF.
        </p>
      </div>

      {dbError ? (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
          ⚠️ {dbError}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Facturé</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalInvoiced.toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/10 dark:to-green-900/5 rounded-3xl border border-green-150 dark:border-green-900/30 p-6 shadow-sm">
              <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Montant Réglé</p>
              <p className="text-2xl font-black text-green-950 dark:text-green-300 mt-1">
                {totalPaid.toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/10 dark:to-amber-900/5 rounded-3xl border border-amber-150 dark:border-amber-900/30 p-6 shadow-sm">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Reste à régler</p>
              <p className="text-2xl font-black text-amber-950 dark:text-amber-300 mt-1">
                {totalDue.toLocaleString()} FCFA
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 dark:border-slate-750">
                      <th className="px-8 py-4">Facture Réf</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Total</th>
                      <th className="px-8 py-4">Statut</th>
                      <th className="px-8 py-4 text-right">Télécharger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                        <td className="px-8 py-5">
                          <Link href={`/dashboard/client/orders/${order.id}`} className="text-sm font-black text-slate-900 dark:text-white hover:text-orange-500">
                            #{order.reference || order.id.substring(0,8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-slate-800 dark:text-slate-200">
                          {order.total.toLocaleString()} FCFA
                        </td>
                        <td className="px-8 py-5">
                          {getPaymentBadge(order.paymentStatus)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <a 
                            href={`/api/invoice/${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-black text-indigo-650 dark:text-indigo-400 hover:underline hover:scale-102 transition-all"
                          >
                            ⬇ PDF Facture
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-4xl block mb-3">🧾</span>
                <p className="text-slate-500 dark:text-slate-400 font-bold">Aucune facture enregistrée.</p>
                <p className="text-xs text-slate-400 mt-1">Vos factures apparaissent ici dès validation de commande.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
