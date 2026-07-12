
'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';
import { getPremiumServices, getRealisations, getLatestPosts } from '@/app/actions/home';
import { getBestSellers } from '@/app/actions/bestsellers';

export default function Home() {
  const [services, setServices] = useState([]);
  const [realisations, setRealisations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [svcs, reals, pts, bSellers] = await Promise.all([
          getPremiumServices(),
          getRealisations('all'),
          getLatestPosts(),
          getBestSellers()
        ]);
        setServices(svcs);
        setRealisations(reals);
        setPosts(pts);
        setBestSellers(bSellers);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <main id="main-content">
        

        {/*  ====== HERO PREMIUM ======  */}
        <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden" style={{background: "linear-gradient(135deg, #0f172a 0%, #1a1f35 40%, #0f172a 100%)"}}>

            {/*  Animated bg blobs  */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/8 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/6 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>

            {/*  Floating product cards (decorative)  */}
            <div className="hidden xl:block absolute right-8 top-24 w-44 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 animate-float" style={{animationDelay: "0s"}}>
                <div className="h-24 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl mb-2 flex items-center justify-center text-3xl">👕</div>
                <p className="text-white text-xs font-bold">T-shirt Sérigraphie</p>
                <p className="text-orange-400 text-xs font-black">à partir de 3 500 F</p>
            </div>
            <div className="hidden xl:block absolute right-56 top-16 w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 animate-float" style={{animationDelay: "0.7s"}}>
                <div className="h-20 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl mb-2 flex items-center justify-center text-3xl">📐</div>
                <p className="text-white text-xs font-bold">Kakémono Roll-up</p>
                <p className="text-orange-400 text-xs font-black">25 000 F / pièce</p>
            </div>
            <div className="hidden xl:block absolute right-12 bottom-32 w-40 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 animate-float" style={{animationDelay: "1.2s"}}>
                <div className="h-20 bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-xl mb-2 flex items-center justify-center text-3xl">📦</div>
                <p className="text-white text-xs font-bold">Packaging Premium</p>
                <p className="text-orange-400 text-xs font-black">800 F / unité</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-20 w-full">
                <div className="max-w-3xl">

                    {/*  Badge  */}
                    <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></span>
                        N°1 Communication Visuelle · Abidjan, Côte d'Ivoire
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-6">
                        Vos visuels,
                        <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">imprimés parfaitement.</span>
                    </h1>

                    <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                        T-shirts, Flyers, Kakémonos, Packaging sur mesure — commandez en ligne, suivez chaque étape en temps réel, recevez chez vous.
                    </p>

                    {/*  Feature pills  */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        <span className="flex items-center gap-1.5 bg-white/8 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">✓ BAT validé avant production</span>
                        <span className="flex items-center gap-1.5 bg-white/8 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">✓ Livraison partout en CI</span>
                        <span className="flex items-center gap-1.5 bg-white/8 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">✓ Suivi en temps réel</span>
                        <span className="flex items-center gap-1.5 bg-white/8 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">✓ Devis gratuit 24h</span>
                    </div>

                    {/*  CTAs  */}
                    <div className="flex flex-wrap gap-4 mb-16">
                        <a href="services.html" className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition flex items-center gap-2 text-sm sm:text-base">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            Voir le Catalogue
                        </a>
                        <a href="login.html" className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition flex items-center gap-2 text-sm sm:text-base backdrop-blur-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            Mon Espace Client
                        </a>
                    </div>

                    {/*  Stats ribbon  */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <p className="text-2xl font-black text-orange-400">500+</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Clients</p>
                        </div>
                        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <p className="text-2xl font-black text-yellow-400">5 000+</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Projets</p>
                        </div>
                        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <p className="text-2xl font-black text-green-400">4.9★</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Avis clients</p>
                        </div>
                        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <p className="text-2xl font-black text-blue-400">10+</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Ans d'expérience</p>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Bottom wave  */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 60L1440 60L1440 0C1200 50 800 60 720 30C640 0 240 60 0 0L0 60Z" fill="#f9fafb"/>
                </svg>
            </div>
            <div className="dark:block hidden absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 60L1440 60L1440 0C1200 50 800 60 720 30C640 0 240 60 0 0L0 60Z" fill="#111827"/>
                </svg>
            </div>
        </section>

        {/*  ====== BEST-SELLERS PRODUITS ======  */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                    <div>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-1">Catalogue</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Nos Best-sellers</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Choisissez votre produit et passez commande en quelques clics</p>
                    </div>
                    <Link href="/dashboard/client/new" className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 border border-orange-200 dark:border-orange-900/50 px-5 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition">
                        Commander maintenant →
                    </Link>
                </div>

                {/* Dynamic Best Sellers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : bestSellers.length > 0 ? (
                        bestSellers.map((item, index) => (
                            <Link href={item.targetUrl || "/dashboard/client/new"} key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                                <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading={index > 3 ? "lazy" : "eager"} />
                                    {item.badge && (
                                        <span className={`absolute top-2.5 left-2.5 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow ${
                                            item.badgeColor === 'purple' ? 'bg-purple-600' :
                                            item.badgeColor === 'red' ? 'bg-red-500' :
                                            item.badgeColor === 'orange' ? 'bg-orange-500' :
                                            item.badgeColor === 'green' ? 'bg-green-500' :
                                            'bg-gray-800'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4">
                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{item.category}</span>
                                    <p className="font-black text-gray-900 dark:text-white text-sm mt-0.5 leading-tight">{item.name}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-orange-500 font-black">{item.priceText}</p>
                                        <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg group-hover:bg-orange-600 transition-colors">Commander</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">Aucun produit disponible pour le moment.</div>
                    )}
                </div>

                {/* Bottom CTA Banner */}
                <div className="mt-12 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/25">
                    <div>
                        <p className="text-white/90 text-sm font-semibold mb-1">Vous ne trouvez pas ce que vous cherchez ?</p>
                        <p className="text-white font-black text-2xl md:text-3xl">Devis personnalisé en 24h</p>
                        <p className="text-white/80 text-sm mt-1">Notre équipe vous répond rapidement avec une offre sur mesure</p>
                    </div>
                    <Link href="/dashboard/client/new" className="flex-shrink-0 bg-white text-orange-600 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                        Demander un devis
                    </Link>
                </div>
            </div>
        </section>

        {/*  ====== SERVICES SECTION ======  */}
        <section id="services" className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Ce qu'on fait</p>
                    <h2 className="section-title text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        Nos Services Premium
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Des solutions complètes pour propulser votre image de marque vers l'excellence.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : services.length > 0 ? (
                        services.map((service, idx) => (
                            <Link href="/services" key={service.id} className="service-card group bg-white dark:bg-gray-800 rounded-3xl p-7 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-on-scroll block" style={{animationDelay: `${idx * 0.1}s`}}>
                                <div className={`w-16 h-16 bg-gradient-to-br ${
                                    service.colorHint === 'orange' ? 'from-orange-500 to-yellow-400' :
                                    service.colorHint === 'purple' ? 'from-purple-500 to-indigo-500' :
                                    service.colorHint === 'green' ? 'from-green-500 to-teal-400' :
                                    'from-pink-500 to-red-400'
                                } rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-110 transition-transform`} dangerouslySetInnerHTML={{ __html: service.iconSvg || '' }} />
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{service.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                                <span className={`text-${service.colorHint || 'orange'}-500 font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all`}>Explorer <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></span>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">Aucun service disponible pour le moment.</div>
                    )}
                </div>

                <div className="text-center mt-10">
                    <a href="services.html" className="btn-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 inline-flex items-center gap-2">
                        Voir tout le catalogue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </a>
                </div>
            </div>
        </section>



        {/*  ====== PROCESSUS SECTION ======  */}
        <section id="processus" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Simple & Transparent</p>
                    <h2 className="section-title text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
                        De votre idée à la livraison — 5 étapes claires, et vous suivez tout depuis votre tableau de bord.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {/*  Connector line  */}
                    <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 dark:from-orange-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 z-0"></div>

                    {/*  Step 1  */}
                    <div className="flex flex-col items-center text-center animate-on-scroll">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 mb-4 relative z-10 transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        <div className="step-card step-card-orange">
                            <p className="text-[10px] font-black text-orange-500 uppercase mb-1">Étape 1</p>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Commander</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Choisissez votre produit, envoyez votre fichier.</p>
                        </div>
                    </div>

                    {/*  Step 2  */}
                    <div className="flex flex-col items-center text-center animate-on-scroll" style={{animationDelay: "0.1s"}}>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 mb-4 relative z-10 transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.24 10.158C16.11 9.288 17.5 9.288 18.37 10.158C19.24 11.028 19.24 12.418 18.37 13.288L12.59 19.068C11.59 20.068 10.19 20.598 8.78 20.598H5.409V17.228C5.409 15.818 5.939 14.418 6.939 13.418L12.72 7.638M15.24 10.158L12.72 7.638M15.24 10.158L10.16 5.078M12.72 7.638L7.64 2.558"/></svg>
                        </div>
                        <div className="step-card step-card-purple">
                            <p className="text-[10px] font-black text-purple-500 uppercase mb-1">Étape 2</p>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Maquette</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Nos graphistes créent votre maquette.</p>
                        </div>
                    </div>

                    {/*  Step 3  */}
                    <div className="flex flex-col items-center text-center animate-on-scroll" style={{animationDelay: "0.2s"}}>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4 relative z-10 transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div className="step-card step-card-blue">
                            <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Étape 3</p>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Validation BAT</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Vous approuvez ou demandez des corrections.</p>
                        </div>
                    </div>

                    {/*  Step 4  */}
                    <div className="flex flex-col items-center text-center animate-on-scroll" style={{animationDelay: "0.3s"}}>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 mb-4 relative z-10 transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div className="step-card step-card-green">
                            <p className="text-[10px] font-black text-green-600 uppercase mb-1">Étape 4</p>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Production</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Fabrication — suivi en temps réel dans votre espace.</p>
                        </div>
                    </div>

                    {/*  Step 5  */}
                    <div className="flex flex-col items-center text-center animate-on-scroll" style={{animationDelay: "0.4s"}}>
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-4 relative z-10 transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-.75-6h1.5m-1.5-3H20.25a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75H18m0-9V5.25A2.25 2.25 0 0015.75 3H3.75A2.25 2.25 0 001.5 5.25v9.75a2.25 2.25 0 002.25 2.25h1.5m10.5-9V18m-10.5 0H18"/></svg>
                        </div>
                        <div className="step-card step-card-teal">
                            <p className="text-[10px] font-black text-teal-600 uppercase mb-1">Étape 5</p>
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">Livraison Suivie</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Livré avec numéro de suivi partout en CI.</p>
                        </div>
                    </div>
                </div>

                {/*  CTA  */}
                <div className="text-center mt-10">
                    <a href="login.html" className="btn-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 inline-flex items-center gap-2">
                        Créer mon compte & Commander
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </a>
                    <p className="text-xs text-gray-400 mt-2">Compte gratuit — Suivi en temps réel inclus</p>
                </div>
            </div>
        </section>

        {/*  ====== RÉALISATIONS (DB-DRIVEN) ======  */}
        <section id="realisations" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-1">Nos Références</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">Nos Réalisations</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Découvrez l'étendue de notre savoir-faire à travers nos projets.</p>
                    </div>
                    <a href="realisations.html" className="text-sm font-bold text-orange-500 border border-orange-200 dark:border-orange-900/50 px-4 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition whitespace-nowrap">Voir tout →</a>
                </div>

                {/*  Filtres  */}
                <div id="real-filter-btns" className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => { /* filterRealisations('all') */ }} className="real-filter-btn active px-4 py-2 rounded-xl text-xs font-black bg-orange-500 text-white" data-cat="all">Tous</button>
                    <button onClick={() => { /* filterRealisations('impression') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="impression">Impression</button>
                    <button onClick={() => { /* filterRealisations('textile') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="textile">Textile</button>
                    <button onClick={() => { /* filterRealisations('packaging') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="packaging">Packaging</button>
                    <button onClick={() => { /* filterRealisations('publicitaire') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="publicitaire">Publicitaire</button>
                    <button onClick={() => { /* filterRealisations('grand-format') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="grand-format">Grand Format</button>
                    <button onClick={() => { /* filterRealisations('signaletique') */ }} className="real-filter-btn px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300" data-cat="signaletique">Signalétique</button>
                </div>

                <div id="realisations-grid" className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : realisations.length > 0 ? (
                        realisations.map((real, idx) => (
                            <div key={real.id} className="realisation-card group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-on-scroll">
                                <div className="h-48 overflow-hidden">
                                    <img src={real.imageUrl} alt={real.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                </div>
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-md">{real.category}</div>
                                <div className="p-5">
                                    <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{real.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{real.clientName}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{real.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">Aucune réalisation trouvée.</div>
                    )}
                </div>

                {/*  Modal Réalisation  */}
                <div id="real-modal" className="hidden fixed inset-0 z-[200] flex items-center justify-center p-4" style={{background: "rgba(0,0,0,0.85)"}} onClick={() => { /* if(event.target===this)closeRealModal() */ }}>
                    <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
                        <div className="relative">
                            <img id="real-modal-img" src="" alt="" className="w-full h-64 object-cover" />
                            <button onClick={() => { /* closeRealModal() */ }} className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">✕</button>
                            <span id="real-modal-cat" className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase"></span>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-400 mb-1" id="real-modal-client"></p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2" id="real-modal-title"></h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm" id="real-modal-desc"></p>
                            <div className="flex gap-3 mt-6">
                                <a href="services.html" className="btn-primary text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2">Commander similaire <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></a>
                                <button onClick={() => { /* closeRealModal() */ }} className="px-6 py-3 rounded-xl font-bold text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  ====== TÉMOIGNAGES (DB-DRIVEN) ======  */}
        <section id="temoignages" className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Ils nous font confiance</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3">Avis Clients</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">+500 clients satisfaits à travers la Côte d'Ivoire.</p>
                </div>
                <div id="testimonials-grid" className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/*  Rempli dynamiquement  */}
                </div>
            </div>
        </section>

        {/*  ====== BLOG (DB-DRIVEN) ======  */}
        <section id="blog" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-1">Ressources</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">Blog & Conseils</h2>
                    </div>
                    <a href="blog.html" className="text-sm font-bold text-orange-500 border border-orange-200 dark:border-orange-900/50 px-4 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition whitespace-nowrap">Tous les articles →</a>
                </div>

                <div id="blog-grid" className="grid md:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post, idx) => (
                            <Link href={`/blog-post`} key={post.id} className="blog-card group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-on-scroll">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 text-orange-500 font-black text-[10px] uppercase px-3 py-1.5 rounded-xl shadow-md">{post.category}</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">{post.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold uppercase">{post.author?.charAt(0) || 'T'}</div>
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{post.author || 'Équipe Touch+'}</span>
                                        </div>
                                        <span className="text-orange-500 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Lire <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">Aucun article de blog disponible.</div>
                    )}
                </div>
            </div>
        </section>

        {/*  ====== NEWSLETTER (DB-DRIVEN) ======  */}
        <section id="newsletter" className="py-20 px-4" style={{background: "linear-gradient(135deg,#f97316 0%,#f59e0b 100%)"}}>
            <div className="max-w-3xl mx-auto text-center">
                <div className="text-5xl mb-4">📬</div>
                <h2 className="text-4xl font-black text-white mb-3">Restez à la Pointe</h2>
                <p className="text-white/85 mb-8 text-sm">Recevez nos conseils, études de cas et promotions exclusives dans votre boîte mail.</p>
                <form 
                  id="newsletter-form" 
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = document.getElementById('nl-email')?.value;
                    const msgEl = document.getElementById('nl-msg');
                    if (msgEl) {
                      msgEl.innerText = `Merci ! L'adresse ${email} a bien été enregistrée.`;
                      msgEl.classList.remove('hidden');
                      msgEl.className = "text-white text-xs mt-3 bg-green-500/20 py-2.5 px-4 rounded-xl border border-green-500/30 inline-block";
                    }
                  }}
                >
                    <input type="email" id="nl-email" required placeholder="votre.email@exemple.com" className="flex-grow px-5 py-3.5 rounded-xl border-2 border-transparent focus:border-white focus:outline-none text-gray-800 text-sm font-semibold" />
                    <button type="submit" className="bg-white text-orange-500 px-7 py-3.5 rounded-xl font-black text-sm shadow-lg hover:bg-gray-100 transition-all whitespace-nowrap">Je m'inscris</button>
                </form>
                <p id="nl-msg" className="text-white/80 text-xs mt-3 hidden"></p>
            </div>
        </section>

        {/*  ====== FAQ ======  */}
        <section id="faq" className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">FAQ</p>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Questions Fréquentes</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Nous avons les réponses à vos questions.</p>
                </div>
                <div className="space-y-4">
                    <details className="faq-item group">
                        <summary className="cursor-pointer">Quels sont vos délais de livraison ?</summary>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Nos délais standards sont de 5 à 7 jours ouvrés après validation du BAT. Un service Express (24h/48h) est disponible avec supplément.</p>
                    </details>
                    <details className="faq-item group">
                        <summary className="cursor-pointer">Quelle est la quantité minimum de commande ?</summary>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Ça dépend du produit. T-shirts sérigraphiés : 50 pièces min. Cartes de visite : 100. Contactez-nous pour un devis précis.</p>
                    </details>
                    <details className="faq-item group">
                        <summary className="cursor-pointer">Pouvez-vous m'aider avec le design graphique ?</summary>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Absolument ! Notre équipe de designers peut créer votre identité visuelle de A à Z ou adapter vos fichiers existants.</p>
                    </details>
                    <details className="faq-item group">
                        <summary className="cursor-pointer">Livrez-vous en dehors d'Abidjan ?</summary>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Oui, nous livrons partout en Côte d'Ivoire. Les frais hors Abidjan sont précisés dans votre devis.</p>
                    </details>
                    <details className="faq-item group">
                        <summary className="cursor-pointer">Comment puis-je suivre ma commande ?</summary>
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Depuis votre <strong>espace client</strong>, vous suivez chaque étape en temps réel : confirmation, maquette, BAT, production, livraison.</p>
                    </details>
                </div>
            </div>
        </section>

        {/*  ====== CONTACT (DB-DRIVEN) ======  */}
        <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Parlons de votre projet</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3">Contactez-Nous</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Devis gratuit sous 24h · Réponse garantie</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/*  Formulaire (3/5)  */}
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Demande de Devis</h3>

                        {/*  Statut form  */}
                        <div id="contact-success" className="hidden mb-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-800 dark:text-green-300 text-sm font-semibold flex items-center gap-3">
                            <span className="text-xl">✅</span> Votre message a été envoyé. Nous vous répondons sous 24h !
                        </div>
                        <div id="contact-error" className="hidden mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-300 text-sm font-semibold flex items-center gap-3">
                            <span className="text-xl">❌</span> <span id="contact-error-msg">Veuillez remplir tous les champs.</span>
                        </div>

                        <form id="contact-form" onSubmit={(e) => { e.preventDefault(); console.log('contact submit'); }} noValidate className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4 items-start">
                                <div>
                                    <label htmlFor="c-name" className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1.5 uppercase whitespace-nowrap">Nom complet *</label>
                                    <input type="text" id="c-name" required placeholder="Jean Kouamé" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                                </div>
                                <div>
                                    <label htmlFor="c-phone" className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1.5 uppercase whitespace-nowrap">Téléphone *</label>
                                    <input type="tel" id="c-phone" required placeholder="+225 07 XX XX XX" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="c-email" className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Email *</label>
                                <input type="email" id="c-email" required placeholder="votre.email@exemple.com" className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner" />
                            </div>
                            <div>
                                <label htmlFor="c-service" className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Service souhaité *</label>
                                <select id="c-service" required className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm shadow-inner">
                                    <option value="">Choisissez un service</option>
                                    <option value="impression">Impression Numérique</option>
                                    <option value="textile">Confection Textile</option>
                                    <option value="packaging">Packaging & Emballage</option>
                                    <option value="publicitaire">Objets Publicitaires</option>
                                    <option value="grand-format">Grand Format / Bâches</option>
                                    <option value="signaletique">Signalétique</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="c-msg" className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Votre projet *</label>
                                <textarea id="c-msg" required rows="4" placeholder="Décrivez votre projet : quantité, format, délai, besoins particuliers..." className="w-full px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-orange-500 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm resize-none shadow-inner" style={{minHeight: "120px;"}}></textarea>
                            </div>
                            <button type="submit" id="contact-submit-btn" className="btn-primary w-full text-white px-6 py-4 rounded-xl font-black shadow-lg hover:shadow-orange-500/40 transform hover:scale-[1.02] inline-flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z"/></svg>
                                Envoyer ma Demande
                            </button>
                            <p className="text-[11px] text-gray-400 text-center">En envoyant, vous acceptez d'être contacté par l'équipe Touch+ Services.</p>
                        </form>
                    </div>

                    {/*  Infos (2/5)  */}
                    <div className="lg:col-span-2 space-y-5">
                        {/*  Coords  */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
                            <h3 className="font-black text-gray-900 dark:text-white mb-5 text-lg">Nos Coordonnées</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 mt-0.5">📞</div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Téléphone</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">+225 27 XX XX XX XX</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">+225 07 XX XX XX XX</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 mt-0.5">✉️</div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Email</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">contact@touchplus-services.ci</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-teal-400 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 mt-0.5">📍</div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">Adresse</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Koumassi 05, Abidjan, CI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  Horaires  */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
                            <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg">Horaires d'ouverture</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Lundi – Vendredi</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">08h – 18h</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Samedi</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">09h – 14h</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Dimanche</span>
                                    <span className="text-sm font-black text-red-500">Fermé</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                <span className="text-xs font-black text-green-700 dark:text-green-400">Actuellement Ouvert</span>
                            </div>
                        </div>
                        {/*  WhatsApp CTA  */}
                        <a href="https://wa.me/2250700000000?text=Bonjour%20Touch%2B%2C%20je%20souhaite%20un%20devis" target="_blank" className="flex items-center justify-between gap-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 shadow-lg transition group">
                            <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            <div>
                                <p className="font-black text-sm">Contacter sur WhatsApp</p>
                                <p className="text-[11px] text-white/80">Réponse rapide garantie</p>
                            </div>
                            <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/*  ====== ÉQUIPE ======  */}
        <section id="equipe" className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Des experts à votre service</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">Notre Équipe</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">Les visages derrière la réussite de vos projets d'impression et de communication.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/*  Membre 1  */}
                    <div className="team-card">
                        <div className="team-avatar-container">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" alt="Jean Kouamé" className="team-avatar-img" />
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base">Jean Kouamé</h3>
                        <p className="text-xs text-orange-500 font-bold uppercase mt-1">Directeur Général</p>
                    </div>
                    {/*  Membre 2  */}
                    <div className="team-card">
                        <div className="team-avatar-container">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" alt="Aïssata Diop" className="team-avatar-img" />
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base">Aïssata Diop</h3>
                        <p className="text-xs text-orange-500 font-bold uppercase mt-1">Responsable Commerciale</p>
                    </div>
                    {/*  Membre 3  */}
                    <div className="team-card">
                        <div className="team-avatar-container">
                            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" alt="Moussa Traoré" className="team-avatar-img" />
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base">Moussa Traoré</h3>
                        <p className="text-xs text-orange-500 font-bold uppercase mt-1">Chef d'Atelier</p>
                    </div>
                    {/*  Membre 4  */}
                    <div className="team-card">
                        <div className="team-avatar-container">
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" alt="Fatou Bamba" className="team-avatar-img" />
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-base">Fatou Bamba</h3>
                        <p className="text-xs text-orange-500 font-bold uppercase mt-1">Designer Graphique</p>
                    </div>
                </div>
            </div>
        </section>

        {/*  ====== PARTENAIRES ======  */}
        <section id="partenaires" className="py-16 px-4 bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-850">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ils nous font confiance</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center select-none">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">MTN CI</div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">Orange CI</div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">BOA CI</div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">Nestlé</div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">Total Energies</div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 text-center font-black text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:border-orange-500/50 dark:hover:text-orange-400 dark:hover:border-orange-400/50 hover:scale-105 hover:shadow-lg transition-all duration-300">Air CI</div>
                </div>
            </div>
        </section>

    
      </main>
      <Footer />
    </>
  );
}
  