'use client';

import { useState, useTransition } from 'react';
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from '@/app/actions/client';

export default function AddressManager({ initialAddresses }) {
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [isPending, startTransition] = useTransition();

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const label = formData.get('label');
    const address = formData.get('address');

    if (!label || !address) return;

    startTransition(async () => {
      const res = await addAddressAction(formData);
      if (res.error) {
        alert(res.error);
      } else {
        // Simple reload to refresh data cleanly from server or pessimistic state sync
        window.location.reload();
      }
    });
    e.target.reset();
  };

  const handleDelete = (id) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    startTransition(async () => {
      const res = await deleteAddressAction(id);
      if (res.error) alert(res.error);
      else window.location.reload();
    });
  };

  const handleSetDefault = (id) => {
    startTransition(async () => {
      const res = await setDefaultAddressAction(id);
      if (res.error) alert(res.error);
      else window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      {/* List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune adresse de livraison enregistrée.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                addr.isDefault
                  ? 'border-orange-500 bg-orange-50/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{addr.address}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {addr.city}, {addr.country} {addr.phone && `| Tél: ${addr.phone}`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isPending}
                    className="text-[10px] font-bold text-orange-500 hover:underline"
                  >
                    Définir par défaut
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form to Add Address */}
      <form onSubmit={handleAdd} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-4">
        <h4 className="font-black text-xs text-gray-800 dark:text-gray-200 uppercase tracking-wider">
          Ajouter une adresse de livraison
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <input
              type="text"
              name="label"
              required
              placeholder="Ex: Siège social, Bureau Cocody, Point de vente..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div className="col-span-2">
            <input
              type="text"
              name="address"
              required
              placeholder="Adresse complète (ex: Rue des Jardins, Immeuble Horizon)"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="Ville (ex: Abidjan)"
              defaultValue="Abidjan"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Téléphone de contact"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              value="true"
              className="rounded text-orange-500 focus:ring-orange-500/20"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-gray-500">
              Définir comme adresse de livraison par défaut
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all"
        >
          {isPending ? 'Ajout...' : 'Ajouter l\'adresse'}
        </button>
      </form>
    </div>
  );
}
