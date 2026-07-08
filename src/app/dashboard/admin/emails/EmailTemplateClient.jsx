'use client';

import { useState, useTransition } from 'react';
import { updateEmailTemplateAction } from '@/app/actions/email';

export default function EmailTemplateClient({ templates }) {
  const [selectedTrigger, setSelectedTrigger] = useState('QUOTE_CONFIRMATION');
  const [isPending, startTransition] = useTransition();

  const triggers = [
    { key: 'QUOTE_CONFIRMATION', label: 'Confirmation Devis / Commande' },
    { key: 'BAT_REMINDER', label: 'Rappel de Validation BAT' },
    { key: 'INVOICE_UNPAID', label: 'Relance Facture Impayée' },
    { key: 'LINK_EXPIRING', label: 'Alerte Expiration Fichier' }
  ];

  // Find template or defaults
  const currentTemp = templates.find(t => t.trigger === selectedTrigger) || {
    subject: '',
    body: '',
    isActive: true
  };

  const [subject, setSubject] = useState(currentTemp.subject);
  const [body, setBody] = useState(currentTemp.body);
  const [isActive, setIsActive] = useState(currentTemp.isActive);

  // Sync state when trigger tab changes
  function handleSelectTrigger(trigKey) {
    setSelectedTrigger(trigKey);
    const found = templates.find(t => t.trigger === trigKey) || {
      subject: '',
      body: '',
      isActive: true
    };
    setSubject(found.subject);
    setBody(found.body);
    setIsActive(found.isActive);
  }

  function handleSave(e) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateEmailTemplateAction(selectedTrigger, subject, body, isActive);
      if (res?.success) {
        alert("Modèle d'email mis à jour avec succès !");
        window.location.reload();
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar triggers */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-fit">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Événements Déclencheurs</h3>
        <div className="space-y-2">
          {triggers.map(trig => (
            <button
              key={trig.key}
              onClick={() => handleSelectTrigger(trig.key)}
              className={`w-full p-4 text-left rounded-2xl text-xs font-bold transition-all border ${
                selectedTrigger === trig.key
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-100 bg-slate-50/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-350'
              }`}
            >
              {trig.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Éditeur de Modèle</h3>
        <p className="text-xs text-slate-400 mb-6">Utilisez les placeholders : <code className="bg-slate-150 px-1 py-0.5 rounded font-black font-mono text-[10px] text-slate-600">&#123;clientName&#125;</code>, <code className="bg-slate-150 px-1 py-0.5 rounded font-black font-mono text-[10px] text-slate-600">&#123;orderRef&#125;</code>, <code className="bg-slate-150 px-1 py-0.5 rounded font-black font-mono text-[10px] text-slate-600">&#123;totalPrice&#125;</code>, <code className="bg-slate-150 px-1 py-0.5 rounded font-black font-mono text-[10px] text-slate-600">&#123;linkUrl&#125;</code>.</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Activer l'envoi automatique pour cet événement</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sujet de l'Email</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ex: Votre commande {orderRef} est confirmée !"
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 bg-transparent text-slate-950 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corps de l'Email (HTML ou Texte Brut)</label>
            <textarea
              rows="12"
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Bonjour {clientName}, ..."
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 bg-transparent text-slate-950 dark:text-white font-mono text-xs"
            />
          </div>

          <button type="submit" disabled={isPending} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors">
            {isPending ? "Sauvegarde..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
