import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';
import AddressManager from './AddressManager';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let dbUser = null;
  let dbErrorMsg = "";

  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: true,
        orders: {
          where: { total: { gt: 0 } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (err) {
    console.error("Failed to load profile data from database:", err.message);
    dbErrorMsg = "Le carnet d'adresses ou les factures ne peuvent pas être chargés car le service est en cours de synchronisation.";
    // Mock user if DB fails so form loads
    dbUser = {
      name: user.email?.split('@')[0] || "Client Pro",
      phone: "",
      addresses: [],
      orders: []
    };
  }

  const initials = (dbUser?.name || user.email || 'U').substring(0, 2).toUpperCase();

  return (
    <div className="animate-fade-in-up pb-10 max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Mon Espace
        </span>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles, vos adresses et téléchargez vos factures.</p>
      </div>

      {/* Error Alert if any */}
      {dbErrorMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ {dbErrorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Details & General Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar & Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30 flex-shrink-0">
              {initials}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="font-black text-xl text-gray-900 dark:text-white">{dbUser?.name || 'Votre Nom / Entreprise'}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span className="px-2.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                  Compte B2B
                </span>
                {dbUser?.company && (
                  <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full">
                    🏭 {dbUser.company}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>👤</span> Informations personnelles
            </h3>
            <ProfileForm user={dbUser || { name: '', phone: '' }} />
          </div>

          {/* Multi-address Manager (F8) */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>📍</span> Carnet d'adresses de livraison
            </h3>
            <AddressManager initialAddresses={dbUser?.addresses || []} />
          </div>
        </div>

        {/* Right Side: Invoice PDF history (F9) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📄</span> Mes Factures PDF
            </h3>
            <p className="text-xs text-gray-500 mb-4">Téléchargez vos reçus et factures d'impression au format PDF.</p>
            
            {dbUser?.orders?.length > 0 ? (
              <div className="space-y-3">
                {dbUser.orders.map(order => (
                  <div key={order.id} className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{order.product}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Ref: {order.reference || order.id.substring(0,8).toUpperCase()}
                      </p>
                    </div>
                    <a
                      href={`/api/invoice/${order.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-[10px] flex-shrink-0 transition-colors"
                    >
                      Télécharger
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">Aucune facture disponible pour le moment.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
