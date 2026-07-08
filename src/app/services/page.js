
'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Navbar />
      <div id="main-content">
        

{/*  ====== NAVBAR ======  */}
        

{/*  ====== HERO ======  */}
<section className="hero-gradient text-white pt-28 pb-16 px-4 relative overflow-hidden">
    {/*  Decorative blobs  */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-96 h-64 bg-yellow-500/8 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>

    <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                    Impression premium • Livraison Abidjan & CI
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
                    Tout ce qu'il vous faut<br />
                    <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">pour briller.</span>
                </h1>
                <p className="text-gray-300 text-lg mb-8 max-w-xl">
                    Du t-shirt brodé au kakémono grand format, en passant par les flyers et le packaging sur mesure — concevez, commandez et suivez votre commande en temps réel.
                </p>
                <div className="flex flex-wrap gap-4">
                    <a href="#catalogue" className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        Voir le catalogue
                    </a>
                    <a href="simulateur.html" className="bg-white/10 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-white/20 transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        Simulateur 3D
                    </a>
                </div>
            </div>

            {/*  Trust badges  */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0 w-full lg:w-auto lg:min-w-[300px]">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-orange-400">500+</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">Clients satisfaits</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-400">24h</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">Devis gratuit</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-green-400">4.9★</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">Note clients</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-400">100%</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">BAT validé avant</div>
                </div>
            </div>
        </div>
    </div>
</section>

{/*  ====== HOW IT WORKS ======  */}
<section id="processus" className="py-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-2">Simple & Transparent</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Comment ça marche ?</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">De votre idée à la livraison, un processus clair en 5 étapes — et vous suivez tout en temps réel.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">

            {/*  Connector line desktop  */}
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-900/40 z-0"></div>

            {/*  Step 1  */}
            <div className="process-step" style={{"transitionDelay":"0s"}}>
                <div className="step-icon bg-gradient-to-br from-orange-500 to-yellow-400 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30 mb-4">
                    🛒
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-4 w-full">
                    <p className="text-xs font-black text-orange-500 uppercase mb-1">Étape 1</p>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Choisir & Commander</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sélectionnez votre produit, quantité et options. Envoyez votre fichier ou logo.</p>
                </div>
            </div>

            {/*  Step 2  */}
            <div className="process-step" style={{"transitionDelay":"0.1s"}}>
                <div className="step-icon bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30 mb-4">
                    🎨
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 w-full">
                    <p className="text-xs font-black text-purple-500 uppercase mb-1">Étape 2</p>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Création Maquette</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nos graphistes créent votre maquette et vous la soumettent dans votre espace.</p>
                </div>
            </div>

            {/*  Step 3  */}
            <div className="process-step" style={{"transitionDelay":"0.2s"}}>
                <div className="step-icon bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 mb-4">
                    👁️
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 w-full">
                    <p className="text-xs font-black text-blue-500 uppercase mb-1">Étape 3</p>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Validation BAT</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vous approuvez ou demandez des corrections. Rien ne se lance sans votre accord.</p>
                </div>
            </div>

            {/*  Step 4  */}
            <div className="process-step" style={{"transitionDelay":"0.3s"}}>
                <div className="step-icon bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30 mb-4">
                    ⚙️
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-2xl p-4 w-full">
                    <p className="text-xs font-black text-green-600 uppercase mb-1">Étape 4</p>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Production</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fabrication par nos experts. Vous suivez l'avancement en direct dans votre tableau de bord.</p>
                </div>
            </div>

            {/*  Step 5  */}
            <div className="process-step" style={{"transitionDelay":"0.4s"}}>
                <div className="step-icon bg-gradient-to-br from-teal-500 to-cyan-400 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/30 mb-4">
                    🚚
                </div>
                <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-2xl p-4 w-full">
                    <p className="text-xs font-black text-teal-600 uppercase mb-1">Étape 5</p>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Livraison Suivie</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Livré chez vous avec numéro de suivi. Abidjan & toute la Côte d'Ivoire.</p>
                </div>
            </div>
        </div>

        {/*  CTA  */}
        <div className="text-center mt-10">
            <a href="login.html" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                Commencer ma commande maintenant
            </a>
            <p className="text-xs text-gray-400 mt-3">Compte gratuit — Devis sans engagement</p>
        </div>
    </div>
</section>

{/*  ====== CATALOGUE ======  */}
<section id="catalogue" className="py-12 px-4">
    <div className="max-w-7xl mx-auto">

        {/*  Header + Search  */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
                <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-1">Notre Catalogue</p>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Nos Best-sellers</h2>
            </div>
            <div className="relative w-full lg:w-72">
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="search" id="product-search" placeholder="Rechercher un produit..." className="search-input w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white transition" />
            </div>
        </div>

        {/*  Category Pills  */}
        <div className="sticky-cats bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-sm py-3 -mx-4 px-4 mb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto" id="cat-pills" style={{"scrollbarWidth":"none"}}>
                <button className="cat-pill active" data-cat="all" onClick={() => { /* filterCat('all', this) */ }}>✦ Tous les produits</button>
                <button className="cat-pill" data-cat="textile" onClick={() => { /* filterCat('textile', this) */ }}>👕 Textile</button>
                <button className="cat-pill" data-cat="impression" onClick={() => { /* filterCat('impression', this) */ }}>🖨️ Impression</button>
                <button className="cat-pill" data-cat="grand-format" onClick={() => { /* filterCat('grand-format', this) */ }}>📐 Grand Format</button>
                <button className="cat-pill" data-cat="packaging" onClick={() => { /* filterCat('packaging', this) */ }}>📦 Packaging</button>
                <button className="cat-pill" data-cat="pub" onClick={() => { /* filterCat('pub', this) */ }}>🎁 Objets Pub</button>
                <button className="cat-pill" data-cat="signalétique" onClick={() => { /* filterCat('signalétique', this) */ }}>📍 Signalétique</button>
            </div>
        </div>

        {/*  Products Grid  */}
        <div id="products-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {/*  T-shirt  */}
            <div className="product-card aos-item" data-cat="textile" data-name="t-shirt personnalisé sérigraphie">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" alt="T-shirt personnalisé Touch+" loading="lazy" />
                    <span className="badge-popular">🔥 Populaire</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-purple-500 uppercase">Textile</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">T-shirt Personnalisé</h3>
                    <p className="text-xs text-gray-500 mb-3">Sérigraphie, transfert ou DTG. Toutes tailles, toutes couleurs.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 3 500 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 10 pcs)</span>
                        </div>
                        <a href="simulateur.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Simuler</a>
                    </div>
                </div>
            </div>

            {/*  Polo  */}
            <div className="product-card aos-item" data-cat="textile" data-name="polo broderie entreprise">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop" alt="Polo brodé Touch+" loading="lazy" />
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-purple-500 uppercase">Textile</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Polo Brodé</h3>
                    <p className="text-xs text-gray-500 mb-3">Broderie haute définition pour uniformes et événements corporate.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 5 000 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 10 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Flyers  */}
            <div className="product-card aos-item" data-cat="impression" data-name="flyers dépliants brochures impression">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=300&fit=crop" alt="Flyers imprimés Touch+" loading="lazy" />
                    <span className="badge-promo">−30%</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Impression</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Flyers & Dépliants</h3>
                    <p className="text-xs text-gray-500 mb-3">Impression haute qualité A5, A4, A6. Papier mat, brillant ou kraft.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 150 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 100 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Cartes de visite  */}
            <div className="product-card aos-item" data-cat="impression" data-name="cartes de visite premium business">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1612838320302-4b3b3996e666?w=400&h=300&fit=crop" alt="Cartes de visite Touch+" loading="lazy" />
                    <span className="badge-popular">⭐ Best-seller</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Impression</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Cartes de Visite</h3>
                    <p className="text-xs text-gray-500 mb-3">Finitions mate, brillante, dorure ou vernis sélectif. Coins ronds disponibles.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 200 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 50 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Kakémono  */}
            <div className="product-card aos-item" data-cat="grand-format" data-name="kakemono roll-up bâche stand exposition">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop" alt="Kakémono Touch+" loading="lazy" />
                    <span className="badge-new">📐 Grand Format</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-orange-500 uppercase">Grand Format</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Kakémono / Roll-up</h3>
                    <p className="text-xs text-gray-500 mb-3">Support enrouleur aluminium. Impression haute résolution. Format 80x200 cm.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 25 000 F</span>
                            <span className="text-[10px] text-gray-400 block">/ pièce (inclus pied)</span>
                        </div>
                        <a href="simulateur.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Simuler</a>
                    </div>
                </div>
            </div>

            {/*  Bâche  */}
            <div className="product-card aos-item" data-cat="grand-format" data-name="bâche banderole grand format événement">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" alt="Bâche imprimée Touch+" loading="lazy" />
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-orange-500 uppercase">Grand Format</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Bâches & Banderoles</h3>
                    <p className="text-xs text-gray-500 mb-3">Bâche outdoor haute résistance avec œillets. Dimensions sur mesure.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 15 000 F</span>
                            <span className="text-[10px] text-gray-400 block">/ m² (toutes tailles)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Packaging  */}
            <div className="product-card aos-item" data-cat="packaging" data-name="packaging boîte carton emballage sur mesure">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop" alt="Packaging Touch+" loading="lazy" />
                    <span className="badge-new">✦ Sur mesure</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-green-600 uppercase">Packaging</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Boîtes & Packaging</h3>
                    <p className="text-xs text-gray-500 mb-3">Boîtes carton sur mesure, sacs papier, étiquettes. Matériaux écologiques.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 800 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 50 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Autocollants  */}
            <div className="product-card aos-item" data-cat="impression" data-name="autocollants stickers étiquettes impression">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" alt="Stickers Touch+" loading="lazy" />
                    <span className="badge-promo">−20%</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Impression</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Stickers & Autocollants</h3>
                    <p className="text-xs text-gray-500 mb-3">Vinyle découpé ou imprimé. Résistant eau et UV. Forme libre possible.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 100 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 50 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Mug  */}
            <div className="product-card aos-item" data-cat="pub" data-name="mug personnalisé tasse objet publicitaire">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" alt="Mug personnalisé Touch+" loading="lazy" />
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-pink-500 uppercase">Objets Pub</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Mugs Personnalisés</h3>
                    <p className="text-xs text-gray-500 mb-3">Impression sublimation haute def. Idéal cadeaux d'entreprise et événements.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 2 500 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 10 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Stylo  */}
            <div className="product-card aos-item" data-cat="pub" data-name="stylo personnalisé crayon objet publicitaire">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop" alt="Stylos personnalisés Touch+" loading="lazy" />
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-pink-500 uppercase">Objets Pub</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Stylos Personnalisés</h3>
                    <p className="text-xs text-gray-500 mb-3">Impression logo sur toute la gamme. Idéal pour vos événements et kits de bienvenue.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 350 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 50 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

            {/*  Enseigne  */}
            <div className="product-card aos-item" data-cat="signalétique" data-name="enseigne panneau signalétique intérieure extérieure">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" alt="Enseigne Touch+" loading="lazy" />
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Signalétique</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Enseignes & Panneaux</h3>
                    <p className="text-xs text-gray-500 mb-3">Enseignes lumineuses, panneaux directionnels, totem. Intérieur et extérieur.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">Devis sur mesure</span>
                            <span className="text-[10px] text-gray-400 block">Réponse sous 24h</span>
                        </div>
                        <a href="contact.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Devis</a>
                    </div>
                </div>
            </div>

            {/*  Affiche  */}
            <div className="product-card aos-item" data-cat="impression" data-name="affiche poster impression grand format mur">
                <div className="product-img">
                    <img src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop" alt="Affiches Touch+" loading="lazy" />
                    <span className="badge-promo">−15%</span>
                    <div className="card-overlay">
                        <a href="login.html" className="w-full bg-white text-orange-600 font-bold text-xs py-2 rounded-xl text-center hover:bg-orange-50 transition">Commander →</a>
                    </div>
                </div>
                <div className="p-4">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Impression</span>
                    <h3 className="font-black text-gray-900 dark:text-white mt-0.5 mb-1">Affiches & Posters</h3>
                    <p className="text-xs text-gray-500 mb-3">Impression offset ou numérique. A0, A1, A2. Papier couché ou satiné.</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-orange-500 font-black text-sm">à partir de 500 F</span>
                            <span className="text-[10px] text-gray-400 block">/ unité (min. 20 pcs)</span>
                        </div>
                        <a href="login.html" className="text-[10px] bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition">Commander</a>
                    </div>
                </div>
            </div>

        </div>

        {/*  No results message  */}
        <div id="no-results" className="hidden py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold text-gray-600 dark:text-gray-400">Aucun produit trouvé.</p>
            <button onClick={() => { /* resetSearch() */ }} className="mt-4 text-sm text-orange-500 font-bold hover:underline">Réinitialiser</button>
        </div>
    </div>
