'use client';

import { useState, useTransition } from 'react';
import { resendFileLinkAction } from '@/app/actions/file';

export default function ResendLinkBox({ fileId, currentUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleResend = (e) => {
    e.preventDefault();
    if (!newUrl.trim() || isPending) return;

    // Fast validation
    const wetransferPat = /wetransfer\.com|we\.tl/i;
    const drivePat = /drive\.google\.com|docs\.google\.com/i;
    const dropboxPat = /dropbox\.com/i;
    const onedrivePat = /onedrive\.live\.com|sharepoint\.com/i;

    if (!wetransferPat.test(newUrl) && !drivePat.test(newUrl) && !dropboxPat.test(newUrl) && !onedrivePat.test(newUrl)) {
      alert("Veuillez entrer une URL de fichier valide (WeTransfer, Google Drive, Dropbox, OneDrive).");
      return;
    }

    startTransition(async () => {
      const res = await resendFileLinkAction(fileId, newUrl.trim());
      if (res.error) {
        alert(res.error);
      } else {
        alert("Lien mis à jour avec succès !");
        setIsOpen(false);
        setNewUrl('');
        window.location.reload();
      }
    });
  };

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-700/50 pt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs font-black text-orange-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
        >
          🔄 Renvoyer un nouveau lien de fichier
        </button>
      ) : (
        <form onSubmit={handleResend} className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="newUrl" className="text-xs font-bold text-gray-500">
              Nouveau lien de fichier HD (WeTransfer, Drive...)
            </label>
            <input
              type="url"
              id="newUrl"
              required
              placeholder="https://we.tl/..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Envoi...' : 'Valider'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-xs hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
