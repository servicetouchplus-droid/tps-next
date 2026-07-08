import { prisma } from '@/lib/prisma';
import AtelierClient from './AtelierClient';

export default async function AdminAtelierPage() {
  let orders = [];
  let adminUsers = [];

  try {
    orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['MOCKUP', 'BAT', 'PRODUCTION', 'SHIPPED', 'DELIVERED']
        }
      },
      include: {
        items: true,
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    adminUsers = await prisma.user.findMany({
      where: { primaryRole: 'ADMIN' },
      select: { id: true, name: true, email: true }
    });
  } catch (error) {
    console.error("Prisma error in admin atelier page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Atelier & Production</h1>
        <p className="text-slate-500 dark:text-slate-400">Pilotez le flux de fabrication et suivez l'avancement des impressions par machine.</p>
      </div>

      <AtelierClient orders={orders} adminUsers={adminUsers} />
    </div>
  );
}