</section>

{/*  ====== ORDER PROCESS VISUAL ======  */}
<section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
    <div className="max-w-5xl mx-auto text-center">
        <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-3">Votre parcours client</p>
        <h2 className="text-3xl sm:text-4xl font-black mb-4">Suivez votre commande en temps réel</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-12 text-sm">Dès la commande passée, votre tableau de bord se met à jour automatiquement à chaque étape de production.</p>

        {/*  Interactive order journey display  */}
        <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden">
            {/*  Mock dashboard preview  */}
            <div className="grid grid-cols-5 gap-2 mb-6">
                <div className="col-span-5 md:col-span-3 text-left">
                    <p className="text-xs text-gray-400 uppercase mb-3">Progression de la commande #TS20261109001</p>
                    <div className="flex items-center gap-0 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/30">✓</div>
                            <p className="text-[9px] text-orange-400 font-bold mt-1">Confirmée</p>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-orange-400 to-orange-400 mb-3"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/30">✓</div>
                            <p className="text-[9px] text-orange-400 font-bold mt-1">Maquette</p>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-orange-400 to-orange-400 mb-3"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/30">✓</div>
                            <p className="text-[9px] text-orange-400 font-bold mt-1">BAT Validé</p>
                        </div>
                        <div className="h-0.5 flex-1 bg-gray-600 mb-3"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 border-2 border-orange-500/50 animate-pulse">⚙️</div>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">Production</p>
                        </div>
                        <div className="h-0.5 flex-1 bg-gray-600 mb-3"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">🚚</div>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">Livraison</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-gray-400">Produit</p>
                            <p className="font-bold text-white mt-0.5">T-shirt ×150</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-gray-400">Statut</p>
                            <p className="font-bold text-orange-400 mt-0.5">⚙️ En Production</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-gray-400">Paiement</p>
                            <p className="font-bold text-green-400 mt-0.5">✓ Payé</p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex col-span-2 flex-col gap-2">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 text-left">
                        <p className="text-[10px] text-green-400 font-bold">✓ Maquette approuvée</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">Vous avez validé le BAT le 26 juin</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2 text-left">
                        <p className="text-[10px] text-orange-400 font-bold">⚙️ Production lancée</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">Livraison estimée : 3 juillet</p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-3 py-2 text-left">
                        <p className="text-[10px] text-gray-400 font-bold">🚚 Livraison prévue</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">DHL CI — N° suivi généré à l'envoi</p>
                    </div>
                </div>
            </div>

            <a href="login.html" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                Créer mon espace client & commander
            </a>
        </div>
    </div>
</section>

{/*  ====== CTA FINAL ======  */}
<section className="py-16 px-4 bg-white dark:bg-gray-900">
    <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-10 sm:p-14 shadow-2xl shadow-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
            <p className="text-orange-100 font-bold text-sm uppercase tracking-widest mb-3">Prêt à commencer ?</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">Votre vision mérite le meilleur.</h2>
            <p className="text-orange-100 mb-8 max-w-xl mx-auto">Créez votre compte gratuitement, passez votre commande et suivez chaque étape en temps réel. Livraison partout en Côte d'Ivoire.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="register.html" className="bg-white text-orange-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition">
                    Créer mon compte gratuit →
                </a>
                <a href="contact.html" className="bg-white/20 text-white font-bold px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition">
                    Demander un devis
                </a>
            </div>
        </div>
    </div>
</section>

{/*  ====== FOOTER ======  */}





      </div>
      <Footer />
    </>
  );
}
  