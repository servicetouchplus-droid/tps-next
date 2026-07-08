import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-20 pb-10 border-t border-gray-100 dark:border-gray-800" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                <div className="col-span-1 lg:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-6 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">TOUCH+</span>
                        </div>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                        L'excellence en communication visuelle, impression et packaging à Abidjan. Notre expertise au service de votre marque.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        </a>
                        <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-wider">Services</h4>
                    <ul className="space-y-4">
                        <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Impression Numérique</Link></li>
                        <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Textile Personnalisé</Link></li>
                        <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Objets Publicitaires</Link></li>
                        <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Signalétique</Link></li>
                        <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Packaging</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-wider">L'Entreprise</h4>
                    <ul className="space-y-4">
                        <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Notre Histoire</Link></li>
                        <li><Link href="/realisations" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Nos Réalisations</Link></li>
                        <li><Link href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Actualités & Conseils</Link></li>
                        <li><Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm">Nous Contacter</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-sm tracking-wider">Contact</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Abidjan, Koumassi Zone Industrielle<br/>Côte d'Ivoire</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <span>+225 07 00 00 00 00</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            <span>contact@touchplus.ci</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                    &copy; 2026 Touch+ Services. Tous droits réservés.
                </p>
                <div className="flex items-center gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-4 object-contain opacity-50 grayscale hover:grayscale-0 transition-all"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-4 object-contain opacity-50 grayscale hover:grayscale-0 transition-all"/>
                </div>
            </div>
        </div>
    </footer>
  );
}
