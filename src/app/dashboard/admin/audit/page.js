import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminAuditPage() {
  let logs = [];
  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { name: true, email: true } }
      }
    });
  } catch (error) {
    console.error("Prisma error in audit page:", error);
  }

  const moduleColors = {
    orders: 'bg-blue-50 text-blue-750 dark:bg-blue-900/20 dark:text-blue-405',
    cms: 'bg-purple-50 text-purple-750 dark:bg-purple-900/20 dark:text-purple-405',
    users: 'bg-green-50 text-green-750 dark:bg-green-900/20 dark:text-green-405',
    settings: 'bg-amber-50 text-amber-750 dark:bg-amber-900/20 dark:text-amber-405',
    quotes: 'bg-red-50 text-red-750 dark:bg-red-900/20 dark:text-red-405',
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Journal d'Activité & Audit</h1>
        <p className="text-slate-500 dark:text-slate-400">Tracez les modifications et actions critiques effectuées sur Touch+ pour assurer la transparence et la sécurité.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-black text-slate-900 dark:text-white text-lg">Journal des 50 dernières actions</h2>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{log.user?.name || "Système"}</p>
                      <p className="text-xs text-slate-500">{log.user?.email || "Email auto"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${moduleColors[log.module] || 'bg-slate-100 text-slate-600'}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                      {log.label || "Action effectuée"}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 text-right">
                      {new Date(log.createdAt).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 font-bold">Aucun événement enregistré dans l'historique d'audit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
