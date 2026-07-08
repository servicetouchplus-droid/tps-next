import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ResendLinkBox from '../orders/[id]/ResendLinkBox';

export default async function ClientFilesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let files = [];
  let dbErrorMsg = "";
  
  if (user) {
    try {
      files = await prisma.orderFile.findMany({
        where: {
          order: { userId: user.id },
          type: 'SOURCE',
        },
        include: {
          order: { select: { id: true, product: true, reference: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      console.error("Failed to load files from database:", err.message);
      dbErrorMsg = "Le service de fichiers est en cours de synchronisation ou la base de données est temporairement inaccessible. Les données de fichiers peuvent être incomplètes.";
    }
  }

  // Filter out duplicate or superseded file ids, but let's show all uploads categorized
  const now = new Date();

  // Detect files expiring soon (< 2 days remaining)
  const expiringFiles = files.filter(f => {
    if (!f.expiresAt) return false;
    const exp = new Date(f.expiresAt);
    const diffTime = exp - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  });

  return (
    <div className="animate-fade-in-up pb-10 space-y-8">
      {/* Header */}
      <div>
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Bibliothèque
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Gestion des Fichiers</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Retrouvez et gérez tous les visuels et documents d'impression envoyés.</p>
      </div>

      {/* Error Alert if any */}
      {dbErrorMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ {dbErrorMsg}
        </div>
      )}

      {/* Expiration Alerts (F10) */}
      {expiringFiles.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 rounded-3xl p-6 shadow-sm">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-black text-red-900 dark:text-red-300">Alerte d'expiration de liens</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Certains de vos liens WeTransfer expirent bientôt. Veuillez renvoyer un lien mis à jour pour éviter tout retard de production.
              </p>
              <div className="mt-4 space-y-2">
                {expiringFiles.map(f => (
                  <div key={f.id} className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center justify-between">
                    <span>• {f.order.product} (Ref: {f.order.reference || f.orderId.substring(0,8)})</span>
                    <span>Expire dans moins de 48h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {files.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-[11px] uppercase tracking-wider text-gray-400 font-black">
                  <th className="px-8 py-5">Projet</th>
                  <th className="px-8 py-5">Type de fichier / URL</th>
                  <th className="px-8 py-5">Statut Expiration</th>
                  <th className="px-8 py-5">Date d'envoi</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {files.map(file => {
                  const isWeTransfer = file.url.includes('wetransfer.com') || file.url.includes('we.tl');
                  const isDrive = file.url.includes('drive.google.com') || file.url.includes('docs.google.com');
                  const isDropbox = file.url.includes('dropbox.com');
                  const isOneDrive = file.url.includes('onedrive.live.com') || file.url.includes('sharepoint.com');

                  const serviceLabel = isWeTransfer ? 'WeTransfer' :
                                       isDrive ? 'Google Drive' :
                                       isDropbox ? 'Dropbox' :
                                       isOneDrive ? 'OneDrive' : 'Lien externe';

                  // Expiry status
                  let expiryBadge = <span className="text-xs text-gray-400 font-semibold">Permanent</span>;
                  if (file.expiresAt) {
                    const exp = new Date(file.expiresAt);
                    const expired = exp < now;
                    expiryBadge = expired ? (
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black uppercase">Expiré</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-black uppercase">Valide</span>
                    );
                  }

                  return (
                    <tr key={file.id} className="hover:bg-orange-50/10 dark:hover:bg-orange-500/5 transition-colors">
                      <td className="px-8 py-6">
                        <Link href={`/dashboard/client/orders/${file.orderId}`} className="block">
                          <p className="text-sm font-black text-gray-900 dark:text-white hover:text-orange-500 transition-colors">
                            {file.order.product}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Ref: {file.order.reference || file.orderId.substring(0,8).toUpperCase()}</p>
                        </Link>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md capitalize">
                          {serviceLabel}
                        </span>
                        <a href={file.url} target="_blank" rel="noreferrer" className="block text-xs text-orange-500 hover:underline max-w-[200px] truncate mt-1.5">
                          {file.url}
                        </a>
                      </td>
                      <td className="px-8 py-6">
                        {expiryBadge}
                        {file.expiresAt && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(file.expiresAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <ResendLinkBox fileId={file.id} currentUrl={file.url} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 px-4">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Aucun fichier</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Vous n'avez pas encore envoyé de fichiers de conception.</p>
          </div>
        )}
      </div>
    </div>
  );
}
