
'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        
        {/*  ====== HERO ======  */}
        <section className="hero-gradient text-white relative overflow-hidden" style={{"padding":"140px 1rem 80px"}}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-64 bg-yellow-500/8 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                    Qui sommes-nous • Notre histoire & nos valeurs
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6">
                    À propos de<br />
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">Touch+ Services.</span>
                </h1>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                    Votre partenaire de confiance pour la communication visuelle, l'impression et le textile à Abidjan depuis plus de 10 ans.
                </p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notre Histoire</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Fondée en 2015 à Abidjan, Touch+ Services est née de la passion de ses fondateurs pour la communication visuelle et l'excellence dans l'impression. 
                        Depuis nos débuts modestes dans un petit atelier, nous avons grandi pour devenir l'un des leaders régionaux dans notre domaine.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Notre succès repose sur notre engagement envers la qualité, l'innovation et le service client exceptionnel. 
                        Nous croyons fermement que chaque projet mérite une attention personnalisée et une exécution impeccable.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Aujourd'hui, avec plus de 5000 projets livrés et une clientèle fidèle de plus de 500 entreprises, 
                        nous continuons à repousser les limites de la créativité et de l'impression pour propulser vos idées vers de nouveaux sommets.
                    </p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <div className="relative bg-gradient-to-br from-orange-500 to-yellow-400 w-full" style={{"aspectRatio":"3/2","minHeight":"260px"}}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                            <svg className="w-16 h-16 mb-4 opacity-90" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
                            </svg>
                            <p className="text-2xl font-black mb-1">Notre Atelier</p>
                            <p className="text-sm opacity-80">Depuis 2015 à Abidjan</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about-stats" className="grid md:grid-cols-3 gap-4 mb-16"></div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 md:p-12 mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Notre Mission</h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                        Transformer vos idées en supports de communication visuelle percutants qui captivent votre audience et propulsent votre marque.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Excellence</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Nous nous engageons à fournir des produits et services de la plus haute qualité à chaque projet.
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Innovation</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Nous adoptons les dernières technologies et techniques pour des résultats toujours plus créatifs.
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personnalisation</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Chaque projet est unique et mérite une approche sur mesure pour répondre aux besoins spécifiques.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Notre Équipe</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Des experts passionnés dédiés à la réussite de vos projets de communication visuelle.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{"background":"#FF8C00"}}>JD</div>
                            <div className="absolute bottom-0 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Jean Dupont</h3>
                        <p className="text-orange-500 font-semibold mb-4">Directeur Général</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Expert en communication visuelle avec plus de 15 ans d'expérience.
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{"background":"#3B82F6"}}>MA</div>
                            <div className="absolute bottom-0 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Marie Aubert</h3>
                        <p className="text-orange-500 font-semibold mb-4">Directrice Artistique</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Designer graphique passionnée par l'innovation et la créativité.
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{"background":"#10B981"}}>PT</div>
                            <div className="absolute bottom-0 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Paul Tall</h3>
                        <p className="text-orange-500 font-semibold mb-4">Chef d'Atelier</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Spécialiste de l'impression numérique et des finitions premium.
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{"background":"#8B5CF6"}}>AC</div>
                            <div className="absolute bottom-0 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Awa Coulibaly</h3>
                        <p className="text-orange-500 font-semibold mb-4">Responsable Clientèle</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Garante de la satisfaction client et de la qualité du service.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-orange-900 rounded-3xl p-8 md:p-12 text-white">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Nos Chiffres</h2>
                        <p className="text-gray-300 mb-8">
                            Des résultats concrets qui témoignent de notre expertise et de notre engagement envers l'excellence.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-4xl font-black text-orange-400 mb-2">+5000</div>
                                <div className="text-gray-300">Projets réalisés</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-orange-400 mb-2">+500</div>
                                <div className="text-gray-300">Clients satisfaits</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-orange-400 mb-2">10+</div>
                                <div className="text-gray-300">Ans d'expérience</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-orange-400 mb-2">4.9/5</div>
                                <div className="text-gray-300">Note moyenne</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                            <div className="text-6xl font-black mb-4">10 ans</div>
                            <div className="text-2xl font-bold mb-2">d'excellence</div>
                            <div className="text-gray-300">à votre service</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        {/*  ====== PARTENAIRES ======  */}
        <section id="partenaires" className="py-12 px-4 bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-850">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ils nous font confiance</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16 opacity-60 text-center select-none">
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">MTN CI</span>
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">Orange CI</span>
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">BOA CI</span>
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nestlé</span>
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Energies</span>
                    <span className="font-black text-lg text-gray-400 dark:text-gray-500 uppercase tracking-wider">Air CI</span>
                </div>
            </div>
        </section>

    
      </main>
      <Footer />
    </>
  );
}
  