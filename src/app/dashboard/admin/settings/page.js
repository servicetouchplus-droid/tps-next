import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function AdminSettingsPage() {
  let configs = [];
  try {
    configs = await prisma.siteConfig.findMany();
  } catch (error) {
    console.error("Prisma error in settings page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Paramètres Généraux</h1>
        <p className="text-slate-500 dark:text-slate-400">Gérez les coordonnées d'entreprise, les paramètres de facturation, les taux de TVA et l'immatriculation légale.</p>
      </div>

      <SettingsClient configs={configs} />
    </div>
  );
}
