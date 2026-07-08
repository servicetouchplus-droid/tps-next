
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
                    Ressources & conseils de nos experts
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6">
                    Le Blog de<br />
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">Touch+ Services.</span>
                </h1>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                    Découvrez nos conseils, astuces et actualités sur l'impression, le textile, le packaging et la communication visuelle.
                </p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-16">

            <div className="mb-8 max-w-2xl mx-auto">
                <input id="article-search" type="search" placeholder="Rechercher un article…" className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-orange-500" />
            </div>
            <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"></div>
            <div className="hidden">
                {/*  Article 1  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544713221-46d5cff5b0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Choisir le bon papier pour impression" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>15 Juin 2025</span>
                            <span className="mx-2">•</span>
                            <span>Impression</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="blog-post.html" className="hover:text-orange-500 transition-colors">Comment choisir le bon papier pour vos impressions</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Découvrez les différents types de papier disponibles et comment choisir celui qui convient le mieux à vos projets d'impression...
                        </p>
                        <a href="blog-post.html" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>

                {/*  Article 2  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1534302048852-7fcab4b3c62e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Tendance textile 2025" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>2 Juin 2025</span>
                            <span className="mx-2">•</span>
                            <span>Textile</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="blog-post2.html" className="hover:text-orange-500 transition-colors">Les tendances textiles à suivre en 2025</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Découvrez les dernières tendances en matière de vêtements personnalisés et de techniques de sérigraphie pour cette année...
                        </p>
                        <a href="blog-post2.html" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>

                {/*  Article 3  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Packaging écologique" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>20 Mai 2025</span>
                            <span className="mx-2">•</span>
                            <span>Packaging</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">Le packaging écologique : une tendance incontournable</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Pourquoi le packaging écologique est devenu essentiel pour les marques soucieuses de leur impact environnemental...
                        </p>
                        <a href="#" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>

                {/*  Article 4  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Objets publicitaires originaux" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>5 Mai 2025</span>
                            <span className="mx-2">•</span>
                            <span>Objets Publicitaires</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">10 objets publicitaires originaux pour booster votre visibilité</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Découvrez des idées d'objets publicitaires uniques et créatifs pour faire parler de votre marque auprès de votre cible...
                        </p>
                        <a href="#" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>

                {/*  Article 5  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Communication visuelle" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>18 Avril 2025</span>
                            <span className="mx-2">•</span>
                            <span>Communication Visuelle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">L'importance de la communication visuelle pour votre entreprise</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Comment une stratégie de communication visuelle cohérente peut transformer l'image de votre entreprise et attirer plus de clients...
                        </p>
                        <a href="#" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>

                {/*  Article 6  */}
                <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Signalétique extérieure" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>3 Avril 2025</span>
                            <span className="mx-2">•</span>
                            <span>Signalisation</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">La signalétique extérieure : guide complet pour attirer les clients</a>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Comment créer une signalétique extérieure efficace pour attirer l'attention et guider vos clients vers votre établissement...
                        </p>
                        <a href="#" className="text-orange-500 dark:text-orange-400 font-semibold hover:underline flex items-center">
                            Lire l'article
                            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>
            </div>

            {/*  Pagination  */}
            <div className="flex justify-center items-center space-x-2">
                <a href="#" className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors">
                    Précédent
                </a>
                <a href="#" className="px-4 py-2 rounded-lg bg-orange-500 text-white">1</a>
                <a href="#" className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors">2</a>
                <a href="#" className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors">3</a>
                <span className="px-4 py-2 text-gray-500 dark:text-gray-400">...</span>
                <a href="#" className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors">10</a>
                <a href="#" className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-colors">
                    Suivant
                </a>
            </div>
        </div>
    
      </div>
      <Footer />
    </>
  );
}
  