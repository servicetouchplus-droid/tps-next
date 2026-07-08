'use client';

import { useState, useTransition } from 'react';
import { clientAcceptQuoteAction } from '@/app/actions/quote';

const StatusBadge = ({ status }) => {
  const styles = {
    DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-500/10",
    SENT: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 ring-amber-500/10 animate-pulse",
    CONVERTED: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 ring-green-500/10",
    EXPIRED: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 ring-red-500/10"
  };

  const labels = {
    DRAFT: "Brouillon",
    SENT: "Reçu / En cours de chiffrage",
    CONVERTED: "Converti en commande",
    EXPIRED: "Expiré"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ring-1 ring-inset ${styles[status] || styles.DRAFT}`}>
      {status === 'SENT' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
      {labels[status] || status}
    </span>
  );
};

export default function QuotesListClient({ initialQuotes }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);

  const handleAccept = async (quoteId) => {
    if (confirm("Voulez-vous valider cette proposition tarifaire et la convertir en commande ?")) {
      setFeedback(null);
      startTransition(async () => {
        const result = await clientAcceptQuoteAction(quoteId);
        if (result?.success) {
          setFeedback({ type: 'success', message: "✓ Devis accepté avec succès ! Votre commande a été créée. Retrouvez-la dans 'Mes Commandes'." });
          // Update status locally
          setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'CONVERTED' } : q));
        } else {
          setFeedback({ type: 'error', message: result?.error || "Une erreur est survenue." });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`p-4 rounded-2xl border text-sm font-bold animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 text-green-700 dark:text-green-450' 
            : 'bg-red-50 dark:bg-red-950/20 border-red-200 text-red-700 dark:text-red-450'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {quotes.length > 0 ? (
          quotes.map((quote) => {
            const firstItem = quote.items?.[0];
            const pName = firstItem?.productName || "Impression sur mesure";
            const qty = firstItem?.quantity || 1;
            const hasPrice = quote.total > 0;

            return (
              <div 
                key={quote.id} 
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              >
                {hasPrice && quote.status === 'SENT' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-150 duration-500 transition-all"></div>
                )}
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Info devis */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Réf: #{quote.reference}
                      </span>
                      <StatusBadge status={quote.status} />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {pName}
                    </h3>
                    
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Quantité demandée : <span className="font-bold text-slate-800 dark:text-slate-200">{qty}</span>
                    </p>

                    {quote.notes && (
                      <div className="text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-750 text-slate-650 dark:text-slate-400">
                        <span className="font-black text-slate-800 dark:text-slate-350 block mb-0.5">Vos notes :</span>
                        {quote.notes}
                      </div>
                    )}

                    {quote.files?.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400 font-semibold">Fichier soumis :</span>
                        {quote.files.map(file => (
                          <a 
                            key={file.id} 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
                          >
                            🔗 Lien Externe
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing / Validation Zone */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-750">
                    <div className="text-left lg:text-right">
                      <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Proposition Tarifaire</p>
                      {hasPrice ? (
                        <p className="text-2xl font-black text-orange-500 mt-1">
                          {quote.total.toLocaleString()} FCFA
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          Étude et chiffrage en cours
                        </p>
                      )}
                    </div>

                    {hasPrice && quote.status === 'SENT' && (
                      <button
                        onClick={() => handleAccept(quote.id)}
                        disabled={isPending}
                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-2xl hover:scale-105 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 uppercase tracking-widest whitespace-nowrap"
                      >
                        {isPending ? "Validation..." : "Valider & Commander"}
                      </button>
                    )}

                    {quote.status === 'CONVERTED' && (
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-4 py-2.5 rounded-xl border border-green-200/50">
                        ✓ Commande active créée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <span className="text-4xl block mb-4">📥</span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Aucun devis en attente</h4>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm mb-6">
              Soumettez une nouvelle demande de devis personnalisé avec vos formats, dimensions et finitions.
            </p>
            <a 
              href="/dashboard/client/new" 
              className="inline-block px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-md shadow-orange-500/10 hover:scale-105 transition-all"
            >
              Créer une demande
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
