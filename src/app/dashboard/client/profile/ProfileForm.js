'use client';
import { useActionState } from 'react';
import { updateProfileAction } from '@/app/actions/profile';

export default function ProfileForm({ user }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom Complet */}
        <div>
          <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Nom complet / Responsable</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ''}
            required
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Téléphone direct</label>
          <input
            type="tel"
            name="phone"
            defaultValue={user.phone || ''}
            required
            placeholder="+225 07 00 00 00 00"
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-6">
        <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span>🏭</span> Informations de l'Entreprise (Facturation)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nom de l'entreprise */}
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Raison sociale / Nom entreprise</label>
            <input
              type="text"
              name="company"
              defaultValue={user.company || ''}
              placeholder="Ex: Ivoire Impression SARL"
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
            />
          </div>

          {/* Type d'entreprise */}
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Forme Juridique</label>
            <select
              name="companyType"
              defaultValue={user.companyType || 'SARL'}
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
            >
              <option value="SARL">SARL</option>
              <option value="SA">SA</option>
              <option value="SAS">SAS</option>
              <option value="EI">Entreprise Individuelle (EI)</option>
              <option value="ONG">ONG / Association</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identifiant fiscal */}
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Identifiant Unique / RCCM / N° SIRET</label>
            <input
              type="text"
              name="taxId"
              defaultValue={user.taxId || ''}
              placeholder="Ex: CI-ABJ-2026-B-1234"
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Ville</label>
            <input
              type="text"
              name="city"
              defaultValue={user.city || ''}
              placeholder="Ex: Abidjan"
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Adresse complète */}
        <div>
          <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Adresse de siège social</label>
          <input
            type="text"
            name="address"
            defaultValue={user.address || ''}
            placeholder="Ex: Boulevard Valéry Giscard d'Estaing, Zone 4"
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold"
          />
        </div>

        {/* Pays caché ou sélectionnable */}
        <input type="hidden" name="country" defaultValue={user.country || 'CI'} />
      </div>
      
      {state?.error && <p className="text-red-600 text-sm font-bold bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200/50">⚠️ {state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm font-bold bg-green-50 dark:bg-green-950/20 p-3 rounded-xl border border-green-200/50">✓ {state.success}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 text-sm">
        {isPending ? 'Enregistrement professionnel...' : 'Enregistrer les modifications professionnelles'}
      </button>
    </form>
  );
}
