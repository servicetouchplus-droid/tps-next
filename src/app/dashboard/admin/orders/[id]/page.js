import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderDetailClient from './OrderDetailClient';

const StatusConfig = {
  PENDING: { label: 'En attente', color: 'text-yellow-600' },
  PAID: { label: 'Payé', color: 'text-blue-600' },
  MOCKUP: { label: 'Maquette', color: 'text-purple-600' },
  BAT: { label: 'BAT envoyé', color: 'text-orange-600' },
  PRODUCTION: { label: 'En production', color: 'text-indigo-600' },
  SHIPPED: { label: 'Expédié', color: 'text-cyan-600' },
  DELIVERED: { label: 'Livré', color: 'text-green-600' },
  CANCELLED: { label: 'Annulé', color: 'text-red-600' },
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  
  let order = null;
  let adminUsers = [];

  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, items: true, files: true }
    });

    adminUsers = await prisma.user.findMany({
      where: { primaryRole: 'ADMIN' },
      select: { id: true, name: true, email: true }
    });
  } catch (e) {
    console.error("Prisma error loading order details:", e);
  }

  if (!order) notFound();

  const cfg = StatusConfig[order.status] || StatusConfig.PENDING;
  const firstItem = order.items?.[0];
  const productName = firstItem?.productName || "Commande personnalisée";
  const quantity = firstItem?.quantity || 1;

  return (
    <div className="animate-fade-in-up pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/dashboard/admin/orders" className="hover:text-indigo-600 transition-colors">Commandes</Link>
        <span>/</span>
        <span className="font-bold text-slate-900 dark:text-white">#{id.substring(0, 8).toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Infos */}
        <div className="lg:col-span-1 space-y-6">
          {/* Client */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Client</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white font-black flex items-center justify-center text-lg">
                {(order.user?.name || 'C').substring(0, 1)}
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{order.user?.name || '—'}</p>
                <p className="text-sm text-slate-500">{order.user?.email}</p>
              </div>
            </div>
            {order.user?.phone && <p className="text-sm text-slate-600 dark:text-slate-400">📞 {order.user.phone}</p>}
          </div>

          {/* Détails Commande */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Détails</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Produit</p>
                <p className="font-bold text-slate-900 dark:text-white">{productName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Quantité</p>
                <p className="font-bold text-slate-900 dark:text-white">{quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Montant</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.total > 0 ? `${order.total.toLocaleString()} FCFA` : 'Sur devis'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Statut actuel</p>
                <p className={`font-black ${cfg.color}`}>{cfg.label}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Date</p>
                <p className="font-bold text-slate-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Notes client */}
          {order.clientNotes && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
              <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">📝 Notes du client</h3>
              <p className="text-sm text-amber-900 dark:text-amber-200">{order.clientNotes}</p>
            </div>
          )}

          {/* Fichiers client */}
          {order.files && order.files.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">📎 Fichiers client</h3>
              <div className="space-y-2">
                {order.files.map(file => (
                  <a key={file.id} href={file.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 transition-colors group">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 truncate">{file.name}</p>
                      <p className="text-xs text-indigo-500 truncate">{file.url} {file.password ? `(MDP: ${file.password})` : ''}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Actions */}
        <div className="lg:col-span-2">
          <OrderDetailClient order={order} adminUsers={adminUsers} />
        </div>
      </div>
    </div>
  );
}
