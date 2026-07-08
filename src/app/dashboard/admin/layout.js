import Link from 'next/link';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

const navItems = [
  { href: '/dashboard/admin', label: 'Vue d\'ensemble', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', section: 'Gestion Centrale' },
  { href: '/dashboard/admin/quotes', label: 'Devis en attente', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', section: 'Gestion Centrale' },
  { href: '/dashboard/admin/orders', label: 'Commandes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', section: 'Gestion Centrale' },
  
  { href: '/dashboard/admin/atelier', label: 'Atelier / Production', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', section: 'Production & Finance' },
  { href: '/dashboard/admin/finance', label: 'Finance & Règlements', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', section: 'Production & Finance' },
  
  { href: '/dashboard/admin/clients', label: 'Clients (CRM)', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', section: 'CRM & Équipe' },
  { href: '/dashboard/admin/messages', label: 'Messagerie Client', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', section: 'CRM & Équipe' },
  { href: '/dashboard/admin/team', label: 'Équipe (RBAC)', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', section: 'CRM & Équipe' },
  
  { href: '/dashboard/admin/cms', label: 'Gestion CMS / Site', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6', section: 'CMS & Configuration' },
  { href: '/dashboard/admin/emails', label: 'Templates Emails', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', section: 'CMS & Configuration' },
  { href: '/dashboard/admin/settings', label: 'Paramètres', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z', section: 'CMS & Configuration' },
  { href: '/dashboard/admin/audit', label: 'Journal d\'Audit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', section: 'CMS & Configuration' },
];

export default async function AdminDashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  } catch (e) {
    console.error("Prisma error in admin layout:", e);
  }

  const isDatabaseOffline = !dbUser;
  const hasAdminRole = dbUser?.primaryRole === 'ADMIN' || (isDatabaseOffline && user.email?.includes('admin'));

  if (!hasAdminRole) {
    redirect('/dashboard/client');
  }

  const userName = dbUser?.name || user.email?.split('@')[0] || "Admin";
  const userInitials = userName.substring(0, 2).toUpperCase();

  // Pending counts
  let pendingCount = 0;
  let pendingQuotesCount = 0;
  try {
    pendingCount = await prisma.order.count({
      where: { status: { in: ['PENDING', 'PAID'] } }
    });
    pendingQuotesCount = await prisma.quote.count({
      where: { status: 'SENT' }
    });
  } catch (e) {
    console.error("Prisma error getting pending counts:", e);
  }

  const sections = [...new Set(navItems.map(i => i.section))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">

      {/* Sidebar */}
      <aside className="w-full md:w-[280px] bg-slate-900 flex flex-col flex-shrink-0 z-20">

        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-all">
              T+
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white leading-none">Touch+</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mt-0.5">Administration</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-6">
          {sections.map(section => (
            <div key={section}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-3">{section}</p>
              <nav className="space-y-1">
                {navItems.filter(i => i.section === section).map(item => (
                  <Link key={item.href} href={item.href} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                    <div className="p-1.5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                      </svg>
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/dashboard/admin/orders' && pendingCount > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                    {item.href === '/dashboard/admin/quotes' && pendingQuotesCount > 0 && (
                      <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {pendingQuotesCount}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Administrateur</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="w-full py-2 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 px-8 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div />
          <Link href="/dashboard/admin/orders" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-black rounded-full ring-1 ring-red-200 animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {pendingCount} nouvelle{pendingCount > 1 ? 's' : ''} commande{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </Link>
        </header>
        <main className="flex-1 p-6 md:p-10 pb-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
