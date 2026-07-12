'use client';

import { useState } from 'react';
import { createBestSeller, updateBestSeller, deleteBestSeller } from '@/app/actions/bestsellers';

export default function BestSellerManager({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentItem({
      category: '',
      name: '',
      priceText: '',
      imageUrl: '',
      badge: '',
      badgeColor: 'orange',
      targetUrl: '/dashboard/client/new',
      orderIndex: items.length + 1,
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    setLoading(true);
    const res = await deleteBestSeller(id);
    if (res.success) {
      setItems(items.filter(i => i.id !== id));
    } else {
      alert("Erreur: " + res.error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert to null if empty
    const data = {
      ...currentItem,
      badge: currentItem.badge || null,
      badgeColor: currentItem.badgeColor || null,
      orderIndex: parseInt(currentItem.orderIndex, 10),
    };

    if (currentItem.id) {
      const res = await updateBestSeller(currentItem.id, data);
      if (res.success) {
        setItems(items.map(i => i.id === currentItem.id ? res.item : i));
        setIsEditing(false);
      } else {
        alert("Erreur: " + res.error);
      }
    } else {
      const res = await createBestSeller(data);
      if (res.success) {
        setItems([...items, res.item].sort((a,b) => a.orderIndex - b.orderIndex));
        setIsEditing(false);
      } else {
        alert("Erreur: " + res.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
      {!isEditing ? (
        <>
          <div className="flex justify-end mb-6">
            <button onClick={handleAdd} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-600/20">
              + Ajouter un produit
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Ordre</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">Aucun produit configuré. La page d'accueil affiche les 12 produits par défaut.</td>
                  </tr>
                ) : items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-0.5">{item.category}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">{item.priceText}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.orderIndex}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {item.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold text-xs mr-4 uppercase tracking-wider">Éditer</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs uppercase tracking-wider" disabled={loading}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentItem.id ? 'Modifier' : 'Ajouter'} un produit</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Catégorie</label>
              <input required type="text" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: Textile" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nom du Produit</label>
              <input required type="text" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: T-shirts Personnalisés" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Texte du Prix</label>
              <input required type="text" value={currentItem.priceText} onChange={e => setCurrentItem({...currentItem, priceText: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: dès 2 500 F" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">URL de l'image</label>
              <input required type="url" value={currentItem.imageUrl} onChange={e => setCurrentItem({...currentItem, imageUrl: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Badge (Optionnel)</label>
              <input type="text" value={currentItem.badge || ''} onChange={e => setCurrentItem({...currentItem, badge: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: 🔥 Best seller" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Couleur Badge</label>
              <select value={currentItem.badgeColor || 'orange'} onChange={e => setCurrentItem({...currentItem, badgeColor: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="orange">Orange</option>
                <option value="purple">Violet</option>
                <option value="red">Rouge</option>
                <option value="green">Vert</option>
                <option value="gray">Gris</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ordre</label>
              <input required type="number" value={currentItem.orderIndex} onChange={e => setCurrentItem({...currentItem, orderIndex: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={currentItem.isActive} onChange={e => setCurrentItem({...currentItem, isActive: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 dark:bg-slate-900 border-slate-300 dark:border-slate-700" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 dark:text-slate-300">Afficher sur la page d'accueil</label>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Annuler</button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-600/20 transition-all">
              {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
