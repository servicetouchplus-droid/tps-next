import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import BatResponseClient from './BatResponseClient';
import ChatBox from './ChatBox';
import ResendLinkBox from './ResendLinkBox';
import { reprintOrderAction } from '@/app/actions/client';

const TIMELINE = [
  { status: 'PENDING', label: 'Devis / Commande reçue', icon: '📥' },
  { status: 'PAID', label: 'Validé / Payé', icon: '💳' },
  { status: 'MOCKUP', label: 'Maquette en préparation', icon: '🎨' },
  { status: 'BAT', label: 'Maquette à valider (BAT)', icon: '📋' },
  { status: 'PRODUCTION', label: 'Production / Impression', icon: '🏭' },
  { status: 'SHIPPED', label: 'Expédié / En livraison', icon: '🚚' },
  { status: 'DELIVERED', label: 'Livré', icon: '✅' },
];

const STATUS_ORDER = TIMELINE.map(t => t.status);

export default async function ClientOrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let order = null;
  let dbErrorMsg = "";

  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            user: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        files: true,
        items: true
      }
    });
  } catch (err) {
    console.error("Failed to load order from database:", err.message);
    dbErrorMsg = "Impossible de se connecter à la base de données. Les informations de suivi sont temporairement inaccessibles.";
  }

  if (dbErrorMsg && !order) {
    return (
      <div className="animate-fade-in-up pb-10 max-w-xl mx-auto text-center space-y-6 pt-12">
        <div className="text-5xl">📡</div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Service de Suivi Indisponible</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Nous n'arrivons pas à charger les détails de cette commande pour le moment. Notre service de base de données est temporairement inaccessible.
        </p>
        <Link href="/dashboard/client/orders" className="inline-block px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-xs hover:opacity-85 transition-opacity">
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  if (!order && !dbErrorMsg) notFound();
  if (order && order.userId !== user.id) notFound();

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  // File source checking
  const sourceFile = order.files.find(f => f.type === 'SOURCE' && f.status !== 'REJECTED') || null;

  async function handleReprint() {
    'use server';
    await reprintOrderAction(id);
  }

  const productName = order.items?.[0]?.productName || "Impression personnalisée";
  const quantity = order.items?.[0]?.quantity || 1;

  return (
    <div className="animate-fade-in-up pb-10 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Details & Timeline */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/client/orders" className="hover:text-orange-600 transition-colors">Mes Commandes</Link>
          <span>/</span>
          <span className="font-bold text-gray-900 dark:text-white">#{id.substring(0, 8).toUpperCase()}</span>
        </div>

        {/* Order Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-full">
                {order.reference || `TPS-${id.substring(0,8).toUpperCase()}`}
              </span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-2 mb-1">{productName}</h1>
              <p className="text-sm text-gray-500">Quantité : <span className="font-bold text-gray-800 dark:text-gray-200">{quantity}</span></p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {order.total > 0 ? `${order.total.toLocaleString()} FCFA` : 'Sur devis'}
              </p>
              <p className="text-xs text-gray-400">Créé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-750 flex flex-wrap gap-3">
            <form action={handleReprint}>
              <button type="submit" className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-xs hover:scale-105 transition-all shadow-sm">
                🔄 Recommander ce projet (Réimpression)
              </button>
            </form>
            
            {order.total > 0 && (
              <a href={`/api/invoice/${order.id}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-600 rounded-xl text-xs hover:bg-gray-50 transition-colors">
                📄 Facture PDF
              </a>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>📍</span> Suivi de votre commande
          </h2>
          <div className="relative border-l-2 border-gray-100 dark:border-gray-700 ml-4 pl-6 space-y-8">
            {TIMELINE.map((step, idx) => {
              const isDone = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={step.status} className="relative">
                  {/* Icon Bullet */}
                  <span className={`absolute -left-[35px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm transition-all ${
                    isCurrent ? 'bg-orange-500 text-white scale-110 ring-4 ring-orange-500/20' :
                    isDone ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 opacity-60'
                  }`}>
                    {step.icon}
                  </span>
                  <div>
                    <h3 className={`font-bold text-sm ${
                      isCurrent ? 'text-orange-600 dark:text-orange-400' :
                      isDone ? 'text-gray-950 dark:text-white' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <span className="inline-block mt-1 text-[9px] font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full animate-pulse">
                        ÉTAPE ACTUELLE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BAT Section */}
        {order.status === 'BAT' && order.mockupUrl && (
          <div className="shadow-sm">
            <BatResponseClient orderId={order.id} mockupUrl={order.mockupUrl} />
          </div>
        )}

        {/* Order Details / Files Attached */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 dark:text-white mb-4">📂 Fichiers fournis</h2>
          {sourceFile ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{sourceFile.name}</p>
                  <a href={sourceFile.url} target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline break-all">
                    {sourceFile.url}
                  </a>
                  {sourceFile.expiresAt && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">
                      ⚠️ Expire le : {new Date(sourceFile.expiresAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Resend link button */}
              <ResendLinkBox fileId={sourceFile.id} currentUrl={sourceFile.url} />
            </div>
          ) : order.attachedFileUrl ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Lien initial WeTransfer/Drive</p>
                  <a href={order.attachedFileUrl} target="_blank" rel="noreferrer" className="text-xs text-orange-500 hover:underline break-all">
                    {order.attachedFileUrl}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun fichier fourni pour le moment.</p>
          )}
        </div>

        {/* Client Notes */}
        {order.clientNotes && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-200 dark:border-amber-700/50 p-6 shadow-sm">
            <h3 className="font-black text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
              <span>📝</span> Description technique client
            </h3>
            <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed">{order.clientNotes}</p>
          </div>
        )}

      </div>

      {/* Right Column: Chat integration */}
      <div className="space-y-6">
        <ChatBox
          orderId={order.id}
          initialMessages={order.messages}
          currentUserId={user.id}
        />
      </div>

    </div>
  );
}
