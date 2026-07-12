import { getAllBestSellers } from '@/app/actions/bestsellers';
import BestSellerManager from './BestSellerManager';

export const metadata = {
  title: 'Gestion des Best-Sellers | Admin',
};

export default async function BestSellersPage() {
  const bestSellers = await getAllBestSellers();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Best-Sellers (Accueil)</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez les produits mis en avant sur la page d'accueil.</p>
        </div>
      </div>

      <BestSellerManager initialItems={bestSellers} />
    </div>
  );
}
