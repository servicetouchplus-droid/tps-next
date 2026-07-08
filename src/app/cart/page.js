import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCart, removeFromCart, updateCartQuantity } from '../actions/cart';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CheckoutButton from './CheckoutButton';

// Fonction d'aide pour générer l'action de suppression (Server Action form)
function RemoveButton({ id }) {
  const remove = removeFromCart.bind(null, id);
  return (
    <form action={remove}>
      <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
        Supprimer
      </button>
    </form>
  );
}

export default async function CartPage() {
  const { items, error } = await getCart();

  if (error === 'Utilisateur non authentifié') {
    redirect('/login');
  }

  // Prix bidons pour la démo, en production cela viendrait d'une DB Produit
  const calculateTotal = () => {
      // Dans le futur, on liera l'id du produit à son prix réel
      return items.reduce((acc, item) => acc + (5000 * item.quantity), 0);
  }

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Votre Panier</h1>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => (
                    <li key={item.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                           Image
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.product}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantité : {item.quantity}
                          </p>
                          {/* Affichage des options (JSON) si elles existent */}
                          {item.options && (
                              <p className="text-xs text-gray-400 mt-1">
                                  {JSON.stringify(item.options)}
                              </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                           {5000 * item.quantity} FCFA
                        </p>
                        <RemoveButton id={item.id} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Résumé de la commande</h3>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{calculateTotal()} FCFA</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-gray-600 dark:text-gray-400">TVA (18%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{Math.round(calculateTotal() * 0.18)} FCFA</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700 mb-6" />
                <div className="flex justify-between mb-8">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-black text-orange-600">{calculateTotal() + Math.round(calculateTotal() * 0.18)} FCFA</span>
                </div>
                <CheckoutButton />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <svg className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Votre panier est vide</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Découvrez nos services d'impression premium et commencez à créer.</p>
              <Link href="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                Voir nos services
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
