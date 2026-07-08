
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
                    Une question • Une demande de devis ?
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-6">
                    Contactez<br />
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">l'Équipe Touch+.</span>
                </h1>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                    Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets.
                </p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-16">

            <div className="grid lg:grid-cols-2 gap-16">
                <div>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Demande de Devis</h2>
                        
                        <div id="form-success" className="hidden status-message success-message mb-6">
                            <p><strong>Merci !</strong> Votre demande a été envoyée. Nous vous contacterons dans les 24h.</p>
                        </div>
                        <div id="form-error" className="hidden status-message error-message mb-6">
                            <p><strong>Erreur :</strong> Veuillez corriger les champs en rouge.</p>
                        </div>
                        
                        <form id="contact-form" className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom complet *</label>
                                <input type="text" id="name" name="name" required placeholder="Votre nom et prénoms" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                                <p className="form-error-message"></p>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                                <input type="email" id="email" name="email" required placeholder="votre.email@exemple.com" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                                <p className="form-error-message"></p>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Téléphone *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="+225 XX XX XX XX XX" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                                <p className="form-error-message"></p>
                            </div>
                            <div>
                                <label htmlFor="service" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Service souhaité *</label>
                                <select id="service" name="service" required className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner">
                                    <option value="">Choisissez un service</option>
                                    <option value="impression">Impression Numérique</option>
                                    <option value="textile">Confection Textile</option>
                                    <option value="packaging">Packaging & Emballage</option>
                                    <option value="publicitaire">Objets Publicitaires</option>
                                    <option value="autre">Autre</option>
                                </select>
                                <p className="form-error-message"></p>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Votre message *</label>
                                <textarea id="message" name="message" required rows="5" placeholder="Décrivez votre projet : quantité, format, délai..." className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner"></textarea>
                                <p className="form-error-message"></p>
                            </div>
                            <button type="submit" id="form-submit-btn" className="btn-primary w-full text-white px-8 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 relative z-10 inline-flex items-center justify-center gap-3">
                                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" />
                                </svg>
                                Envoyer ma Demande
                            </button>
                        </form>
                    </div>
                </div>
                
                <div>
                                        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-orange-950/30 text-white border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden mb-8">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">Nos Coordonnées</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-0.5 text-gray-200">Adresse</h3>
                                    <p className="text-gray-300 text-sm">Koumassi 05, Abidjan, Côte d'Ivoire</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-0.5 text-gray-200">Téléphone</h3>
                                    <p className="text-gray-300 text-sm font-semibold">+225 07 00 00 00 00</p>
                                    <p className="text-xs text-gray-500 mt-1">Conseil et commande</p>
                                    <p className="text-gray-300 text-sm font-semibold mt-0.5">+225 07 00 00 00 01</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-0.5 text-gray-200">Email</h3>
                                    <p className="text-gray-300 text-sm font-semibold">contact@votre-domaine.ci</p>
                                    <p className="text-xs text-gray-500 mt-1">Suivi de commande et comptabilité</p>
                                    <p className="text-gray-300 text-sm font-semibold mt-0.5">compta@votre-domaine.ci</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-0.5 text-gray-200">Horaires</h3>
                                    <p className="text-gray-300 text-sm">Lundi - Vendredi : 8h - 18h</p>
                                    <p className="text-gray-300 text-sm mt-0.5">Samedi : 9h - 16h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Suivi de Commande</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Pour suivre l'état de votre commande, veuillez contacter notre service dédié :
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-orange-500 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Service Suivi de Commande</p>
                                <p className="text-orange-500 dark:text-orange-400">+225 07 00 00 00 01</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
      </main>
      <Footer />
    </>
  );
}
  