'use client';

import { useState } from 'react';
import { createQuoteAction } from '@/app/actions/quote';

const categories = [
  { id: 'Grand Format', title: 'Grand Format', desc: 'Bâches, Vinyles, Roll-ups', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'Carterie', title: 'Carterie & Papeterie', desc: 'Cartes, Flyers, Dépliants', icon: 'M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76' },
  { id: 'Textile', title: 'Textile', desc: 'T-shirts, Polos, Casquettes', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'Goodies', title: 'Goodies', desc: 'Stylos, Mugs, Clés USB', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
];

export default function NewOrderPage() {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  
  // File URL verification states
  const [fileUrl, setFileUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState('idle'); // idle | valid | invalid
  const [detectedService, setDetectedService] = useState(''); // wetransfer | drive | dropbox | onedrive | ''

  function handleUrlChange(value) {
    setFileUrl(value);
    if (!value.trim()) {
      setUrlStatus('idle');
      setDetectedService('');
      return;
    }

    const val = value.trim();
    // Patterns
    const wetransferPat = /wetransfer\.com|we\.tl/i;
    const drivePat = /drive\.google\.com|docs\.google\.com/i;
    const dropboxPat = /dropbox\.com/i;
    const onedrivePat = /onedrive\.live\.com|sharepoint\.com/i;

    if (wetransferPat.test(val)) {
      setDetectedService('wetransfer');
      setUrlStatus('valid');
    } else if (drivePat.test(val)) {
      setDetectedService('google drive');
      setUrlStatus('valid');
    } else if (dropboxPat.test(val)) {
      setDetectedService('dropbox');
      setUrlStatus('valid');
    } else if (onedrivePat.test(val)) {
      setDetectedService('onedrive');
      setUrlStatus('valid');
    } else {
      setDetectedService('');
      setUrlStatus('invalid');
    }
  }

  async function handleSubmit(formData) {
    if(!selectedCat) {
        setErrorMsg("Veuillez sélectionner un type de produit.");
        return;
    }
    
    if (fileUrl && urlStatus === 'invalid') {
      setErrorMsg("Veuillez entrer une URL de fichier valide avant de soumettre.");
      return;
    }
    
    formData.append('product', selectedCat);
    
    // Add expiresAt if validDuration is selected
    const durationDays = formData.get('linkDuration');
    if (durationDays && urlStatus === 'valid') {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(durationDays, 10));
      formData.append('expiresAt', expDate.toISOString());
    }

    setIsPending(true);
    setErrorMsg('');
    
    const result = await createQuoteAction(formData);
    if (result?.error) {
      setErrorMsg(result.error);
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-10">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Nouveau Projet
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Demander un Devis</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Décrivez-nous votre projet pour lancer l'impression.</p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/50 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {errorMsg}
            </div>
        )}

        {/* Etape 1: Selection visuelle */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-sm">1</span>
             Type de produit
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCat(cat.title)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${
                  selectedCat === cat.title 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 shadow-md shadow-orange-500/10' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${selectedCat === cat.title ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon}></path></svg>
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedCat === cat.title ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>{cat.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Etape 2: Détails techniques */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-sm">2</span>
             Spécifications
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quantité souhaitée</label>
              <div className="relative">
                <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" required className="w-full pl-5 pr-12 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-900 dark:text-white text-lg" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-gray-400 font-medium">
                  unités
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description technique</label>
              <textarea id="notes" name="notes" rows="4" placeholder="Précisez la matière, le grammage, les finitions (ex: pelliculage mat, vernis sélectif)..." className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 dark:text-white resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Etape 3: Fichiers (WeTransfer/Drive/OneDrive/Dropbox) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 md:p-10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
          
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
             <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm shadow-lg shadow-orange-500/50">3</span>
             Fichiers d'impression
          </h2>

          <div className="relative z-10">
            <div className="border-2 border-dashed border-gray-600 rounded-3xl p-8 text-center bg-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Lien de partage de vos fichiers</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    Fournissez un lien <strong>WeTransfer</strong>, <strong>Google Drive</strong>, <strong>Dropbox</strong> ou <strong>OneDrive</strong> contenant vos visuels HD.
                </p>

                <div className="max-w-lg mx-auto space-y-4">
                  <div className="relative">
                    <input 
                      type="url" 
                      id="fileUrl" 
                      name="fileUrl" 
                      required 
                      value={fileUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://we.tl/... ou lien Drive, Dropbox, OneDrive..." 
                      className={`w-full px-5 py-4 bg-gray-900 border rounded-2xl focus:ring-4 transition-all font-medium text-white text-center placeholder-gray-600 ${
                        urlStatus === 'valid' ? 'border-green-500 focus:ring-green-500/20' : 
                        urlStatus === 'invalid' ? 'border-red-500 focus:ring-red-500/20' : 
                        'border-gray-700 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {urlStatus === 'valid' && (
                      <div className="absolute inset-y-0 right-4 flex items-center text-green-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    )}
                  </div>

                  {/* Badges de service détectés */}
                  {detectedService && (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold py-1.5 px-3 bg-gray-800/80 rounded-xl border border-gray-700/50 text-white w-fit mx-auto">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      Service détecté : <span className="text-orange-400 capitalize">{detectedService}</span>
                    </div>
                  )}

                  {urlStatus === 'invalid' && (
                    <p className="text-red-400 text-xs font-semibold">
                      Format de lien incorrect. Veuillez entrer une URL WeTransfer, Drive, Dropbox ou OneDrive valide.
                    </p>
                  )}

                  {/* Durée de validité optionnelle pour alerte d'expiration */}
                  <div className="text-left pt-2">
                    <label htmlFor="linkDuration" className="block text-xs font-bold text-gray-400 mb-1.5">
                      Durée de validité du lien (facultatif - utile pour WeTransfer)
                    </label>
                    <select 
                      id="linkDuration" 
                      name="linkDuration" 
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-gray-300 text-xs focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="">Indéterminée (ex: Google Drive, Dropbox permanent)</option>
                      <option value="7">7 jours (Standard WeTransfer Gratuit)</option>
                      <option value="15">15 jours</option>
                      <option value="30">30 jours</option>
                    </select>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isPending} className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-3 overflow-hidden shadow-xl shadow-orange-500/30">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10">{isPending ? 'Envoi en cours...' : 'Valider la commande'}</span>
            {!isPending && <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
          </button>
        </div>
      </form>
    </div>
  );
}
