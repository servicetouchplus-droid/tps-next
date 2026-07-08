import { prisma } from '@/lib/prisma';
import QuotesListClient from './QuotesListClient';

export default async function AdminQuotesPage() {
  let quotes = [];
  let adminUsers = [];

  try {
    quotes = await prisma.quote.findMany({
      where: { status: 'SENT' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
        files: true
      },
      orderBy: { createdAt: 'desc' }
    });

    adminUsers = await prisma.user.findMany({
      where: { primaryRole: 'ADMIN' },
      select: { id: true, name: true, email: true }
    });
  } catch (error) {
    console.error("Prisma error in admin quotes page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Devis en attente</h1>
        <p className="text-slate-500 dark:text-slate-400">Évaluez et convertissez les demandes de devis clients en commandes de production.</p>
      </div>

      <QuotesListClient quotes={quotes} adminUsers={adminUsers} />
    </div>
  );
}
