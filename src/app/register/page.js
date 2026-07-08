'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { registerAction } from '../actions/auth';
import { useActionState } from 'react';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <>
      <Navbar />
      <div id="main-content" className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Inscription</h1>
                        <p className="text-gray-600 dark:text-gray-400">Créez votre compte pour commander</p>
                    </div>

                    {state?.error && (
                      <div className="text-red-500 text-sm font-bold bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mb-4">
                        {state.error}
                      </div>
                    )}

                    <form className="space-y-6" action={formAction}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom Complet *</label>
                            <input type="text" id="name" name="name" required placeholder="Jean Dupont" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>
                        
                        <div>
                            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Téléphone *</label>
                            <input type="tel" id="phone" name="phone" required placeholder="+225 07 00 00 00 00" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                            <input type="email" id="email" name="email" required placeholder="votre.email@exemple.com" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mot de passe *</label>
                            <input type="password" id="password" name="password" required placeholder="••••••••" minLength="6" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>
                        
                        <div className="flex items-start mt-4">
                            <div className="flex items-center h-5">
                                <input id="terms" type="checkbox" required className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">J'accepte les <a href="#" className="text-orange-500 hover:underline">Conditions d'utilisation</a></label>
                            </div>
                        </div>
                        
                        <button type="submit" disabled={isPending} className="btn-primary w-full text-white px-6 py-4 rounded-full font-bold text-center inline-flex justify-center items-center text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed">
                            {isPending ? 'Inscription...' : "S'inscrire"}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Déjà un compte ? 
                            <Link href="/login" className="ml-1 text-orange-500 dark:text-orange-400 font-bold hover:text-orange-600 dark:hover:text-orange-300">Connectez-vous</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}