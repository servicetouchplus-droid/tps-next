
'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Navbar />
      <div id="main-content">
        
        {/*  ====== HERO ======  */}
        <section className="hero-gradient text-white relative overflow-hidden" style={{"padding":"140px 1rem 80px"}}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-64 bg-yellow-500/8 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                    Nos projets réalisés avec passion
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6">
                    Nos<br />
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">Réalisations.</span>
                </h1>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                    Découvrez une sélection de nos projets les plus récents et les plus emblématiques. Chaque réalisation raconte une histoire unique de transformation visuelle.
                </p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-16">

            {/*  Filtres  */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button className="filter-btn active" data-filter="all">Tous</button>
                <button className="filter-btn" data-filter="impression">Impression</button>
                <button className="filter-btn" data-filter="textile">Textile</button>
                <button className="filter-btn" data-filter="packaging">Packaging</button>
                <button className="filter-btn" data-filter="publicitaire">Objets Publicitaires</button>
                <button className="filter-btn" data-filter="grand-format">Grand Format</button>
                <button className="filter-btn" data-filter="signaletique">Signalétique</button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">Découvrez les projets réels alimentés par la base de données et visibles dans le dashboard administrateur.</p>
            <div id="portfolio-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"></div>

            {/*  Galerie Avant/Après  */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Transformation Visuelle</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Découvrez l'impact de nos réalisations avec nos galeries avant/après
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/*  Exemple 1  */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-1 bg-gradient-to-r from-orange-500 to-yellow-500">
                            <div className="bg-white dark:bg-gray-800 p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Enseigne de Magasin</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Avant</h4>
                                        <img src="https://images.unsplash.com/photo-1576532040302-0005551d5145?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Enseigne avant traitement" className="rounded-xl w-full h-48 object-cover" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Après</h4>
                                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Enseigne après traitement" className="rounded-xl w-full h-48 object-cover" />
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Transformation complète de l'enseigne avec design moderne et matériaux durables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Exemple 2  */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-1 bg-gradient-to-r from-orange-500 to-yellow-500">
                            <div className="bg-white dark:bg-gray-800 p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Packaging Produit</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Avant</h4>
                                        <img src="https://images.unsplash.com/photo-1590341545929-d7b957f12651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Packaging basique" className="rounded-xl w-full h-48 object-cover" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Après</h4>
                                        <img src="https://images.unsplash.com/photo-1590341471090-3d3e3b4d5a0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Packaging premium" className="rounded-xl w-full h-48 object-cover" />
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Refonte complète du packaging pour un impact visuel premium et une meilleure perception du produit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <a href="contact.html" className="btn-primary inline-block text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    Commencer un projet ensemble
                </a>
            </div>
        </div>
    
      </div>
      <Footer />
    </>
  );
}
  