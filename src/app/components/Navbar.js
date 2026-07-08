'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group" aria-label="Touch+ Services - Accueil">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div>
                        <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">TOUCH+</span>
                        <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-widest -mt-0.5">Services</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">Accueil</Link>
                    <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">Services</Link>
                    <Link href="/realisations" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">Réalisations</Link>
                    <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">Blog</Link>
                    <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">À propos</Link>
                    <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-semibold text-sm transition-colors">Contact</Link>
                    
                    <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300" aria-label="Basculer le mode sombre">
                        {isDarkMode ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                        )}
                    </button>

                    {/* High Visibility Buttons */}
                    <Link href="/login" className="border-2 border-orange-500 text-orange-500 dark:text-orange-400 font-bold px-4 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs transition-all shadow-sm">
                        Espace Client
                    </Link>
                    <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all">
                        Inscription
                    </Link>
                    <Link href="/contact" className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-orange-300 hover:scale-105 transition-all">
                        Devis Gratuit →
                    </Link>
                </nav>

                {/* Mobile toggle */}
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-700 dark:text-gray-300 p-2" aria-label="Ouvrir le menu">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <nav className="flex flex-col gap-4 py-6 px-4">
                  <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">Accueil</Link>
                  <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">Services</Link>
                  <Link href="/realisations" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">Réalisations</Link>
                  <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">Blog</Link>
                  <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">À propos</Link>
                  <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-semibold py-2">Contact</Link>
                  <hr className="border-gray-200 dark:border-gray-800" />
                  <Link href="/login" className="text-orange-500 font-bold py-2">Mon Espace Client</Link>
                  <Link href="/register" className="text-orange-500 font-bold py-2">Inscription</Link>
                  <Link href="/contact" className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-bold text-center">Devis Gratuit</Link>
              </nav>
          </div>
        )}
    </header>
  );
}
