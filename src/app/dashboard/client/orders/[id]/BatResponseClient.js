'use client';
import { useState, useTransition } from 'react';
import { clientBatResponseAction } from '@/app/actions/admin';

export default function BatResponseClient({ orderId, mockupUrl }) {
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [approved, setApproved] = useState(null);

  const handleResponse = (isApproved) => {
    setApproved(isApproved);
    startTransition(async () => {
      await clientBatResponseAction(orderId, isApproved, comment);
      setDone(true);
    });
  };

  if (done) {
    return (
      <div className={`p-6 rounded-2xl border-2 text-center ${approved ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <p className="text-2xl mb-2">{approved ? '✅' : '🔄'}</p>
        <p className={`font-black text-lg ${approved ? 'text-green-700' : 'text-orange-700'}`}>
          {approved ? 'BAT approuvé ! La production va démarrer.' : 'Modifications demandées. Notre équipe vous recontacte.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📋</span>
        <div>
          <h3 className="font-black text-slate-900 dark:text-white">Votre BAT est prêt !</h3>
          <p className="text-sm text-slate-500">Consultez la maquette et donnez votre accord ou vos retours.</p>
        </div>
      </div>

      <a href={mockupUrl} target="_blank" rel="noreferrer"
        className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl mb-6 hover:bg-orange-100 transition-colors group">
        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </div>
        <div>
          <p className="font-bold text-orange-700 dark:text-orange-300">Voir ma maquette</p>
          <p className="text-xs text-orange-500">Cliquer pour ouvrir</p>
        </div>
        <svg className="w-5 h-5 text-orange-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </a>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Si vous avez des modifications à demander, notez-les ici..."
        rows={3}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={() => handleResponse(false)}
          disabled={isPending}
          className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">
          🔄 Demander des retouches
        </button>
        <button
          onClick={() => handleResponse(true)}
          disabled={isPending}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
          ✅ Approuver le BAT
        </button>
      </div>
    </div>
  );
}
