'use client';

import { useState } from 'react';
import { convertQuoteToOrderAction } from '@/app/actions/quote';

export default function QuotesListClient({ quotes, adminUsers }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [price, setPrice] = useState('');
  const [machine, setMachine] = useState('Presse Numérique A');
  const [pmId, setPmId] = useState(adminUsers?.[0]?.id || '');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const machines = [
    'Presse Numérique A',
    'Presse Numérique B',
    'Traceur Grand Format X',
    'Traceur Vinyle Y',
    'Brodeuse Industrielle',
    'Offset Heidelberg'
  ];

  async function handleConvert(e) {
    e.preventDefault();
    if (!selectedQuote) return;
    if (!price || parseFloat(price) <= 0) {
      setErrorMsg("Veuillez saisir un tarif valide supérieur à 0.");
      return;
    }

    setIsPending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const result = await convertQuoteToOrderAction(selectedQuote.id, price, machine, pmId);
    
    setIsPending(false);
    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Devis converti en commande avec succès !");
      setTimeout(() => {
        setSelectedQuote(null);
        setPrice('');
        setSuccessMsg('');
        window.location.reload();
      }, 1500);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-black text-slate-900 dark:text-white text-lg">Demandes de devis non chiffrées ({quotes.length})</h2>
      </div>

      {quotes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Réf.</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Produit demandé</th>
                <th className="px-6 py-4">Lien Fichiers</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {quotes.map(quote => {
                const firstItem = quote.items?.[0];
                const productName = firstItem?.productName || "Sur devis";
                const quantity = firstItem?.quantity || 1;
                const file = quote.files?.[0];

                return (
                  <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-400">#{quote.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{quote.user?.name || "Client"}</p>
                      <p className="text-xs text-slate-500">{quote.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{productName}</p>
                      <p className="text-xs text-slate-400">Quantité : {quantity}</p>
                    </td>
                    <td className="px-6 py-4">
                      {file ? (
                        <div className="flex flex-col gap-1">
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-bold">
                            🌐 Ouvrir le lien client
                          </a>
                          {file.password && <p className="text-[10px] text-slate-400">M.D.P : {file.password}</p>}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Aucun fichier</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedQuote(quote)} className="px-3.5 py-2 bg-amber-500 hover:bg-amber-650 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                        Chiffrer & Valider
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 font-bold">Aucune demande de devis en attente.</p>
        </div>
      )}

      {/* Modal Chiffrage */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-8 relative overflow-hidden animate-fade-in-up">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Chiffrage Devis #{selectedQuote.reference}</h3>
            <p className="text-xs text-slate-500 mb-6">Saisissez les spécifications commerciales pour générer la commande.</p>

            {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold mb-4">{errorMsg}</div>}
            {successMsg && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold mb-4">{successMsg}</div>}

            <form onSubmit={handleConvert} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prix final TTC (XOF)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 75000" className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none transition-colors bg-transparent text-slate-900 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Machine Affectée</label>
                  <select value={machine} onChange={e => setMachine(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                    {machines.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chef de Projet (PM)</label>
                  <select value={pmId} onChange={e => setPmId(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                    {adminUsers.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setSelectedQuote(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50">
                  {isPending ? "Traitement..." : "Confirmer & Lancer la commande"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
