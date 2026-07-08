'use client';

import { useState, useTransition } from 'react';
import { updateStaticPageAction } from '@/app/actions/cms';

export default function SettingsClient({ configs }) {
  const [isPending, startTransition] = useTransition();

  const [companyName, setCompanyName] = useState(configs.find(c => c.key === 'companyName')?.value || 'Touch+ Services');
  const [siret, setSiret] = useState(configs.find(c => c.key === 'siret')?.value || 'CI-ABJ-2024-B-1234');
  const [taxRate, setTaxRate] = useState(configs.find(c => c.key === 'taxRate')?.value || '18');
  const [address, setAddress] = useState(configs.find(c => c.key === 'companyAddress')?.value || 'Cocody, Abidjan, Côte d\'Ivoire');
  const [paymentTerms, setPaymentTerms] = useState(configs.find(c => c.key === 'paymentTerms')?.value || 'Acompte 50% à la commande, solde à la livraison.');

  function handleSave(e) {
    e.preventDefault();
    startTransition(async () => {
      await updateStaticPageAction('companyName', companyName);
      await updateStaticPageAction('siret', siret);
      await updateStaticPageAction('taxRate', taxRate);
      await updateStaticPageAction('companyAddress', address);
      await updateStaticPageAction('paymentTerms', paymentTerms);
      alert("Paramètres généraux sauvegardés avec succès !");
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Paramètres de l'Entreprise</h3>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom de l'Entreprise</label>
            <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">SIRET / RCCM</label>
            <input type="text" required value={siret} onChange={e => setSiret(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Taux de TVA par défaut (%)</label>
            <input type="number" required value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Adresse de l'Établissement</label>
            <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Conditions Générales de Règlement</label>
          <textarea rows="3" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 text-sm" />
        </div>

        <button type="submit" disabled={isPending} className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors">
          {isPending ? "Sauvegarde..." : "Enregistrer les paramètres"}
        </button>
      </form>
    </div>
  );
}
