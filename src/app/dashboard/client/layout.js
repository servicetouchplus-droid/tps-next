import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function ClientDashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = "Client Pro";
  let userInitials = "CP";
  let expiringCount = 0;
  
  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
      userName = dbUser?.name || user.email?.split('@')[0] || "Client Pro";
      userInitials = userName.substring(0,2).toUpperCase();

      // Check files expiring soon
      const now = new Date();
      const inTwoDays = new Date();
      inTwoDays.setDate(inTwoDays.getDate() + 2);
      
      // We check expiringCount safely in case expiresAt column doesn't exist yet on remote db
      expiringCount = await prisma.orderFile.count({
        where: {
          order: { userId: user.id },
          expiresAt: { gte: now, lte: inTwoDays },
          status: { not: 'REJECTED' }
        }
      });
    } catch (dbError) {
      console.warn("Database unreachable or schema not fully updated in layout:", dbError.message);
      // Fallbacks
      userName = user.email?.split('@')[0] || "Client Pro";
      userInitials = userName.substring(0,2).toUpperCase();
      expiringCount = 0;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col md:flex-row font-sans selection:bg-orange-500/30">
      
      {/* Sidebar - Premium Glassmorphism */}
      <aside className="w-full md:w-[280px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-r border-white/20 dark:border-gray-800 flex flex-col flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        
        {/* Logo Section */}
        <div className="p-8 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-all duration-300">
              T+
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900 dark:text-white">
              Touch<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">+</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-6 flex-1 overflow-y-auto">
          <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-2">Espace Pro</p>
          <nav className="space-y-2">
            <Link href="/dashboard/client" className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              Vue d'ensemble
            </Link>

            <Link href="/dashboard/client/new" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all relative">
              <div className="absolute right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              Nouveau Devis
            </Link>

            <Link href="/dashboard/client/quotes" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              Mes Devis
            </Link>

            <Link href="/dashboard/client/orders" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
              Mes Commandes
            </Link>

            <Link href="/dashboard/client/invoices" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              Mes Factures
            </Link>

            <Link href="/dashboard/client/files" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all relative">
              {expiringCount > 0 && (
                <div className="absolute right-4 bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md animate-pulse">
                  {expiringCount}
                </div>
              )}
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              Mes Fichiers
            </Link>

            <Link href="/dashboard/client/messages" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-305 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              Messagerie
            </Link>

            <Link href="/dashboard/client/profile" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-350 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              Mon Profil
            </Link>

            <Link href="/dashboard/client/help" className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-350 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 hover:shadow-sm transition-all">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-750 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 text-gray-500 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              Aide & FAQ
            </Link>
          </nav>

          {/* VIP Support Banner */}
          <div className="mt-6 mx-2 p-5 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl relative overflow-hidden shadow-xl shadow-gray-900/10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            <h4 className="text-white font-black text-sm mb-1 relative z-10">Besoin d'aide VIP ?</h4>
            <p className="text-gray-400 text-xs font-medium mb-3 relative z-10">Votre conseiller dédié est disponible.</p>
            <Link href="/dashboard/client/help" className="inline-block w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl text-center backdrop-blur-sm transition-colors relative z-10">
              Contacter le support
            </Link>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 p-2">
               <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner">
                  {userInitials}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-black text-gray-900 dark:text-white truncate">{userName}</p>
                 <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Compte B2B</p>
               </div>
            </div>
            <form action={logoutAction} className="mt-2">
              <button type="submit" className="w-full py-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-red-50 text-gray-500 hover:text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header / Nav */}
        <header className="h-20 px-8 flex items-center justify-between bg-transparent backdrop-blur-md sticky top-0 z-10">
           <div className="hidden md:block">
              {/* Breadcrumb or Search could go here */}
           </div>
           
           {/* Mobile Menu Trigger & Logo */}
           <div className="md:hidden flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30">
                T+
             </div>
             <span className="font-black text-lg text-gray-900 dark:text-white">Touch+ Pro</span>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>
           </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 pb-20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
