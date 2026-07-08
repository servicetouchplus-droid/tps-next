'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatusAction } from '@/app/actions/admin';

const statuses = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'PAID', label: 'Payé' },
  { value: 'MOCKUP', label: 'Maquette (WIP)' },
  { value: 'BAT', label: 'BAT envoyé' },
  { value: 'PRODUCTION', label: 'En production' },
  { value: 'SHIPPED', label: 'Expédié' },
  { value: 'DELIVERED', label: 'Livré' },
  { value: 'CANCELLED', label: 'Annulé' },
];

export default function StatusDropdown({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res?.error) {
        alert(res.error);
        setStatus(initialStatus); // Revert on error
      }
    });
  };

  return (
    <div className="relative">
      <select 
        value={status} 
        onChange={handleChange} 
        disabled={isPending}
        className={`appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${isPending ? 'opacity-50' : ''}`}
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}
