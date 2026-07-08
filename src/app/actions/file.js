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
 * Ajouter un lien fichier externe à une commande (par le client)
 */
export async function addOrderFileAction(orderId, { url, name, expiresAt }) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== user.id) return { error: 'Accès refusé.' };

  const file = await prisma.orderFile.create({
    data: {
      orderId,
      name: name || 'Fichier source client',
      url,
      type: 'SOURCE',
      uploadedBy: user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath(`/dashboard/client/orders/${orderId}`);
  revalidatePath('/dashboard/client/files');
  revalidatePath(`/dashboard/admin/orders/${orderId}`);

  return { success: true, file };
}

/**
 * Renvoyer un nouveau lien (remplace l'ancien, marque l'ancien comme remplacé)
 */
export async function resendFileLinkAction(fileId, newUrl, newExpiresAt) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  // Verify ownership via the order
  const oldFile = await prisma.orderFile.findUnique({
    where: { id: fileId },
    include: { order: true },
  });
  if (!oldFile || oldFile.order.userId !== user.id) return { error: 'Accès refusé.' };

  // Create new file entry
  const newFile = await prisma.orderFile.create({
    data: {
      orderId: oldFile.orderId,
      name: oldFile.name + ' (mis à jour)',
      url: newUrl,
      type: 'SOURCE',
      uploadedBy: user.id,
      expiresAt: newExpiresAt ? new Date(newExpiresAt) : null,
    },
  });

  // Mark old file as replaced via a notes update
  await prisma.orderFile.update({
    where: { id: fileId },
    data: { notes: 'Remplacé par un nouveau lien', status: 'REJECTED' },
  });

  revalidatePath(`/dashboard/client/orders/${oldFile.orderId}`);
  revalidatePath('/dashboard/client/files');

  return { success: true, file: newFile };
}

/**
 * Récupérer tous les fichiers d'un client (pour la bibliothèque)
 */
export async function getClientFilesAction() {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.', files: [] };

  const files = await prisma.orderFile.findMany({
    where: {
      order: { userId: user.id },
      type: 'SOURCE',
      status: { not: 'REJECTED' },
    },
    include: {
      order: { select: { id: true, reference: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { files };
}

/**
 * Détecter les fichiers qui expirent bientôt (< 2 jours restants)
 */
export async function checkExpiringFilesAction() {
  const user = await getAuthUser();
  if (!user) return { expiring: [] };

  const inTwoDays = new Date();
  inTwoDays.setDate(inTwoDays.getDate() + 2);

  const expiring = await prisma.orderFile.findMany({
    where: {
      order: { userId: user.id },
      expiresAt: { lte: inTwoDays },
      status: { not: 'REJECTED' },
    },
    include: {
      order: { select: { id: true, reference: true } },
    },
  });

  return { expiring };
}
