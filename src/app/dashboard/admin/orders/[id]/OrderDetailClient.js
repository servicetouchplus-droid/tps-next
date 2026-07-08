'use client';
import { useState, useTransition } from 'react';
import { updateOrderStatusAction, updateOrderMockupAction, assignProjectManagerAction, updateProductionDetailsAction } from '@/app/actions/admin';

const ALL_STATUSES = [
  { value: 'PENDING', label: '⏳ En attente' },
  { value: 'PAID', label: '💳 Payé' },
  { value: 'MOCKUP', label: '🎨 Maquette en cours' },
  { value: 'BAT', label: '📋 BAT envoyé au client' },
  { value: 'PRODUCTION', label: '🏭 En production' },
  { value: 'SHIPPED', label: '🚚 Expédié' },
  { value: 'DELIVERED', label: '✅ Livré' },
  { value: 'CANCELLED', label: '❌ Annulé' },
];

export default function OrderDetailClient({ order, adminUsers }) {
  const [status, setStatus] = useState(order.status);
  const [mockupUrl, setMockupUrl] = useState(order.mockupUrl || '');
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [savedMockup, setSavedMockup] = useState(false);

  // PM and Machine States
  const [assignedPm, setAssignedPm] = useState(order.assignedToId || '');
  const [machine, setMachine] = useState(order.machine || '');
  const [assignSaved, setAssignSaved] = useState(false);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setSaved(false);
    startTransition(async () => {
      const res = await updateOrderStatusAction(order.id, newStatus);
      if (res?.success) setSaved(true);
    });
  };

  const handleMockupSave = () => {
    setSavedMockup(false);
    startTransition(async () => {
      const res = await updateOrderMockupAction(order.id, mockupUrl);
      if (res?.success) setSavedMockup(true);
    });
  };

  const handlePmChange = (newPmId) => {
    setAssignedPm(newPmId);
    setAssignSaved(false);
    startTransition(async () => {
      const res = await assignProjectManagerAction(order.id, newPmId);
      if (res?.success) setAssignSaved(true);
    });
  };

  const handleMachineChange = (newMachine) => {
    setMachine(newMachine);
    setAssignSaved(false);
    startTransition(async () => {
      const res = await updateProductionDetailsAction(order.id, newMachine, assignedPm, order.internalNotes);
      if (res?.success) setAssignSaved(true);
    });
  };

  return (
    <div className="space-y-6">
      {/* PM & Machine Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-black text-slate-900 dark:text-white mb-4">Chef de projet & Atelier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chef de projet dédié (PM)</label>
            <select
              value={assignedPm}
              onChange={e => handlePmChange(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              <option value="">Non assigné</option>
              {adminUsers?.map(u => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Machine de production</label>
            <select
              value={machine}
              onChange={e => handleMachineChange(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
            >
              <option value="">Non assignée</option>
              <option value="Presse Numérique A">Presse Numérique A</option>
              <option value="Presse Numérique B">Presse Numérique B</option>
              <option value="Traceur Grand Format X">Traceur Grand Format X</option>
              <option value="Traceur Vinyle Y">Traceur Vinyle Y</option>
              <option value="Brodeuse Industrielle">Brodeuse Industrielle</option>
              <option value="Offset Heidelberg">Offset Heidelberg</option>
            </select>
          </div>
        </div>
        {assignSaved && <p className="text-green-600 text-xs font-bold mt-3">✓ Chefs de projet & Machine mis à jour avec succès.</p>}
      </div>

      {/* Status Changer */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-black text-slate-900 dark:text-white mb-4">Statut de la commande</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ALL_STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              disabled={isPending}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all border-2 ${
                status === s.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-transparent bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        {saved && <p className="text-green-600 text-sm font-bold mt-3">✓ Statut mis à jour ! Le client sera informé.</p>}
      </div>

      {/* Mockup URL */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-black text-slate-900 dark:text-white mb-2">Envoyer la maquette au client</h3>
        <p className="text-sm text-slate-500 mb-4">Collez l'URL de la maquette (Canva, Google Drive, WeTransfer...). Elle sera visible dans l'espace client et changera le statut en "BAT envoyé".</p>
        <div className="flex gap-3">
          <input
            type="url"
            value={mockupUrl}
            onChange={e => setMockupUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleMockupSave}
            disabled={isPending || !mockupUrl}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
            Envoyer
          </button>
        </div>
        {savedMockup && <p className="text-green-600 text-sm font-bold mt-3">✓ Maquette envoyée ! Le statut est passé en "BAT".</p>}
        {order.clientComments && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <p className="text-xs font-black text-orange-700 dark:text-orange-400 uppercase mb-1">💬 Retour du client sur le BAT</p>
            <p className="text-sm text-orange-900 dark:text-orange-200">{order.clientComments}</p>
          </div>
        )}
      </div>
    </div>
  );
}
