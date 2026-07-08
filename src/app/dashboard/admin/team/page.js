import { prisma } from '@/lib/prisma';
import TeamListClient from './TeamListClient';

export default async function AdminTeamPage() {
  let users = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Prisma error in admin team page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Gestion de l'Équipe</h1>
        <p className="text-slate-500 dark:text-slate-400">Configurez les droits d'accès, affectez les rôles RBAC aux collaborateurs et activez/désactivez les comptes.</p>
      </div>

      <TeamListClient users={users} />
    </div>
  );
}
