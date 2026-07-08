'use client';

import { useTransition } from 'react';
import { updateUserRoleAction, toggleUserActiveAction } from '@/app/actions/admin';

export default function TeamListClient({ users }) {
  const [isPending, startTransition] = useTransition();

  const roles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'CLIENT', label: 'Client / Partenaire B2B' }
  ];

  function handleRoleChange(userId, newRole) {
    startTransition(async () => {
      await updateUserRoleAction(userId, newRole);
      window.location.reload();
    });
  }

  function handleToggleActive(userId, currentStatus) {
    startTransition(async () => {
      await toggleUserActiveAction(userId, !currentStatus);
      window.location.reload();
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-black text-slate-900 dark:text-white text-lg">Membres de l'équipe & Rôles</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4">Nom / Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Statut Compte</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.name || "Collaborateur"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.primaryRole}
                    disabled={isPending}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.isActive ? 'bg-green-50 text-green-700 dark:bg-green-950/20' : 'bg-red-50 text-red-750 dark:bg-red-950/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleToggleActive(user.id, user.isActive)}
                    disabled={isPending}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      user.isActive
                        ? 'bg-red-50 hover:bg-red-100 text-red-650'
                        : 'bg-green-50 hover:bg-green-150 text-green-650'
                    }`}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
