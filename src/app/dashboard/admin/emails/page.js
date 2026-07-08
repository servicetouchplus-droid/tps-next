import { prisma } from '@/lib/prisma';
import EmailTemplateClient from './EmailTemplateClient';

export default async function AdminEmailsPage() {
  let templates = [];
  try {
    templates = await prisma.emailTemplate.findMany();
  } catch (error) {
    console.error("Prisma error in admin emails page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Automatisations & Emails</h1>
        <p className="text-slate-500 dark:text-slate-400">Éditez les gabarits d'emails envoyés automatiquement aux clients lors des changements de statut.</p>
      </div>

      <EmailTemplateClient templates={templates} />
    </div>
  );
}
