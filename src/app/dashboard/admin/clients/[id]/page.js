import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params;
  
  let client = null;
  try {
    client = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true }
        }
      }
    });
  } catch (e) {
    console.error("Prisma error in admin client detail page:", e);
  }

  if (!client) notFound();

  // Calculations
  const totalSpent = client.orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const isVIP = totalSpent > 500000;

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/admin/clients" className="hover:text-indigo-600 transition-colors">Clients</Link>
        <span>/</span>
        <span className="font-bold text-slate-900 dark:text-white">{client.name || client.email}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl text-white font-black text-3xl flex items-center justify-center mb-6">
              {(client.name || 'U').substring(0, 1).toUpperCase()}
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{client.name || 'Client B2B'}</h2>
            <p className="text-sm text-slate-500 mb-4">{client.email}</p>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-6 ${
              isVIP ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              {isVIP ? '⭐ Client VIP' : 'Client Occasionnel'}
            </span>

            <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6 text-sm">
              {client.company && (
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Entreprise</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{client.company} ({client.companyType || 'SARL'})</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Téléphone</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{client.phone}</p>
                </div>
              )}
              {client.address && (
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Adresse de facturation</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{client.address}, {client.city || ''} ({client.country || 'Côte d\'Ivoire'})</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Internes (Visual Mode) */}
          <div className="bg-slate-900/5 dark:bg-slate-900/40 rounded-3xl border border-slate-250 dark:border-slate-800 p-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">📝 Notes internes (Privé)</h3>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm">
              <p className="text-slate-600 dark:text-slate-300 font-medium italic">
                {client.bio || "Aucune note interne enregistrée sur ce client."}
              </p>
            </div>
          </div>
        </div>

        {/* History of Purchases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Historique d'achat ({client.orders?.length || 0} commandes)</h3>
            
            {client.orders && client.orders.length > 0 ? (
              <div className="space-y-4">
                {client.orders.map(order => {
                  const firstItem = order.items?.[0];
                  const productName = firstItem?.productName || "Impression personnalisée";
                  const quantity = firstItem?.quantity || 1;

                  return (
                    <div key={order.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-400">#{order.reference || order.id.substring(0,8).toUpperCase()}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{productName}</h4>
                        <p className="text-xs text-slate-500 font-medium">Qté: {quantity} • Date : {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{order.total.toLocaleString()} F</p>
                        <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xs text-indigo-600 font-bold hover:underline">Gérer la production →</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-450 italic text-sm">Ce client n'a pas encore passé de commande.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
