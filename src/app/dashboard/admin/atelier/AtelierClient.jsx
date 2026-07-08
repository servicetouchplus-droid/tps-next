'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatusAction, updateProductionDetailsAction } from '@/app/actions/admin';

const COLUMNS = [
  { key: 'MOCKUP', label: '🎨 Maquettes', color: 'border-purple-500 bg-purple-500/10' },
  { key: 'BAT', label: '📋 BAT envoyé', color: 'border-yellow-500 bg-yellow-500/10' },
  { key: 'PRODUCTION', label: '🏭 Impression', color: 'border-orange-500 bg-orange-500/10' },
  { key: 'SHIPPED', label: '🚚 Expédiées', color: 'border-blue-500 bg-blue-500/10' },
  { key: 'DELIVERED', label: '✅ Livrées', color: 'border-green-500 bg-green-500/10' }
];

export default function AtelierClient({ orders, adminUsers }) {
  const [isPending, startTransition] = useTransition();
  const [activeOrder, setActiveOrder] = useState(null);
  const [machine, setMachine] = useState('');
  const [operatorId, setOperatorId] = useState('');

  const machines = [
    'Presse Numérique A',
    'Presse Numérique B',
    'Traceur Grand Format X',
    'Traceur Vinyle Y',
    'Brodeuse Industrielle',
    'Offset Heidelberg'
  ];

  function getNextStatus(current) {
    if (current === 'MOCKUP') return 'BAT';
    if (current === 'BAT') return 'PRODUCTION';
    if (current === 'PRODUCTION') return 'SHIPPED';
    if (current === 'SHIPPED') return 'DELIVERED';
    return null;
  }

  function handleMove(orderId, nextStatus) {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, nextStatus);
      window.location.reload();
    });
  }

  function handleSaveProduction(e) {
    e.preventDefault();
    if (!activeOrder) return;
    startTransition(async () => {
      await updateProductionDetailsAction(activeOrder.id, machine, operatorId, activeOrder.internalNotes);
      setActiveOrder(null);
      window.location.reload();
    });
  }

  return (
    <div className="space-y-8">
      {/* Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.key);

          return (
            <div key={col.key} className="bg-slate-900/5 dark:bg-slate-900/40 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[500px]">
              <div className={`p-3 rounded-2xl border-l-4 mb-4 font-black text-sm text-slate-800 dark:text-white flex justify-between items-center ${col.color}`}>
                <span>{col.label}</span>
                <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-xs font-black">{colOrders.length}</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto">
                {colOrders.map(order => {
                  const firstItem = order.items?.[0];
                  const productName = firstItem?.productName || "Commande personnalisée";
                  const quantity = firstItem?.quantity || 1;

                  // Calculate hours since update
                  const diffHours = Math.floor((Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60 * 60));
                  const timeLabel = diffHours === 0 ? "Moins d'une heure" : `${diffHours} h`;

                  const nextSt = getNextStatus(order.status);

                  return (
                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono font-black text-slate-400">#{order.reference || order.id.substring(0,8).toUpperCase()}</span>
                          {order.priority === 'URGENT' && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400">URGENT</span>
                          )}
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">{productName}</h4>
                        <p className="text-[10px] text-slate-400">Qté: {quantity} • Attente: {timeLabel}</p>
                      </div>

                      <div className="text-[10px] space-y-1 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 font-medium text-slate-500">
                        <p>🖥️ {order.machine || 'Aucune machine'}</p>
                        <p>👤 PM: {order.assignedTo?.name || 'Non assigné'}</p>
                      </div>

                      <div className="flex justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => {
                          setActiveOrder(order);
                          setMachine(order.machine || 'Presse Numérique A');
                          setOperatorId(order.assignedToId || '');
                        }} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg transition-colors flex-1">
                          Éditer
                        </button>
                        {nextSt && (
                          <button onClick={() => handleMove(order.id, nextSt)} disabled={isPending} className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-lg transition-colors flex-1">
                            Suivant →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden animate-fade-in-up">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Mise à jour atelier</h3>
            <form onSubmit={handleSaveProduction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Machine de façonnage</label>
                <select value={machine} onChange={e => setMachine(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                  {machines.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opérateur Assigné (PM)</label>
                <select value={operatorId} onChange={e => setOperatorId(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                  <option value="">Non assigné</option>
                  {adminUsers.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setActiveOrder(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">
                  {isPending ? "Mise à jour..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
