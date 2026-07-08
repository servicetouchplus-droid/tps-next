'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Envoyer un message dans le fil d'une commande
 */
export async function sendOrderMessageAction(orderId, content) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  if (!content?.trim()) return { error: 'Le message ne peut pas être vide.' };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== user.id) return { error: 'Accès refusé.' };

  const message = await prisma.orderMessage.create({
    data: {
      orderId,
      userId: user.id,
      content: content.trim(),
      isInternal: false,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  // Notify admin via Notification model
  const admins = await prisma.user.findMany({ where: { primaryRole: 'ADMIN' } });
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        type: 'MESSAGE',
        title: `Nouveau message — ${order.reference || orderId.substring(0, 8)}`,
        body: content.substring(0, 100),
        link: `/dashboard/admin/orders/${orderId}`,
      })),
    });
  }

  revalidatePath(`/dashboard/client/orders/${orderId}`);
  revalidatePath(`/dashboard/admin/orders/${orderId}`);

  return { success: true, message };
}

/**
 * Marquer les messages d'une commande comme lus (côté client)
 */
export async function markMessagesReadAction(orderId) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  await prisma.orderMessage.updateMany({
    where: {
      orderId,
      userId: { not: user.id }, // Messages envoyés par l'admin
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath(`/dashboard/client/orders/${orderId}`);
  return { success: true };
}
