'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { loginAction } from '../actions/auth';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Connexion</h1>
                        <p className="text-gray-600 dark:text-gray-400">Accédez à votre compte pour suivre vos commandes</p>
                    </div>
                    
                    {state?.error && (
                      <div className="text-red-500 text-sm font-bold bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mb-4">
                        {state.error}
                      </div>
                    )}

                    <form className="space-y-6" action={formAction}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                            <input type="email" id="email" name="email" required placeholder="votre.email@exemple.com" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Mot de passe *</label>
                                <Link href="#" className="text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300">Mot de passe oublié ?</Link>
                            </div>
                            <input type="password" id="password" name="password" required placeholder="••••••••" className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none transition-all bg-white dark:bg-gray-700" />
                        </div>
                        
                        <div className="flex items-center">
                            <input type="checkbox" id="remember" name="remember" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400" />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Se souvenir de moi</label>
                        </div>
                        
                        <button type="submit" disabled={isPending} className="btn-primary w-full text-white px-6 py-4 rounded-full font-bold text-center inline-flex justify-center items-center text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed">
                            {isPending ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Vous n'avez pas encore de compte ? 
                            <Link href="/register" className="ml-1 text-orange-500 dark:text-orange-400 font-bold hover:text-orange-600 dark:hover:text-orange-300">Inscrivez-vous</Link>
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