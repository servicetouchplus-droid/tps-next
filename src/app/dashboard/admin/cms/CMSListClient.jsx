'use client';

import { useState, useTransition } from 'react';
import { 
  updateProductBasePriceAction, 
  saveServiceAction, 
  deleteServiceAction, 
  addPortfolioItemAction, 
  deletePortfolioItemAction, 
  saveBlogAction, 
  deleteBlogAction, 
  saveFaqAction, 
  deleteFaqAction, 
  savePartnerAction, 
  deletePartnerAction, 
  saveTeamMemberAction, 
  deleteTeamMemberAction, 
  updateStaticPageAction 
} from '@/app/actions/cms';

export default function CMSListClient({ 
  products = [], 
  services = [], 
  portfolioItems = [], 
  posts = [], 
  faqs = [], 
  partners = [], 
  teamMembers = [], 
  configs = [] 
}) {
  const [activeSubTab, setActiveSubTab] = useState('products');
  const [isPending, startTransition] = useTransition();

  // Modal / Form States
  const [editProduct, setEditProduct] = useState(null);
  const [basePrice, setBasePrice] = useState('');
  const [leadTime, setLeadTime] = useState('');

  // Product Extended States
  const [productName, setProductName] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [productUnit, setProductUnit] = useState('unité');
  const [productMinQty, setProductMinQty] = useState(1);
  const [productIsFeatured, setProductIsFeatured] = useState(false);
  const [productIsActive, setProductIsActive] = useState(true);

  // Service States
  const [activeService, setActiveService] = useState(null);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcDesc, setSvcDesc] = useState('');
  const [svcIcon, setSvcIcon] = useState('');
  const [svcColor, setSvcColor] = useState('orange');

  // Portfolio States
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newCategory, setNewCategory] = useState('impression');
  const [newDesc, setNewDesc] = useState('');

  // Blog States
  const [activeBlog, setActiveBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImg, setBlogImg] = useState('');
  const [blogPublished, setBlogPublished] = useState(true);

  // FAQ States
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('Général');

  // Partner States
  const [activePartner, setActivePartner] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerLogo, setPartnerLogo] = useState('');
  const [partnerUrl, setPartnerUrl] = useState('');

  // Team Member States
  const [activeMember, setActiveMember] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberImg, setMemberImg] = useState('');
  const [memberBio, setMemberBio] = useState('');

  // Static configs
  const [cgv, setCgv] = useState(configs.find(c => c.key === 'cgv')?.value || '');
  const [about, setAbout] = useState(configs.find(c => c.key === 'about')?.value || '');

  // ACTIONS HANDLERS
  function handleSavePrice(e) {
    e.preventDefault();
    if (!editProduct) return;
    startTransition(async () => {
      await updateProductBasePriceAction(editProduct.id, {
        name: productName,
        basePrice: parseFloat(basePrice) || 0,
        leadTimeDays: parseInt(leadTime, 10) || 3,
        imageUrl: productImageUrl || null,
        minQuantity: parseInt(productMinQty, 10) || 1,
        unit: productUnit || 'unité',
        isFeatured: productIsFeatured,
        isActive: productIsActive
      });
      setEditProduct(null);
      window.location.reload();
    });
  }

  function handleSaveService(e) {
    e.preventDefault();
    startTransition(async () => {
      await saveServiceAction(activeService?.id, svcTitle, svcDesc, svcIcon, svcColor);
      setActiveService(null);
      window.location.reload();
    });
  }

  function handleDeleteService(id) {
    if (!confirm("Supprimer ce service ?")) return;
    startTransition(async () => {
      await deleteServiceAction(id);
      window.location.reload();
    });
  }

  function handleAddPortfolio(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('clientName', newClient);
    formData.append('imageUrl', newImg);
    formData.append('category', newCategory);
    formData.append('description', newDesc);

    startTransition(async () => {
      await addPortfolioItemAction(formData);
      setNewTitle('');
      setNewClient('');
      setNewImg('');
      setNewDesc('');
      window.location.reload();
    });
  }

  function handleDeletePortfolio(id) {
    if (!confirm("Supprimer cette réalisation ?")) return;
    startTransition(async () => {
      await deletePortfolioItemAction(id);
      window.location.reload();
    });
  }

  function handleSaveBlog(e) {
    e.preventDefault();
    startTransition(async () => {
      await saveBlogAction(activeBlog?.id, blogTitle, blogSummary, blogContent, blogImg, blogPublished);
      setActiveBlog(null);
      window.location.reload();
    });
  }

  function handleDeleteBlog(id) {
    if (!confirm("Supprimer cet article ?")) return;
    startTransition(async () => {
      await deleteBlogAction(id);
      window.location.reload();
    });
  }

  function handleSaveFaq(e) {
    e.preventDefault();
    startTransition(async () => {
      await saveFaqAction(activeFaq?.id, faqQ, faqA, faqCat);
      setActiveFaq(null);
      window.location.reload();
    });
  }

  function handleDeleteFaq(id) {
    if (!confirm("Supprimer cette FAQ ?")) return;
    startTransition(async () => {
      await deleteFaqAction(id);
      window.location.reload();
    });
  }

  function handleSavePartner(e) {
    e.preventDefault();
    startTransition(async () => {
      await savePartnerAction(activePartner?.id, partnerName, partnerLogo, partnerUrl);
      setActivePartner(null);
      window.location.reload();
    });
  }

  function handleDeletePartner(id) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    startTransition(async () => {
      await deletePartnerAction(id);
      window.location.reload();
    });
  }

  function handleSaveMember(e) {
    e.preventDefault();
    startTransition(async () => {
      await saveTeamMemberAction(activeMember?.id, memberName, memberRole, memberImg, memberBio);
      setActiveMember(null);
      window.location.reload();
    });
  }

  function handleDeleteMember(id) {
    if (!confirm("Supprimer ce membre de l'équipe ?")) return;
    startTransition(async () => {
      await deleteTeamMemberAction(id);
      window.location.reload();
    });
  }

  function handleSaveStatic(key, val) {
    startTransition(async () => {
      await updateStaticPageAction(key, val);
      alert("Page statique mise à jour avec succès !");
    });
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl overflow-x-auto max-w-full">
        {[
          { key: 'products', label: 'Catalogue' },
          { key: 'services', label: 'Services' },
          { key: 'portfolio', label: 'Portfolio' },
          { key: 'blog', label: 'Blog' },
          { key: 'faq', label: 'FAQ' },
          { key: 'partners', label: 'Partenaires' },
          { key: 'team', label: 'Équipe' },
          { key: 'pages', label: 'Pages Statiques' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveSubTab(tab.key)} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === tab.key ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS / CATALOG */}
      {activeSubTab === 'products' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Gestion des Prix du Catalogue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.name}</h4>
                  <p className="text-xs text-slate-400">Prix de base : {p.basePrice.toLocaleString()} F • Délai : {p.leadTimeDays} jours</p>
                </div>
                <button onClick={() => {
                  setEditProduct(p);
                  setProductName(p.name);
                  setProductImageUrl(p.imageUrl || '');
                  setProductUnit(p.unit || 'unité');
                  setProductMinQty(p.minQuantity || 1);
                  setProductIsFeatured(p.isFeatured || false);
                  setProductIsActive(p.isActive !== false);
                  setBasePrice(p.basePrice);
                  setLeadTime(p.leadTimeDays);
                }} className="px-3.5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-85 transition-opacity">
                  Modifier
                </button>
              </div>
            ))}
          </div>

          {editProduct && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 relative overflow-hidden animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Modifier {editProduct.name}</h3>
                <form onSubmit={handleSavePrice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom du Produit</label>
                    <input type="text" required value={productName} onChange={e => setProductName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Image URL (Lien externe)</label>
                    <input type="url" value={productImageUrl} onChange={e => setProductImageUrl(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-xs" placeholder="https://..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Prix de base (XOF)</label>
                      <input type="number" required value={basePrice} onChange={e => setBasePrice(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Délai standard (jours)</label>
                      <input type="number" required value={leadTime} onChange={e => setLeadTime(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Unité de mesure</label>
                      <input type="text" required value={productUnit} onChange={e => setProductUnit(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="Ex: unité, m², lot..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Quantité minimale</label>
                      <input type="number" required value={productMinQty} onChange={e => setProductMinQty(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-650 dark:text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={productIsFeatured} onChange={e => setProductIsFeatured(e.target.checked)} className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4" />
                      ⭐ Mettre en avant (Best-seller sur la page d'accueil)
                    </label>

                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-650 dark:text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={productIsActive} onChange={e => setProductIsActive(e.target.checked)} className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4" />
                      🟢 Actif dans le catalogue (Visible par les clients)
                    </label>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={() => setEditProduct(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl">Annuler</button>
                    <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl">Enregistrer</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SERVICES */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{activeService ? "Modifier le Service" : "Ajouter un Service"}</h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre</label>
                <input type="text" required value={svcTitle} onChange={e => setSvcTitle(e.target.value)} placeholder="Impression Digitale" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea rows="3" required value={svcDesc} onChange={e => setSvcDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SVG de l'Icône</label>
                <input type="text" required value={svcIcon} onChange={e => setSvcIcon(e.target.value)} placeholder="<svg>...</svg>" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-xs font-mono" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">
                Enregistrer le Service
              </button>
              {activeService && (
                <button type="button" onClick={() => {
                  setActiveService(null);
                  setSvcTitle('');
                  setSvcDesc('');
                  setSvcIcon('');
                }} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">
                  Annuler la modification
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Liste des Services ({services.length})</h3>
            <div className="space-y-4">
              {services.map(s => (
                <div key={s.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/10">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{s.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">{s.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setActiveService(s);
                      setSvcTitle(s.title);
                      setSvcDesc(s.description);
                      setSvcIcon(s.iconSvg);
                    }} className="text-xs text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-xs text-red-650 hover:underline">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      {activeSubTab === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Ajouter une Réalisation</h3>
            <form onSubmit={handleAddPortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre de la réalisation</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Catalogue Exposition" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Client B2B (Optionnel)</label>
                <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="Ex: Gallery Sépia" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lien de l'image (URL)</label>
                <input type="url" required value={newImg} onChange={e => setNewImg(e.target.value)} placeholder="Ex: https://image.unsplash.com/..." className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catégorie</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="impression">Impression Offset</option>
                  <option value="grandformat">Grand Format</option>
                  <option value="textile">Textile / Broderie</option>
                  <option value="packaging">Packaging</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea rows="3" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors">
                {isPending ? "Création..." : "Publier sur le site"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Galerie des Réalisations ({portfolioItems.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioItems.map(item => (
                <div key={item.id} className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/10 flex flex-col justify-between">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                      {item.clientName && <p className="text-[10px] text-slate-400 font-bold">Client: {item.clientName}</p>}
                    </div>
                    <button onClick={() => handleDeletePortfolio(item.id)} disabled={isPending} className="mt-4 text-xs font-bold text-red-650 hover:underline text-left">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOG */}
      {activeSubTab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{activeBlog ? "Modifier l'Article" : "Ajouter un Article"}</h3>
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre</label>
                <input type="text" required value={blogTitle} onChange={e => setBlogTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image URL</label>
                <input type="url" required value={blogImg} onChange={e => setBlogImg(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Résumé</label>
                <input type="text" required value={blogSummary} onChange={e => setBlogSummary(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contenu (Texte brut ou HTML)</label>
                <textarea rows="5" required value={blogContent} onChange={e => setBlogContent(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={blogPublished} onChange={e => setBlogPublished(e.target.checked)} id="blogPublished" />
                <label htmlFor="blogPublished" className="text-xs font-bold text-slate-500">Publier immédiatement</label>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                Enregistrer
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Articles Publiés ({posts.length})</h3>
            <div className="space-y-4">
              {posts.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{p.title}</h4>
                    <p className="text-xs text-slate-400">{p.published ? "🟢 En ligne" : "🔴 Brouillon"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setActiveBlog(p);
                      setBlogTitle(p.title);
                      setBlogImg(p.imageUrl);
                      setBlogSummary(p.summary || '');
                      setBlogContent(p.content || '');
                      setBlogPublished(p.published);
                    }} className="text-xs text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDeleteBlog(p.id)} className="text-xs text-red-650 hover:underline">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeSubTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{activeFaq ? "Modifier la FAQ" : "Ajouter une FAQ"}</h3>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Question</label>
                <input type="text" required value={faqQ} onChange={e => setFaqQ(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Réponse</label>
                <textarea rows="3" required value={faqA} onChange={e => setFaqA(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                Enregistrer la FAQ
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">FAQ enregistrées ({faqs.length})</h3>
            <div className="space-y-4">
              {faqs.map(f => (
                <div key={f.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between bg-slate-50/50 dark:bg-slate-900/10">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{f.question}</h4>
                    <p className="text-xs text-slate-400 mt-1">{f.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setActiveFaq(f);
                      setFaqQ(f.question);
                      setFaqA(f.answer);
                      setFaqCat(f.category);
                    }} className="text-xs text-blue-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDeleteFaq(f.id)} className="text-xs text-red-650 hover:underline">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PARTNERS */}
      {activeSubTab === 'partners' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{activePartner ? "Modifier le Partenaire" : "Ajouter un Partenaire"}</h3>
            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom du Partenaire</label>
                <input type="text" required value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Logo (Lien image)</label>
                <input type="url" required value={partnerLogo} onChange={e => setPartnerLogo(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lien du site (Optionnel)</label>
                <input type="url" value={partnerUrl} onChange={e => setPartnerUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                Enregistrer le Partenaire
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Nos Partenaires / Références ({partners.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {partners.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                  <img src={p.logoUrl} alt={p.name} className="h-10 object-contain mb-3" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.name}</p>
                  <button onClick={() => handleDeletePartner(p.id)} className="text-xs text-red-650 hover:underline mt-2">Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEAM */}
      {activeSubTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{activeMember ? "Modifier le Collaborateur" : "Ajouter à l'Équipe"}</h3>
            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom complet</label>
                <input type="text" required value={memberName} onChange={e => setMemberName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rôle affiché</label>
                <input type="text" required value={memberRole} onChange={e => setMemberRole(e.target.value)} placeholder="Ex: Directeur Technique" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-955 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lien de l'avatar (URL)</label>
                <input type="url" required value={memberImg} onChange={e => setMemberImg(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bio (Brève description)</label>
                <textarea rows="3" value={memberBio} onChange={e => setMemberBio(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-slate-950 dark:text-white text-sm" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
                Enregistrer le Collaborateur
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Membres Équipe affichés ({teamMembers.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(m => (
                <div key={m.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/10">
                  <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{m.name}</h4>
                    <p className="text-xs text-slate-400">{m.role}</p>
                    <button onClick={() => handleDeleteMember(m.id)} className="text-xs text-red-650 hover:underline mt-2 inline-block">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATIC PAGES */}
      {activeSubTab === 'pages' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Conditions Générales de Vente (CGV)</h3>
            <p className="text-xs text-slate-400 mb-4">Ces informations apparaîtront dans la page CGV publique.</p>
            <textarea rows="6" value={cgv} onChange={e => setCgv(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm mb-3" />
            <button onClick={() => handleSaveStatic('cgv', cgv)} disabled={isPending} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">
              Mettre à jour les CGV
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">À propos de Touch+</h3>
            <p className="text-xs text-slate-400 mb-4">Présentation institutionnelle affichée sur la page À propos.</p>
            <textarea rows="6" value={about} onChange={e => setAbout(e.target.value)} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-transparent text-slate-955 dark:text-white focus:outline-none focus:border-blue-500 text-sm mb-3" />
            <button onClick={() => handleSaveStatic('about', about)} disabled={isPending} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">
              Mettre à jour la présentation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
